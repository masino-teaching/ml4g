import React, { useState, useEffect } from 'react';
import { RotateCcw, StepForward } from 'lucide-react';

const ShortestPathsVisualization = () => {
  // Sample network - adjacency list representation
  const [network] = useState({
    0: [1, 2],
    1: [0, 2, 3, 4],
    2: [0, 1, 4],
    3: [1, 5],
    4: [1, 2, 5, 6],
    5: [3, 4, 6],
    6: [4, 5]
  });

  const [sourceNode, setSourceNode] = useState(0);
  const [distances, setDistances] = useState({});
  const [paths, setPaths] = useState({});
  const [queue, setQueue] = useState([]);
  const [visited, setVisited] = useState(new Set());
  const [currentNodeI, setCurrentNodeI] = useState(null);
  const [currentNeighborJ, setCurrentNeighborJ] = useState(null);
  const [allNeighbors, setAllNeighbors] = useState([]);
  const [neighborActions, setNeighborActions] = useState([]);
  const [step, setStep] = useState(0);
  const [finalPaths, setFinalPaths] = useState({});
  const [algorithmStatus, setAlgorithmStatus] = useState('');

  // Node positions for visualization
  const nodePositions = {
    0: { x: 150, y: 100 },
    1: { x: 100, y: 200 },
    2: { x: 200, y: 200 },
    3: { x: 50, y: 300 },
    4: { x: 150, y: 300 },
    5: { x: 100, y: 400 },
    6: { x: 200, y: 400 }
  };

  const resetAlgorithm = () => {
    setDistances({ [sourceNode]: 0 });
    setPaths({ [sourceNode]: [] });
    setQueue([sourceNode]);
    setVisited(new Set());
    setCurrentNodeI(null);
    setCurrentNeighborJ(null);
    setAllNeighbors([]);
    setNeighborActions([]);
    setStep(0);
    setFinalPaths({});
    setAlgorithmStatus('Ready to start BFS');
  };

  useEffect(() => {
    resetAlgorithm();
  }, [sourceNode]);

  const reconstructPaths = () => {
    const reconstructedPaths = {};
    
    Object.keys(distances).forEach(nodeStr => {
      const node = parseInt(nodeStr);
      if (node === sourceNode) {
        reconstructedPaths[node] = [[sourceNode]];
        return;
      }
      
      const allPathsToNode = [];
      
      const buildPaths = (currentNode, currentPath) => {
        if (currentNode === sourceNode) {
          allPathsToNode.push([sourceNode, ...currentPath]);
          return;
        }
        
        const predecessors = paths[currentNode] || [];
        if (predecessors.length === 0) return;
        
        predecessors.forEach(pred => {
          buildPaths(pred, [currentNode, ...currentPath]);
        });
      };
      
      buildPaths(node, []);
      reconstructedPaths[node] = allPathsToNode;
    });
    
    setFinalPaths(reconstructedPaths);
  };

  const stepAlgorithm = () => {
    if (queue.length === 0) {
      setAlgorithmStatus('Algorithm complete - reconstructing paths');
      reconstructPaths();
      return false;
    }

    const currentQ = [...queue];
    const nodeI = currentQ.shift(); // Current node i at distance d
    setCurrentNodeI(nodeI);
    setAlgorithmStatus(`Processing node i=${nodeI} at distance d=${distances[nodeI]}`);
    
    // Always mark as visited and process neighbors
    const newVisited = new Set([...visited, nodeI]);
    setVisited(newVisited);
    
    const neighbors = network[nodeI] || [];
    setAllNeighbors(neighbors);
    const currentDistanceD = distances[nodeI];
    
    const actions = [];
    const newDistances = { ...distances };
    const newPaths = { ...paths };
    
    neighbors.forEach(neighborJ => {
      if (!(neighborJ in newDistances)) {
        // Case i: j is previously unseen - set distance to d+1 and add i to paths[j]
        newDistances[neighborJ] = currentDistanceD + 1;
        newPaths[neighborJ] = [nodeI];
        if (!currentQ.includes(neighborJ)) {
          currentQ.push(neighborJ);
        }
        actions.push(`Neighbor ${neighborJ} unseen. Setting distance to ${currentDistanceD + 1}. Adding ${nodeI} to paths[${neighborJ}].`);
      } else if (newDistances[neighborJ] === currentDistanceD + 1) {
        // Case ii: j is previously seen and has distance d+1 - add i to paths[j]
        newPaths[neighborJ] = [...(newPaths[neighborJ] || []), nodeI];
        actions.push(`Neighbor ${neighborJ} already at distance ${currentDistanceD + 1}. Adding ${nodeI} to paths[${neighborJ}].`);
      } else {
        // Case iii: j has distance < d+1 - do nothing
        actions.push(`Neighbor ${neighborJ} has shorter distance ${newDistances[neighborJ]} < ${currentDistanceD + 1}. Do nothing.`);
      }
    });
    
    setDistances(newDistances);
    setPaths(newPaths);
    setNeighborActions(actions);
    setQueue(currentQ);
    setStep(prev => prev + 1);
    return true;
  };



  const getNodeColor = (node) => {
    if (node === sourceNode) return '#10b981'; // green
    if (node === currentNodeI) return '#f59e0b'; // yellow
    if (node === currentNeighborJ) return '#ef4444'; // red
    if (visited.has(node)) return '#6b7280'; // gray
    if (node in distances) return '#3b82f6'; // blue
    return '#e5e7eb'; // light gray
  };

  const renderNetwork = () => {
    const edges = [];
    Object.keys(network).forEach(node => {
      network[node].forEach(neighbor => {
        if (parseInt(node) < neighbor) { // Avoid duplicate edges
          const pos1 = nodePositions[node];
          const pos2 = nodePositions[neighbor];
          edges.push(
            <line
              key={`${node}-${neighbor}`}
              x1={pos1.x}
              y1={pos1.y}
              x2={pos2.x}
              y2={pos2.y}
              stroke="#6b7280"
              strokeWidth="2"
            />
          );
        }
      });
    });

    const nodes = Object.keys(nodePositions).map(node => {
      const pos = nodePositions[node];
      const nodeInt = parseInt(node);
      return (
        <g key={node}>
          <circle
            cx={pos.x}
            cy={pos.y}
            r="20"
            fill={getNodeColor(nodeInt)}
            stroke="#1f2937"
            strokeWidth="2"
            className="cursor-pointer"
            onClick={() => setSourceNode(nodeInt)}
          />
          <text
            x={pos.x}
            y={pos.y + 5}
            textAnchor="middle"
            className="fill-white font-bold select-none"
          >
            {node}
          </text>
          {distances[node] !== undefined && (
            <text
              x={pos.x}
              y={pos.y - 35}
              textAnchor="middle"
              className="fill-blue-600 font-bold text-sm"
            >
              d={distances[node]}
            </text>
          )}
        </g>
      );
    });

    return (
      <svg width="350" height="500" className="border border-gray-300">
        {edges}
        {nodes}
      </svg>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">All Shortest Paths Algorithm (Newman Ch 8.5.5)</h1>
      
      {/* Algorithm Description */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Pseudo Algorithm:</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li><strong>Create dictionary 'paths':</strong> Keys are node labels, values are lists of predecessor nodes</li>
          <li><strong>Conduct BFS:</strong> When examining neighbor j of node i at distance d:
            <ul className="list-disc list-inside ml-4 mt-1">
              <li><strong>Case i:</strong> If j is previously unseen → set distance(j) = d+1, add i to paths[j]</li>
              <li><strong>Case ii:</strong> If j is previously seen and has distance d+1 → add i to paths[j]</li>
              <li><strong>Case iii:</strong> If j has distance &lt; d+1 → do nothing</li>
            </ul>
          </li>
          <li><strong>Reconstruct paths:</strong> Starting at any node, follow predecessor chains in paths[] back to source s</li>
        </ol>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Network Visualization */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold mb-3">Network Graph</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Source Node s: 
              <select 
                value={sourceNode} 
                onChange={(e) => setSourceNode(parseInt(e.target.value))}
                className="ml-2 p-1 border rounded"
              >
                {Object.keys(nodePositions).map(node => (
                  <option key={node} value={node}>Node {node}</option>
                ))}
              </select>
            </label>
          </div>
          {renderNetwork()}
          <div className="mt-2 text-xs">
            <div className="flex items-center space-x-4">
              <div className="flex items-center"><div className="w-3 h-3 bg-green-500 rounded mr-1"></div>Source s</div>
              <div className="flex items-center"><div className="w-3 h-3 bg-yellow-500 rounded mr-1"></div>Current i</div>
              <div className="flex items-center"><div className="w-3 h-3 bg-red-500 rounded mr-1"></div>Neighbor j</div>
            </div>
          </div>
        </div>

        {/* Algorithm State */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold mb-3">Algorithm State</h3>
          
          <div className="space-y-4">
            <div>
              <strong>Step:</strong> {step}
            </div>
            
            <div className="text-sm bg-yellow-50 p-2 rounded">
              <strong>Status:</strong> {algorithmStatus}
            </div>
            
            <div>
              <strong>Queue:</strong> [{queue.join(', ')}]
            </div>
            
            <div>
              <strong>Current node i:</strong> {currentNodeI !== null ? currentNodeI : 'None'}
            </div>
            
            <div>
              <strong>Neighbors of node i:</strong> [{allNeighbors.join(', ')}]
            </div>
            
            {neighborActions.length > 0 && (
              <div>
                <strong>Actions for each neighbor:</strong>
                <div className="text-sm bg-yellow-50 p-2 rounded mt-1 max-h-32 overflow-y-auto">
                  {neighborActions.map((action, idx) => (
                    <div key={idx} className="mb-1">{action}</div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <strong>Distances:</strong>
              <div className="text-sm font-mono bg-gray-100 p-2 rounded mt-1">
                {Object.entries(distances).map(([node, dist]) => (
                  <div key={node}>{node}: {dist}</div>
                ))}
              </div>
            </div>

            <div>
              <strong>Paths (Predecessors):</strong>
              <div className="text-sm font-mono bg-gray-100 p-2 rounded mt-1">
                {Object.entries(paths).map(([node, preds]) => (
                  <div key={node}>{node}: [{preds.join(', ')}]</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Controls and Final Paths */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold mb-3">Controls</h3>
          
          <div className="space-y-3 mb-6">
            <div className="flex space-x-2">
              <button
                onClick={stepAlgorithm}
                className="flex items-center px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                <StepForward className="w-4 h-4 mr-1" />
                Step
              </button>
              
              <button
                onClick={resetAlgorithm}
                className="flex items-center px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </button>
            </div>
          </div>

          {Object.keys(finalPaths).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">All Shortest Paths from {sourceNode}</h3>
              <div className="text-sm bg-green-50 p-3 rounded max-h-64 overflow-y-auto">
                {Object.entries(finalPaths).map(([node, pathList]) => (
                  <div key={node} className="mb-2">
                    <strong>To node {node}:</strong>
                    {pathList.map((path, idx) => (
                      <div key={idx} className="ml-2 font-mono">
                        {path.join(' → ')}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShortestPathsVisualization;