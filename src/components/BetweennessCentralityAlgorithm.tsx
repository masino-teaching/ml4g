import React, { useState, useEffect } from 'react';

const BetweennessCentralityDemo = () => {
  // Fixed small network for demonstration (adjacency list representation)
  const network = {
    0: [1, 2],
    1: [0, 2, 3],
    2: [0, 1, 4],
    3: [1, 4],
    4: [2, 3]
  };
  
  const nodePositions = {
    0: { x: 100, y: 50 },
    1: { x: 50, y: 150 },
    2: { x: 150, y: 150 },
    3: { x: 100, y: 250 },
    4: { x: 200, y: 200 }
  };

  const [selectedSource, setSelectedSource] = useState(0);
  const [part1State, setPart1State] = useState('initial');
  const [part2State, setPart2State] = useState('disabled');
  const [currentStep, setCurrentStep] = useState(0);
  const [algorithmData, setAlgorithmData] = useState({});

  // Initialize algorithm state
  const initializePart1 = () => {
    const n = Object.keys(network).length;
    const s = selectedSource;
    
    const d = Array(n).fill(-1);
    const w = Array(n).fill(-1);
    const q = Array(n).fill(-1);
    const paths = {};
    
    d[s] = 0;
    w[s] = 1;
    q[0] = s;
    
    return {
      d, w, q, paths,
      p_r: 0,
      p_w: 1,
      s,
      currentNode: null,
      currentNeighbor: null,
      neighborIndex: 0,
      stepType: 'queue_check',
      completed: false,
      stepDescriptions: []
    };
  };

  useEffect(() => {
    setAlgorithmData(initializePart1());
    setCurrentStep(0);
    setPart1State('ready');
    setPart2State('disabled');
    setPart2Data({}); // Reset part 2 data when starting node changes
  }, [selectedSource]);

  const stepPart1 = () => {
    const data = { ...algorithmData };
    const { d, w, q, paths, p_r, p_w, s } = data;
    const n = Object.keys(network).length;

    if (data.stepType === 'queue_check') {
      if (p_r === p_w) {
        // Algorithm complete
        data.completed = true;
        data.stepDescriptions.push(`Queue empty (p_r=${p_r} == p_w=${p_w}). Part 1 complete.`);
        setPart1State('completed');
        setPart2State('ready');
      } else {
        // Get next node from queue
        data.currentNode = q[p_r];
        data.p_r = p_r + 1;
        data.neighborIndex = 0;
        data.stepType = 'process_neighbors';
        data.stepDescriptions.push(`Dequeue node ${data.currentNode} (p_r now ${data.p_r})`);
      }
    } else if (data.stepType === 'process_neighbors') {
      const i = data.currentNode;
      const neighbors = network[i];
      
      if (data.neighborIndex < neighbors.length) {
        const j = neighbors[data.neighborIndex];
        data.currentNeighbor = j;
        
        if (d[j] === -1) {
          // Case a: First time visiting this node
          d[j] = d[i] + 1;
          w[j] = w[i];
          paths[j] = [i];
          q[p_w] = j;
          data.p_w = p_w + 1;
          data.stepDescriptions.push(`Neighbor ${j}: first visit, d[${j}]=${d[j]}, w[${j}]=${w[j]}, paths[${j}]=[${i}], enqueue`);
        } else if (d[j] === d[i] + 1) {
          // Case b: Same distance path
          w[j] = w[j] + w[i];
          paths[j] = [...(paths[j] || []), i];
          data.stepDescriptions.push(`Neighbor ${j}: same distance, w[${j}]=${w[j]}, paths[${j}]=[${paths[j].join(',')}]`);
        } else {
          // Case c: Do nothing
          data.stepDescriptions.push(`Neighbor ${j}: longer path, do nothing`);
        }
        
        data.neighborIndex++;
      } else {
        // Done with all neighbors
        data.currentNeighbor = null;
        data.stepType = 'queue_check';
        data.stepDescriptions.push(`Finished processing neighbors of node ${i}`);
      }
    }

    setAlgorithmData(data);
    setCurrentStep(prev => prev + 1);
  };

  const runAllPart1 = () => {
    let data = { ...algorithmData };
    while (!data.completed) {
      const { d, w, q, paths, p_r, p_w } = data;
      
      if (data.stepType === 'queue_check') {
        if (p_r === p_w) {
          data.completed = true;
          break;
        } else {
          data.currentNode = q[p_r];
          data.p_r = p_r + 1;
          data.neighborIndex = 0;
          data.stepType = 'process_neighbors';
        }
      } else if (data.stepType === 'process_neighbors') {
        const i = data.currentNode;
        const neighbors = network[i];
        
        if (data.neighborIndex < neighbors.length) {
          const j = neighbors[data.neighborIndex];
          
          if (d[j] === -1) {
            d[j] = d[i] + 1;
            w[j] = w[i];
            paths[j] = [i];
            q[data.p_w] = j;
            data.p_w = data.p_w + 1;
          } else if (d[j] === d[i] + 1) {
            w[j] = w[j] + w[i];
            paths[j] = [...(paths[j] || []), i];
          }
          
          data.neighborIndex++;
        } else {
          data.currentNeighbor = null;
          data.stepType = 'queue_check';
        }
      }
    }
    
    data.stepDescriptions.push('Part 1 completed - all steps executed');
    setAlgorithmData(data);
    setPart1State('completed');
    setPart2State('ready');
  };

  const resetPart1 = () => {
    setAlgorithmData(initializePart1());
    setCurrentStep(0);
    setPart1State('ready');
    setPart2State('disabled');
    setPart2Data({}); // Reset part 2 data when part 1 is reset
  };

  const initializePart2 = () => {
    const { q, paths, d } = algorithmData;
    const n = Object.keys(network).length;
    
    // Find leaves (nodes not appearing as values in paths)
    const leaves = new Set();
    const allNodes = new Set(Object.keys(network).map(Number));
    const pathValues = new Set();
    
    Object.values(paths).forEach(pathList => {
      pathList.forEach(node => pathValues.add(node));
    });
    
    allNodes.forEach(node => {
      if (!pathValues.has(node)) {
        leaves.add(node);
      }
    });
    
    // Initialize scores
    const x = Array(n).fill(0);
    leaves.forEach(leaf => {
      x[leaf] = 1;
    });
    
    // Reverse queue (excluding -1 values)
    const validQueue = q.filter(node => node !== -1);
    const reversedQueue = [...validQueue].reverse();
    
    return {
      leaves,
      x,
      reversedQueue,
      currentIndex: 0,
      currentNode: null,
      nb: [],
      completed: false,
      stepDescriptions: [`Found leaves: {${Array.from(leaves).join(', ')}}`]
    };
  };

  const [part2Data, setPart2Data] = useState({});

  const startPart2 = () => {
    const data = initializePart2();
    setPart2Data(data);
    setPart2State('running');
  };

  const stepPart2 = () => {
    const data = { ...part2Data };
    const { reversedQueue, currentIndex, leaves, x } = data;
    const { paths, w } = algorithmData;
    
    if (currentIndex >= reversedQueue.length) {
      data.completed = true;
      data.stepDescriptions.push('Part 2 completed');
      setPart2State('completed');
      return;
    }
    
    const i = reversedQueue[currentIndex];
    data.currentNode = i;
    
    if (leaves.has(i)) {
      data.stepDescriptions.push(`Node ${i} is a leaf, skip`);
      data.currentIndex++;
    } else {
      // Find neighbors that precede i on shortest paths
      const nb = [];
      Object.keys(paths).forEach(nodeStr => {
        const node = parseInt(nodeStr);
        if (paths[node] && paths[node].includes(i)) {
          nb.push(node);
        }
      });
      
      data.nb = nb;
      
      // Calculate score
      let sum = 0;
      nb.forEach(j => {
        sum += (x[j] * w[i]) / w[j];
      });
      x[i] = 1 + sum;
      
      data.stepDescriptions.push(`Node ${i}: nb=[${nb.join(', ')}], x[${i}] = 1 + Σ(x[j]*w[${i}]/w[j]) = ${x[i].toFixed(2)}`);
      data.currentIndex++;
    }
    
    setPart2Data(data);
  };

  const resetPart2 = () => {
    setPart2Data({});
    setPart2State('ready');
  };

  const renderNetwork = () => {
    const { currentNode, currentNeighbor } = algorithmData;
    const currentNodePart2 = part2Data.currentNode;
    const nb = part2Data.nb || [];
    
    return (
      <svg width="300" height="300" className="border border-gray-300">
        {/* Edges */}
        {Object.entries(network).map(([node, neighbors]) =>
          neighbors.map(neighbor => {
            const start = nodePositions[parseInt(node)];
            const end = nodePositions[neighbor];
            return (
              <line
                key={`${node}-${neighbor}`}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="#666"
                strokeWidth="2"
              />
            );
          })
        )}
        
        {/* Nodes */}
        {Object.keys(network).map(nodeStr => {
          const node = parseInt(nodeStr);
          const pos = nodePositions[node];
          let fill = '#e5e7eb';
          
          if (part1State === 'running' || part1State === 'ready') {
            if (node === currentNode) fill = '#ef4444'; // Current node - red
            else if (node === currentNeighbor) fill = '#f97316'; // Current neighbor - orange
            else if (algorithmData.q && algorithmData.q.includes(node) && algorithmData.q[algorithmData.q.indexOf(node)] !== -1) {
              fill = '#eab308'; // In queue - yellow
            }
          } else if (part2State === 'running') {
            if (node === currentNodePart2) fill = '#ef4444'; // Current node - red
            else if (nb.includes(node)) fill = '#22c55e'; // Neighbor - green
          }
          
          return (
            <g key={node}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r="20"
                fill={fill}
                stroke="#374151"
                strokeWidth="2"
              />
              <text
                x={pos.x}
                y={pos.y + 5}
                textAnchor="middle"
                className="font-bold"
                fontSize="14"
              >
                {node}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Betweenness Centrality Algorithm</h1>
      
      {/* Algorithm Description */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Algorithm Overview</h2>
        <p className="mb-2">
          <strong>Note:</strong> This algorithm computes betweenness centrality for all nodes with respect to a <em>single starting node</em>. 
          To compute overall betweenness centrality, this process must be repeated for every possible starting node and the scores summed.
        </p>
        <p className="mb-2">
          <strong>Computational Complexity:</strong> O(n(m+n)) in general, O(n²) for sparse networks, where n = nodes, m = edges.
        </p>
        
        <div className="mt-4">
          <h3 className="font-semibold">Part 1: Modified BFS</h3>
          <ol className="list-decimal list-inside text-sm mt-2 space-y-1">
            <li>Initialize distance array d, weight array w, queue q (all length n, filled with -1), paths dictionary, p_r=0, p_w=1</li>
            <li>Set d[s]=0, w[s]=1, q[0]=s</li>
            <li>If p_r == p_w, stop; else get node i = q[p_r], increment p_r</li>
            <li>For each neighbor j of i:
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>If d[j]==-1: set d[j]=d[i]+1, w[j]=w[i], paths[j]=[i], q[p_w]=j, increment p_w</li>
                <li>If d[j]==d[i]+1: set w[j]=w[j]+w[i], paths[j]=paths[j]+[i]</li>
                <li>Otherwise: do nothing</li>
              </ul>
            </li>
            <li>Repeat from step 3</li>
          </ol>
          
          <h3 className="font-semibold mt-4">Part 2: Score Calculation</h3>
          <ol className="list-decimal list-inside text-sm mt-2 space-y-1">
            <li>Find "leaf" nodes (nodes not appearing as values in paths dictionary)</li>
            <li>Initialize score array x. Set x[l]=1 for each leaf l</li>
            <li>For each node i in reversed queue order:
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>If i is a leaf, continue</li>
                <li>Find neighbors nb that precede i on shortest paths to s</li>
                <li>Set x[i] = 1 + Σ(x[j] * w[i]/w[j]) for j ∈ nb</li>
              </ul>
            </li>
          </ol>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-4 mb-4">
          <label className="font-semibold">Starting Node (s):</label>
          <select 
            value={selectedSource} 
            onChange={(e) => setSelectedSource(parseInt(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {Object.keys(network).map(node => (
              <option key={node} value={node}>Node {node}</option>
            ))}
          </select>
        </div>
        
        <div className="flex gap-2 mb-4">
          <button 
            onClick={stepPart1}
            disabled={part1State === 'completed' || algorithmData.completed}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Step Part 1
          </button>
          <button 
            onClick={runAllPart1}
            disabled={part1State === 'completed' || algorithmData.completed}
            className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-300"
          >
            Run All Part 1
          </button>
          <button 
            onClick={resetPart1}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Reset Part 1
          </button>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => part2State === 'ready' ? startPart2() : stepPart2()}
            disabled={part2State === 'disabled' || part2Data.completed}
            className="px-4 py-2 bg-purple-500 text-white rounded disabled:bg-gray-300"
          >
            {part2State === 'ready' ? 'Start Part 2' : 'Step Part 2'}
          </button>
          <button 
            onClick={resetPart2}
            disabled={part2State === 'disabled'}
            className="px-4 py-2 bg-gray-500 text-white rounded disabled:bg-gray-300"
          >
            Reset Part 2
          </button>
        </div>
        
        {part2State === 'disabled' && (
          <p className="text-sm text-gray-600 mt-2">
            Part 2 controls are disabled until Part 1 is completed.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Network Visualization */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Network Visualization</h2>
          {renderNetwork()}
          <div className="mt-2 text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>Current Node</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <span>Current Neighbor</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span>In Queue</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Preceding Neighbor</span>
              </div>
            </div>
          </div>
        </div>

        {/* Algorithm State */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Algorithm State</h2>
          
          {part1State !== 'initial' && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Part 1 Variables</h3>
              <div className="text-sm bg-white p-3 rounded border">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div><strong>d (distance):</strong> [{algorithmData.d?.join(', ')}]</div>
                    <div className={part2State !== 'disabled' ? 'bg-yellow-200' : ''}>
                      <strong>w (weight):</strong> [{algorithmData.w?.join(', ')}]
                    </div>
                    <div><strong>q (queue):</strong> [{algorithmData.q?.join(', ')}]</div>
                  </div>
                  <div>
                    <div><strong>p_r:</strong> {algorithmData.p_r}</div>
                    <div><strong>p_w:</strong> {algorithmData.p_w}</div>
                    <div className={part2State !== 'disabled' ? 'bg-yellow-200' : ''}>
                      <strong>paths:</strong> {JSON.stringify(algorithmData.paths || {})}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {part2State !== 'disabled' && Object.keys(part2Data).length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Part 2 Variables</h3>
              <div className="text-sm bg-white p-3 rounded border">
                <div><strong>leaves:</strong> {'{' + Array.from(part2Data.leaves || []).join(', ') + '}'}</div>
                <div><strong>x (scores):</strong> [{part2Data.x?.map(val => val.toFixed(2)).join(', ')}]</div>
                <div><strong>nb (preceding neighbors):</strong> [{part2Data.nb?.join(', ')}]</div>
                <div><strong>reversed queue:</strong> [{part2Data.reversedQueue?.join(', ')}]</div>
              </div>
            </div>
          )}

          {/* Step Descriptions */}
          <div>
            <h3 className="font-semibold mb-2">Step-by-Step Description</h3>
            <div className="text-sm bg-white p-3 rounded border max-h-60 overflow-y-auto">
              {algorithmData.stepDescriptions?.map((desc, idx) => (
                <div key={idx} className="mb-1">{idx + 1}. {desc}</div>
              ))}
              {part2Data.stepDescriptions?.map((desc, idx) => (
                <div key={`p2-${idx}`} className="mb-1 text-purple-700">
                  P2-{idx + 1}. {desc}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetweennessCentralityDemo;