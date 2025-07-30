import React, { useState, useEffect, useRef } from 'react';

// Tab types
type TabType = 'intro' | 'walks' | 'sampling' | 'loss';

// Shared utility functions
const sigmoid = (x: number): number => 1 / (1 + Math.exp(-x));
const dotProduct = (a: number[], b: number[]): number => a.reduce((sum, val, i) => sum + val * b[i], 0);

// Introduction Tab Component
const IntroSection = () => {
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);

  // Simple graph structure
  const nodes = [
    { id: 'A', x: 150, y: 100, color: '#4A90E2' },
    { id: 'B', x: 250, y: 80, color: '#7ED321' },
    { id: 'C', x: 300, y: 150, color: '#F5A623' },
    { id: 'D', x: 200, y: 200, color: '#D0021B' },
    { id: 'E', x: 100, y: 180, color: '#9013FE' },
    { id: 'F', x: 350, y: 220, color: '#50E3C2' }
  ];

  const edges = [
    { from: 'A', to: 'B' },
    { from: 'A', to: 'E' },
    { from: 'B', to: 'C' },
    { from: 'B', to: 'D' },
    { from: 'C', to: 'F' },
    { from: 'D', to: 'E' },
    { from: 'D', to: 'F' }
  ];

  // Node-specific embedding vectors
  const nodeEmbeddings = {
    'A': [0.23, -0.15, 0.08, '...', 0.42],
    'B': [-0.31, 0.67, -0.22, '...', -0.18],
    'C': [0.54, 0.09, 0.73, '...', 0.35],
    'D': [-0.12, -0.48, 0.91, '...', -0.67],
    'E': [0.88, -0.33, -0.14, '...', 0.29],
    'F': [-0.76, 0.41, 0.55, '...', -0.83]
  };

  // Animation cycle through nodes
  useEffect(() => {
    const interval = setInterval(() => {
      setHighlightedNode(prev => {
        const currentIndex = nodes.findIndex(node => node.id === prev);
        const nextIndex = (currentIndex + 1) % nodes.length;
        return nodes[nextIndex].id;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const getNodePosition = (nodeId: string) => {
    return nodes.find(node => node.id === nodeId);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="max-w-3xl text-slate-600 text-sm font-light leading-relaxed">
          <p className="mb-4">
            node2vec is a method for learning d-dimensional embeddings for nodes in a graph. It is an extension of the skipgram approach. It introduces the concept of biased random walks to allow for flexible graph exploration and negative sampling to approximate the per-node partition function in a computationally efficient manner. We'll explore each aspect of the method.
          </p>
        </div>
      </div>

      {/* Main visualization area */}
      <div className="flex items-center justify-between">
        {/* Graph */}
        <div className="flex-1">
          <h3 className="text-sm font-medium text-slate-600 mb-4 text-center">Network Structure</h3>
          <svg width="400" height="300" className="border border-slate-200 rounded-lg bg-white">
            {/* Edges */}
            {edges.map((edge, idx) => {
              const fromNode = getNodePosition(edge.from);
              const toNode = getNodePosition(edge.to);
              return fromNode && toNode ? (
                <line
                  key={idx}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke="#E2E8F0"
                  strokeWidth="2"
                  className="transition-all duration-300"
                />
              ) : null;
            })}
            
            {/* Nodes */}
            {nodes.map(node => (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={highlightedNode === node.id ? "18" : "15"}
                  fill={node.color}
                  className="transition-all duration-500 cursor-pointer"
                  style={{ 
                    opacity: highlightedNode === node.id ? 1 : 0.7,
                    filter: highlightedNode === node.id ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' : 'none'
                  }}
                  onMouseEnter={() => setHighlightedNode(node.id)}
                />
                <text
                  x={node.x}
                  y={node.y + 5}
                  textAnchor="middle"
                  className="text-white text-sm font-medium pointer-events-none"
                >
                  {node.id}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Arrow */}
        <div className="mx-8 flex flex-col items-center">
          <div className="text-slate-400 text-2xl mb-2">→</div>
        </div>

        {/* Embedding Matrix */}
        <div className="flex-1">
          <h3 className="text-sm font-medium text-slate-600 mb-4 text-center">Node Embeddings Matrix</h3>
          <div className="border border-slate-200 rounded-lg bg-white p-6 h-[300px] flex items-center justify-center">
            <div className="w-full max-w-[280px]">
              {/* Matrix representation */}
              <div className="text-center mb-4">
                <span className="text-xs text-slate-500 font-mono">N × d matrix</span>
              </div>
              
              <div className="border border-slate-300 rounded p-3 bg-slate-50">
                {/* Header row showing dimensions */}
                <div className="flex mb-2">
                  <div className="w-8"></div>
                  {[1, 2, 3, '...', 'd'].map((dim, idx) => (
                    <div key={idx} className="flex-1 text-center text-xs text-slate-500 font-mono">
                      {dim}
                    </div>
                  ))}
                </div>
                
                {/* Matrix rows */}
                {nodes.map((node, nodeIdx) => (
                  <div key={node.id} className="flex items-center mb-1 last:mb-0">
                    {/* Node label */}
                    <div className="w-8 text-xs font-medium text-slate-600 mr-2">
                      <span 
                        className="inline-block w-3 h-3 rounded-full mr-1"
                        style={{ backgroundColor: node.color, opacity: highlightedNode === node.id ? 1 : 0.7 }}
                      ></span>
                      {node.id}
                    </div>
                    
                    {/* Embedding values */}
                    {nodeEmbeddings[node.id as keyof typeof nodeEmbeddings].map((val, idx) => (
                      <div 
                        key={idx} 
                        className={`flex-1 text-center text-xs font-mono px-1 py-1 rounded transition-all duration-300 ${
                          highlightedNode === node.id 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'text-slate-600'
                        }`}
                      >
                        {typeof val === 'number' ? val.toFixed(2) : val}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-3 text-xs text-slate-500">
                Each row: d-dimensional vector for a node
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key insight */}
      <div className="mt-8 text-center">
        <div className="inline-block bg-white/80 px-4 py-2 rounded-lg border border-slate-200">
          <span className="text-sm text-slate-600 font-light">
            <strong className="text-slate-700">Goal:</strong> Nodes with similar network neighborhoods get similar vector representations
          </span>
        </div>
      </div>
    </div>
  );
};

// Random Walks Tab Component
const RandomWalksSection = () => {
  // Parameters
  const p = 0.5; // Return parameter
  const q = 2.0; // In-out parameter
  const r = 3; // Number of walks
  const walkLength = 4; // Length of each walk

  // Updated graph structure to show all distance cases
  const nodes = [
    { id: 'A', x: 200, y: 150, color: '#4A90E2' },
    { id: 'B', x: 100, y: 150, color: '#7ED321' },
    { id: 'C', x: 150, y: 80, color: '#F5A623' },
    { id: 'D', x: 280, y: 100, color: '#D0021B' },
    { id: 'E', x: 280, y: 200, color: '#9013FE' }
  ];

  const edges = [
    { from: 'A', to: 'B' },
    { from: 'A', to: 'C' },
    { from: 'A', to: 'D' },
    { from: 'A', to: 'E' },
    { from: 'B', to: 'C' }
  ];

  // Animation state
  const [currentWalk, setCurrentWalk] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedWalks, setCompletedWalks] = useState<string[][]>([]);
  const [currentPath, setCurrentPath] = useState(['A']); // Start at node A
  const [stepHistory, setStepHistory] = useState<any[]>([]);
  const [currentStepData, setCurrentStepData] = useState<any>(null);
  const [isComplete, setIsComplete] = useState(false);

  // Helper functions
  const getNeighbors = React.useCallback((nodeId: string) => {
    const neighbors: string[] = [];
    edges.forEach(edge => {
      if (edge.from === nodeId) neighbors.push(edge.to);
      if (edge.to === nodeId) neighbors.push(edge.from);
    });
    return neighbors;
  }, [edges]);

  const getDistance = React.useCallback((node1: string, node2: string) => {
    if (node1 === node2) return 0;
    if (getNeighbors(node1).includes(node2)) return 1;
    return 2;
  }, [getNeighbors]);

  const calculateTransitionProbs = React.useCallback((current: string, previous: string | null) => {
    const neighbors = getNeighbors(current);
    const weights: { [key: string]: number } = {};
    const distances: { [key: string]: number | string } = {};
    let totalWeight = 0;

    neighbors.forEach(neighbor => {
      let weight = 1; // Default weight
      let distance: number | string = 'N/A';
      
      if (previous) {
        distance = getDistance(previous, neighbor);
        if (distance === 0) {
          // Return to previous node
          weight = 1 / p;
        } else if (distance === 1) {
          // Node is also connected to previous
          weight = 1;
        } else {
          // Node is not connected to previous (distance = 2)
          weight = 1 / q;
        }
      }
      
      weights[neighbor] = weight;
      distances[neighbor] = distance;
      totalWeight += weight;
    });

    // Normalize to get probabilities
    const probabilities: { [key: string]: number } = {};
    Object.keys(weights).forEach(neighbor => {
      probabilities[neighbor] = weights[neighbor] / totalWeight;
    });

    return { probabilities, weights, distances, totalWeight };
  }, [getNeighbors, getDistance, p, q]);

  const selectNextNode = React.useCallback((probabilities: { [key: string]: number }) => {
    const rand = Math.random();
    
    let cumulative = 0;
    const ranges: { [key: string]: { start: string; end: string } } = {};
    let selectedNode: string | null = null;
    
    // First pass: build all ranges
    for (const [node, prob] of Object.entries(probabilities)) {
      const start = cumulative;
      cumulative += prob;
      ranges[node] = { start: start.toFixed(3), end: cumulative.toFixed(3) };
    }
    
    // Second pass: find selected node
    cumulative = 0;
    for (const [node, prob] of Object.entries(probabilities)) {
      cumulative += prob;
      if (rand <= cumulative && !selectedNode) {
        selectedNode = node;
        break;
      }
    }
    
    // Fallback
    if (!selectedNode) {
      selectedNode = Object.keys(probabilities)[0];
    }
    
    return { selectedNode, randomValue: rand, ranges };
  }, []);

  const stepForward = React.useCallback(() => {
    if (isComplete) return;

    const current = currentPath[currentPath.length - 1];
    const previous = currentPath.length > 1 ? currentPath[currentPath.length - 2] : null;
    
    // Calculate transition probabilities FROM the current node
    const { probabilities, weights, distances, totalWeight } = calculateTransitionProbs(current, previous);
    
    // Select next node
    const { selectedNode, randomValue, ranges } = selectNextNode(probabilities);
    
    // Create step data showing the calculation FROM current TO selected
    // BEFORE updating the path, so visualization shows the calculation state
    const stepData = {
      walkNumber: currentWalk + 1,
      stepNumber: currentStep + 1,
      currentNode: current, // The node we're calculating from
      previousNode: previous,
      neighbors: Object.keys(probabilities),
      weights: weights,
      distances: distances,
      totalWeight: totalWeight.toFixed(3),
      probabilities: probabilities,
      ranges: ranges,
      randomValue: randomValue.toFixed(3),
      selectedNode: selectedNode, // The node we selected to move to
      pathSoFar: [...currentPath], // Path before this step
      newPath: [...currentPath, selectedNode], // What the path will be after
      showingCalculation: true // Flag to indicate we're showing the calculation
    };

    // Set step data FIRST for visualization
    setCurrentStepData(stepData);
    
    // Add to step history
    setStepHistory(prev => [...prev, stepData]);
    
    // Then update the actual path after showing the calculation
    setTimeout(() => {
      const newPath = [...currentPath, selectedNode];
      setCurrentPath(newPath);
      
      // Update step data to show the result
      setCurrentStepData(prev => prev ? { ...prev, showingCalculation: false } : null);
      
      // Check if walk is complete
      if (newPath.length > walkLength) {
        // Complete current walk
        setCompletedWalks(prev => [...prev, newPath]);
        
        // Reset for next walk
        if (currentWalk < r - 1) {
          setCurrentWalk(prev => prev + 1);
          setCurrentStep(0);
          setCurrentPath(['A']); // Start next walk at A
          setCurrentStepData(null); // Clear step data when starting new walk
        } else {
          // All walks complete
          setIsComplete(true);
        }
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }, 2000); // 2 second delay to show the calculation
  }, [currentPath, currentWalk, currentStep, isComplete, calculateTransitionProbs, selectNextNode, walkLength, r]);

  const reset = () => {
    setCurrentWalk(0);
    setCurrentStep(0);
    setCompletedWalks([]);
    setCurrentPath(['A']);
    setStepHistory([]);
    setCurrentStepData(null);
    setIsComplete(false);
  };

  const getNodePosition = (nodeId: string) => {
    return nodes.find(node => node.id === nodeId);
  };

  // Use step data for visualization if available, otherwise show initial state
  const currentNode = currentStepData 
    ? (currentStepData.showingCalculation ? currentStepData.currentNode : currentStepData.selectedNode)
    : currentPath[currentPath.length - 1];
  const previousNode = currentStepData 
    ? (currentStepData.showingCalculation ? currentStepData.previousNode : currentStepData.currentNode)
    : null;
  const visualizationPath = currentStepData 
    ? (currentStepData.showingCalculation ? currentStepData.pathSoFar : currentStepData.newPath)
    : currentPath;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="text-slate-600 text-sm font-light leading-relaxed">
          <p className="mb-4">
            node2vec uses biased random walks to explore the graph structure. The transition probabilities depend on the distance 
            between the previous node and potential next nodes: distance 0 (return), distance 1 (local), or distance 2 (explore).
          </p>
        </div>
      </div>

      {/* Parameters Display */}
      <div className="mb-6 bg-white rounded-lg p-4 border border-slate-200">
        <h3 className="text-sm font-medium text-slate-700 mb-3">Parameters</h3>
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium text-slate-600">Return (p):</span>
            <span className="ml-2 font-mono text-blue-600">{p}</span>
          </div>
          <div>
            <span className="font-medium text-slate-600">In-out (q):</span>
            <span className="ml-2 font-mono text-blue-600">{q}</span>
          </div>
          <div>
            <span className="font-medium text-slate-600">Walks (r):</span>
            <span className="ml-2 font-mono text-blue-600">{r}</span>
          </div>
          <div>
            <span className="font-medium text-slate-600">Length:</span>
            <span className="ml-2 font-mono text-blue-600">{walkLength}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Panel: Graph Visualization */}
        <div>
          <h3 className="text-sm font-medium text-slate-600 mb-4">Graph & Current State</h3>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <svg width="350" height="280" className="w-full">
              {/* Edges */}
              {edges.map((edge, idx) => {
                const fromNode = getNodePosition(edge.from);
                const toNode = getNodePosition(edge.to);
                const isInPath = visualizationPath.includes(edge.from) && visualizationPath.includes(edge.to);
                
                return fromNode && toNode ? (
                  <line
                    key={idx}
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={isInPath ? "#3B82F6" : "#E2E8F0"}
                    strokeWidth={isInPath ? "3" : "2"}
                    className="transition-all duration-300"
                  />
                ) : null;
              })}
              
              {/* Transition probability arrows */}
              {currentStepData && (
                <>
                  {Object.entries(currentStepData.probabilities).map(([neighbor, prob]) => {
                    const currentPos = getNodePosition(currentNode);
                    const neighborPos = getNodePosition(neighbor);
                    const isSelected = neighbor === currentStepData.selectedNode;
                    
                    return currentPos && neighborPos ? (
                      <g key={neighbor}>
                        <line
                          x1={currentPos.x}
                          y1={currentPos.y}
                          x2={neighborPos.x}
                          y2={neighborPos.y}
                          stroke={isSelected ? "#DC2626" : "#F59E0B"}
                          strokeWidth={isSelected ? "4" : "2"}
                          strokeDasharray={isSelected ? "none" : "5,5"}
                          className="transition-all duration-300"
                        />
                        <text
                          x={(currentPos.x + neighborPos.x) / 2}
                          y={(currentPos.y + neighborPos.y) / 2 - 10}
                          textAnchor="middle"
                          className="text-xs font-mono fill-slate-700"
                          style={{ backgroundColor: 'white' }}
                        >
                          {typeof prob === 'number' ? prob.toFixed(3) : prob}
                        </text>
                      </g>
                    ) : null;
                  })}
                </>
              )}
              
              {/* Nodes */}
              {nodes.map(node => {
                const isCurrent = node.id === currentNode;
                const isPrevious = node.id === previousNode;
                const isSelected = currentStepData && node.id === currentStepData.selectedNode;
                
                return (
                  <g key={node.id}>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isCurrent ? "20" : "15"}
                      fill={node.color}
                      stroke={isCurrent ? "#DC2626" : isPrevious ? "#F59E0B" : isSelected ? "#10B981" : "none"}
                      strokeWidth={isCurrent || isPrevious || isSelected ? "3" : "0"}
                      className="transition-all duration-300"
                    />
                    <text
                      x={node.x}
                      y={node.y + 5}
                      textAnchor="middle"
                      className="text-white text-sm font-medium pointer-events-none"
                    >
                      {node.id}
                    </text>
                  </g>
                );
              })}
            </svg>
            
            {/* Legend */}
            <div className="mt-4 text-xs text-slate-600 space-y-1">
              <div className="flex items-center">
                <div className="w-3 h-3 border-2 border-red-600 rounded-full mr-2"></div>
                Current node
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 border-2 border-orange-500 rounded-full mr-2"></div>
                Previous node
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 border-2 border-green-600 rounded-full mr-2"></div>
                Selected next node
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-slate-600 mb-3">Controls</h3>
            <div className="flex gap-2">
              <button
                onClick={stepForward}
                disabled={isComplete}
                className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-sm"
              >
                Step
              </button>
              <button
                onClick={reset}
                className="px-3 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 text-sm"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Middle Panel: Current Step Details */}
        <div>
          <h3 className="text-sm font-medium text-slate-600 mb-4">Current Step Details</h3>
          
          {currentStepData && (
            <div className="space-y-4">
              {/* Step Info */}
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-slate-700 mb-2">Step Information</h4>
                <div className="text-sm space-y-1">
                  <div>Walk: {currentStepData.walkNumber}, Step: {currentStepData.stepNumber}</div>
                  <div>Current: <span className="font-mono text-blue-600">{currentStepData.currentNode}</span></div>
                  <div>Previous: <span className="font-mono text-orange-600">{currentStepData.previousNode || 'None'}</span></div>
                  <div>Path so far: {currentStepData.pathSoFar.join(' → ')}</div>
                  <div>Moving to: <span className="font-mono text-green-600">{currentStepData.selectedNode}</span></div>
                </div>
              </div>

              {/* Transition Calculations */}
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-slate-700 mb-2">Transition Calculations</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-1">Neighbor</th>
                        <th className="text-left p-1">Distance</th>
                        <th className="text-left p-1">Weight</th>
                        <th className="text-left p-1">Probability</th>
                        <th className="text-left p-1">Range</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentStepData.neighbors.map((neighbor: string) => (
                        <tr key={neighbor} className={neighbor === currentStepData.selectedNode ? 'bg-green-50' : ''}>
                          <td className="p-1 font-mono">{neighbor}</td>
                          <td className="p-1">{currentStepData.distances[neighbor]}</td>
                          <td className="p-1 font-mono">{currentStepData.weights[neighbor].toFixed(3)}</td>
                          <td className="p-1 font-mono">{currentStepData.probabilities[neighbor].toFixed(3)}</td>
                          <td className="p-1 font-mono text-xs">
                            [{currentStepData.ranges[neighbor].start}, {currentStepData.ranges[neighbor].end}]
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-2 text-sm">
                  <div>Total Weight: {currentStepData.totalWeight}</div>
                  <div>Random Value: <span className="font-mono text-red-600">{currentStepData.randomValue}</span></div>
                  <div>Selected: <span className="font-mono text-green-600">{currentStepData.selectedNode}</span></div>
                </div>
              </div>
            </div>
          )}

          {!currentStepData && (
            <div className="bg-white border border-slate-200 rounded-lg p-4 text-center text-slate-500">
              Click "Step" to see transition details
            </div>
          )}
        </div>

        {/* Right Panel: History and Completed Walks */}
        <div>
          {/* Step History */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-slate-600 mb-4">Step History (Scrolling Enabled)</h3>
            <div className="bg-white border border-slate-200 rounded-lg p-4 max-h-64 overflow-y-auto">
              {stepHistory.length === 0 ? (
                <div className="text-center text-slate-500 text-sm">No steps yet</div>
              ) : (
                <div className="space-y-2">
                  {stepHistory.map((step, idx) => (
                    <div key={idx} className="text-xs border border-slate-100 rounded p-2">
                      <div className="font-medium">W{step.walkNumber} S{step.stepNumber}: {step.currentNode} → {step.selectedNode}</div>
                      <div className="text-slate-600">Random: {step.randomValue}, Selected from {step.neighbors.join(', ')}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Completed Walks */}
          <div>
            <h3 className="text-sm font-medium text-slate-600 mb-4">Generated Walks</h3>
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="space-y-2">
                {completedWalks.map((walk, idx) => (
                  <div key={idx} className="text-sm font-mono text-slate-700 bg-slate-50 p-2 rounded">
                    Walk {idx + 1}: {walk.join(' → ')}
                  </div>
                ))}
                {!isComplete && currentPath.length > 0 && (
                  <div className="text-sm font-mono text-blue-600 bg-blue-50 p-2 rounded">
                    Walk {currentWalk + 1}: {currentPath.join(' → ')} (in progress...)
                  </div>
                )}
                {isComplete && (
                  <div className="text-sm text-green-600 font-medium mt-4">
                    ✓ All walks completed!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Context Sampling Tab Component
const ContextSamplingSection = () => {
  // Parameters
  const contextWindow = 2;
  const numNegativeSamples = 5;
  const totalNodes = 100;
  const walkLength = 7;

  // Nodes that appear in walks (10 different nodes)
  const walksNodes = ['n1', 'n3', 'n7', 'n12', 'n18', 'n23', 'n31', 'n42', 'n55', 'n67'];
  
  // All other nodes in the network (for negative sampling)
  const allNodes = Array.from({length: totalNodes}, (_, i) => `n${i + 1}`);
  const otherNodes = allNodes.filter(node => !walksNodes.includes(node));

  // Pre-generated random walks
  const randomWalks = [
    ['n1', 'n3', 'n7', 'n12', 'n3', 'n1', 'n23'],
    ['n18', 'n31', 'n7', 'n12', 'n42', 'n55', 'n67'],
    ['n23', 'n67', 'n31', 'n18', 'n1', 'n3', 'n7']
  ];

  const [selectedWalk, setSelectedWalk] = useState(0);
  const [selectedCenterPos, setSelectedCenterPos] = useState<number | null>(null);
  const [showSamples, setShowSamples] = useState(false);
  const [generatedSamples, setGeneratedSamples] = useState<any[]>([]);

  // Generate negative samples
  const generateNegativeSamples = (centerNode: string, contextNodes: string[]) => {
    const availableNodes = otherNodes.filter(node => 
      node !== centerNode && !contextNodes.includes(node)
    );
    
    const negatives = [];
    const usedNodes = new Set();
    
    for (let i = 0; i < numNegativeSamples; i++) {
      let attempts = 0;
      let selectedNode;
      
      do {
        const randomIndex = Math.floor(Math.random() * availableNodes.length);
        selectedNode = availableNodes[randomIndex];
        attempts++;
      } while (usedNodes.has(selectedNode) && attempts < 50);
      
      negatives.push(selectedNode);
      usedNodes.add(selectedNode);
    }
    return negatives;
  };

  // Extract all training samples from all walks
  const extractAllSamples = () => {
    const allSamples: any[] = [];
    let sampleId = 1;

    randomWalks.forEach((walk, walkIdx) => {
      // Every position can be a center node
      walk.forEach((centerNode, position) => {
        // Extract context window around this position
        const contextNodes = [];
        for (let i = Math.max(0, position - contextWindow); 
             i <= Math.min(walk.length - 1, position + contextWindow); 
             i++) {
          if (i !== position) { // Don't include center node itself
            contextNodes.push(walk[i]);
          }
        }

        if (contextNodes.length > 0) {
          // Generate positive pairs and negative samples
          const negativeSamples = generateNegativeSamples(centerNode, contextNodes);
          
          allSamples.push({
            id: sampleId++,
            walkId: walkIdx + 1,
            centerPosition: position,
            centerNode: centerNode,
            contextNodes: contextNodes,
            positivePairs: contextNodes.map(ctx => `(${centerNode}, ${ctx})`),
            negativeSamples: negativeSamples,
            negativePairs: negativeSamples.map(neg => `(${centerNode}, ${neg})`)
          });
        }
      });
    });

    return allSamples;
  };

  // Get context window for specific position
  const getContextWindow = (walkIdx: number, position: number) => {
    const walk = randomWalks[walkIdx];
    const contextNodes: Array<{ node: string; position: number }> = [];
    
    for (let i = Math.max(0, position - contextWindow); 
         i <= Math.min(walk.length - 1, position + contextWindow); 
         i++) {
      if (i !== position) {
        contextNodes.push({ node: walk[i], position: i });
      }
    }
    
    return contextNodes;
  };

  const generateSamples = () => {
    const samples = extractAllSamples();
    setGeneratedSamples(samples);
    setShowSamples(true);
  };

  const selectedWalkData = randomWalks[selectedWalk];
  const contextData = selectedCenterPos !== null ? getContextWindow(selectedWalk, selectedCenterPos) : [];
  const selectedCenterNode = selectedCenterPos !== null ? selectedWalkData[selectedCenterPos] : null;

  return (
    <div>
      <div className="mb-8">
        <div className="text-slate-600 text-sm font-light leading-relaxed">
          <p className="mb-4">
            After generating random walks, node2vec extracts training samples using a sliding context window. 
            For each position in a walk, the node at that position becomes the center node, and nodes within 
            the context window become positive samples. Negative samples are randomly selected from nodes 
            that don't appear in the context window.
          </p>
        </div>
      </div>

      {/* Parameters */}
      <div className="mb-6 bg-white rounded-lg p-4 border border-slate-200">
        <h3 className="text-sm font-medium text-slate-700 mb-3">Parameters</h3>
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium text-slate-600">Window (w):</span>
            <span className="ml-2 font-mono text-blue-600">{contextWindow}</span>
          </div>
          <div>
            <span className="font-medium text-slate-600">Negative (k):</span>
            <span className="ml-2 font-mono text-blue-600">{numNegativeSamples}</span>
          </div>
          <div>
            <span className="font-medium text-slate-600">Total Nodes:</span>
            <span className="ml-2 font-mono text-blue-600">{totalNodes}</span>
          </div>
          <div>
            <span className="font-medium text-slate-600">Walk Length:</span>
            <span className="ml-2 font-mono text-blue-600">{walkLength}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel: Random Walks Visualization */}
        <div>
          <h3 className="text-sm font-medium text-slate-600 mb-4">Random Walks & Context Windows</h3>
          
          {/* Walk Selection */}
          <div className="mb-4">
            <label className="text-sm text-slate-600 mb-2 block">Select Walk:</label>
            <select 
              value={selectedWalk} 
              onChange={(e) => {
                setSelectedWalk(parseInt(e.target.value));
                setSelectedCenterPos(null);
              }}
              className="px-3 py-2 border border-slate-300 rounded text-sm"
            >
              {randomWalks.map((_, idx) => (
                <option key={idx} value={idx}>Walk {idx + 1}</option>
              ))}
            </select>
          </div>

          {/* Walk Visualization */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-medium text-slate-700 mb-3">Walk {selectedWalk + 1}</h4>
            <div className="flex items-center space-x-2 mb-4 flex-wrap">
              {selectedWalkData.map((node, idx) => {
                const isInContext = contextData.some(ctx => ctx.position === idx);
                const isSelectedCenter = idx === selectedCenterPos;
                
                return (
                  <div key={idx} className="flex items-center">
                    <button
                      onClick={() => setSelectedCenterPos(idx)}
                      className={`px-3 py-2 rounded font-mono text-sm transition-all duration-200 cursor-pointer ${
                        isSelectedCenter
                          ? 'bg-red-500 text-white ring-2 ring-red-300'
                          : isInContext
                          ? 'bg-green-100 text-green-800 border border-green-300'
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-300'
                      }`}
                    >
                      {node}
                    </button>
                    {idx < selectedWalkData.length - 1 && (
                      <span className="text-slate-400 mx-1">→</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="text-xs space-y-1">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded mr-2"></div>
                <span>Any node (clickable to set as center)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                <span>Selected center node</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-100 border border-green-300 rounded mr-2"></div>
                <span>Context window (w={contextWindow})</span>
              </div>
            </div>
          </div>

          {/* Context Window Details */}
          {selectedCenterPos !== null && (
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-slate-700 mb-3">
                Context Window for center node {selectedCenterNode} at position {selectedCenterPos}
              </h4>
              {contextData.length > 0 ? (
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Context nodes:</span>
                    <span className="ml-2 font-mono text-green-600">
                      {contextData.map(ctx => ctx.node).join(', ')}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Window range:</span>
                    <span className="ml-2 font-mono text-slate-600">
                      [{Math.max(0, selectedCenterPos - contextWindow)}, {Math.min(selectedWalkData.length - 1, selectedCenterPos + contextWindow)}]
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Positive pairs:</span>
                    <div className="ml-2 font-mono text-blue-600 text-xs">
                      {contextData.map(ctx => `(${selectedCenterNode}, ${ctx.node})`).join(', ')}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-slate-500">No context nodes in window</div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel: All Walks and Samples */}
        <div>
          {/* All Walks Display */}
          <h3 className="text-sm font-medium text-slate-600 mb-4">All Random Walks</h3>
          <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4">
            <div className="space-y-2">
              {randomWalks.map((walk, idx) => (
                <div key={idx} className="text-sm font-mono">
                  <span className="text-slate-500 mr-2">Walk {idx + 1}:</span>
                  <span className="text-slate-700">{walk.join(' → ')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Context Window Explanation */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">How Context Windows Work</h4>
            <div className="text-xs text-blue-700 space-y-1">
              <div>• Every position in the walk can be a center node</div>
              <div>• Context window extends w={contextWindow} positions in each direction</div>
              <div>• Example: For center at position 2, context includes positions 0, 1, 3, 4</div>
              <div>• Each center-context pair becomes a positive training sample</div>
            </div>
          </div>

          {/* Generate Samples Button */}
          <div className="mb-4">
            <button
              onClick={generateSamples}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Generate All Training Samples
            </button>
          </div>

          {/* Training Samples Table */}
          {showSamples && (
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-slate-700 mb-3">
                Training Samples (Total: {generatedSamples.length})
              </h4>
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-white border-b">
                    <tr>
                      <th className="text-left p-2 border-r">Sample</th>
                      <th className="text-left p-2 border-r">Walk</th>
                      <th className="text-left p-2 border-r">Center Pos</th>
                      <th className="text-left p-2 border-r">Center Node</th>
                      <th className="text-left p-2 border-r">Context</th>
                      <th className="text-left p-2 border-r">Positive Pairs</th>
                      <th className="text-left p-2">Negative Samples</th>
                    </tr>
                  </thead>
                  <tbody>
                    {generatedSamples.map((sample, idx) => (
                      <tr key={sample.id} className={idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                        <td className="p-2 border-r font-mono">{sample.id}</td>
                        <td className="p-2 border-r font-mono">{sample.walkId}</td>
                        <td className="p-2 border-r font-mono">{sample.centerPosition}</td>
                        <td className="p-2 border-r font-mono text-red-600 font-medium">{sample.centerNode}</td>
                        <td className="p-2 border-r font-mono text-green-600">
                          {sample.contextNodes.join(', ')}
                        </td>
                        <td className="p-2 border-r font-mono text-blue-600 text-xs">
                          {sample.positivePairs.join(', ')}
                        </td>
                        <td className="p-2 font-mono text-orange-600 text-xs">
                          {sample.negativeSamples.join(', ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Summary */}
              <div className="mt-4 pt-4 border-t text-sm space-y-1">
                <div>
                  <span className="font-medium">Total center positions:</span>
                  <span className="ml-2 font-mono text-slate-600">
                    {randomWalks.length * walkLength} (all positions in all walks)
                  </span>
                </div>
                <div>
                  <span className="font-medium">Total positive pairs:</span>
                  <span className="ml-2 font-mono text-blue-600">
                    {generatedSamples.reduce((sum, sample) => sum + sample.positivePairs.length, 0)}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Total negative pairs:</span>
                  <span className="ml-2 font-mono text-orange-600">
                    {generatedSamples.reduce((sum, sample) => sum + sample.negativeSamples.length, 0)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Loss & Gradient Tab Component
const LossGradientSection = () => {
  // Parameters
  const learningRate = 0.01;
  const embeddingDim = 3; // Small dimension for visualization
  const k = 5; // Number of negative samples

  // Simplified network: 15 nodes with realistic connections
  const networkNodes = ['n1', 'n2', 'n3', 'n4', 'n5', 'n6', 'n7', 'n8', 'n9', 'n10', 'n11', 'n12', 'n13', 'n14', 'n15'];
  
  // Generate realistic training samples based on a small network structure
  const generateTrainingDataset = () => {
    const samples = [];
    
    // Core cluster: n1, n2, n3, n4 are well connected
    samples.push(
      { centerNode: 'n1', contextNodes: ['n2', 'n3'], negativeNodes: ['n8', 'n9', 'n12', 'n14', 'n15'] },
      { centerNode: 'n2', contextNodes: ['n1', 'n4'], negativeNodes: ['n7', 'n10', 'n11', 'n13', 'n15'] },
      { centerNode: 'n3', contextNodes: ['n1', 'n4'], negativeNodes: ['n9', 'n11', 'n12', 'n14', 'n15'] },
      { centerNode: 'n4', contextNodes: ['n2', 'n3'], negativeNodes: ['n8', 'n10', 'n13', 'n14', 'n15'] }
    );
    
    // Secondary cluster: n5, n6, n7 are connected
    samples.push(
      { centerNode: 'n5', contextNodes: ['n6', 'n7'], negativeNodes: ['n1', 'n3', 'n11', 'n13', 'n14'] },
      { centerNode: 'n6', contextNodes: ['n5', 'n7'], negativeNodes: ['n2', 'n4', 'n9', 'n12', 'n15'] },
      { centerNode: 'n7', contextNodes: ['n5', 'n6'], negativeNodes: ['n1', 'n3', 'n10', 'n11', 'n14'] }
    );
    
    // Bridge nodes: n8, n9 connect clusters
    samples.push(
      { centerNode: 'n8', contextNodes: ['n1', 'n9'], negativeNodes: ['n5', 'n6', 'n12', 'n13', 'n15'] },
      { centerNode: 'n9', contextNodes: ['n8', 'n2'], negativeNodes: ['n5', 'n7', 'n11', 'n14', 'n15'] }
    );
    
    // Peripheral nodes: n10-n15 are more isolated
    samples.push(
      { centerNode: 'n10', contextNodes: ['n11'], negativeNodes: ['n1', 'n2', 'n5', 'n6', 'n13'] },
      { centerNode: 'n11', contextNodes: ['n10', 'n12'], negativeNodes: ['n3', 'n4', 'n7', 'n8', 'n14'] },
      { centerNode: 'n12', contextNodes: ['n11', 'n13'], negativeNodes: ['n1', 'n5', 'n9', 'n14', 'n15'] },
      { centerNode: 'n13', contextNodes: ['n12'], negativeNodes: ['n2', 'n4', 'n6', 'n10', 'n15'] },
      { centerNode: 'n14', contextNodes: ['n15'], negativeNodes: ['n3', 'n7', 'n8', 'n10', 'n11'] },
      { centerNode: 'n15', contextNodes: ['n14'], negativeNodes: ['n1', 'n4', 'n9', 'n12', 'n13'] }
    );
    
    return samples;
  };

  // Network structure for visualization
  const networkEdges = [
    // Core cluster connections
    { from: 'n1', to: 'n2' },
    { from: 'n1', to: 'n3' },
    { from: 'n2', to: 'n4' },
    { from: 'n3', to: 'n4' },
    // Secondary cluster
    { from: 'n5', to: 'n6' },
    { from: 'n5', to: 'n7' },
    { from: 'n6', to: 'n7' },
    // Bridge connections
    { from: 'n1', to: 'n8' },
    { from: 'n8', to: 'n9' },
    { from: 'n9', to: 'n2' },
    // Peripheral connections
    { from: 'n10', to: 'n11' },
    { from: 'n11', to: 'n12' },
    { from: 'n12', to: 'n13' },
    { from: 'n14', to: 'n15' },
    // Some sparse long-range connections
    { from: 'n4', to: 'n10' },
    { from: 'n7', to: 'n13' }
  ];

  // Node positions for visualization
  const nodePositions = {
    // Core cluster (top-left)
    'n1': { x: 80, y: 60 },
    'n2': { x: 140, y: 60 },
    'n3': { x: 80, y: 120 },
    'n4': { x: 140, y: 120 },
    // Secondary cluster (top-right)
    'n5': { x: 220, y: 60 },
    'n6': { x: 280, y: 60 },
    'n7': { x: 250, y: 120 },
    // Bridge nodes (center)
    'n8': { x: 110, y: 160 },
    'n9': { x: 170, y: 160 },
    // Peripheral nodes (bottom)
    'n10': { x: 60, y: 200 },
    'n11': { x: 120, y: 220 },
    'n12': { x: 180, y: 220 },
    'n13': { x: 240, y: 200 },
    'n14': { x: 100, y: 260 },
    'n15': { x: 160, y: 260 }
  };

  const trainingDataset = generateTrainingDataset();
  const [sampleIndex, setSampleIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [lossHistory, setLossHistory] = useState<number[]>([]);
  const [gradients, setGradients] = useState<{ [key: string]: number[] }>({});
  const [showMath, setShowMath] = useState(true);
  const [trainingSample, setTrainingSample] = useState({
    centerNode: 'n1',
    contextNodes: ['n2', 'n3'],
    negativeNodes: ['n8', 'n9', 'n12', 'n14', 'n15']
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mock embeddings for 15 nodes
  const [embeddings, setEmbeddings] = useState({
    'n1': [0.2, -0.1, 0.3],
    'n2': [-0.1, 0.4, -0.2],
    'n3': [0.3, 0.1, -0.1],
    'n4': [0.1, -0.3, 0.2],
    'n5': [-0.2, 0.2, 0.1],
    'n6': [0.4, -0.1, -0.3],
    'n7': [-0.3, -0.2, 0.4],
    'n8': [0.2, 0.3, -0.1],
    'n9': [0.1, 0.2, -0.2],
    'n10': [-0.1, -0.1, 0.3],
    'n11': [0.2, -0.2, 0.1],
    'n12': [-0.3, 0.1, 0.2],
    'n13': [0.3, -0.1, -0.1],
    'n14': [-0.2, 0.3, 0.1],
    'n15': [0.1, -0.3, 0.2]
  });

  // Calculate loss for a specific sample
  const calculateLossForSample = (sample: any, currentEmbeddings: typeof embeddings = embeddings) => {
    if (!sample || !sample.centerNode || !currentEmbeddings[sample.centerNode as keyof typeof currentEmbeddings]) return 0;
    
    const centerEmb = currentEmbeddings[sample.centerNode as keyof typeof currentEmbeddings];
    let totalLoss = 0;

    // Positive samples loss
    if (sample.contextNodes) {
      sample.contextNodes.forEach((contextNode: string) => {
        const contextEmb = currentEmbeddings[contextNode as keyof typeof currentEmbeddings];
        if (contextEmb && contextEmb.length === embeddingDim) {
          const dot = dotProduct(centerEmb, contextEmb);
          const sigmoidVal = sigmoid(dot);
          totalLoss -= Math.log(Math.max(sigmoidVal, 1e-10));
        }
      });
    }

    // Negative samples loss
    if (sample.negativeNodes) {
      sample.negativeNodes.forEach((negNode: string) => {
        const negEmb = currentEmbeddings[negNode as keyof typeof currentEmbeddings];
        if (negEmb && negEmb.length === embeddingDim) {
          const dot = dotProduct(centerEmb, negEmb);
          const sigmoidVal = sigmoid(-dot);
          totalLoss -= Math.log(Math.max(sigmoidVal, 1e-10));
        }
      });
    }

    return totalLoss;
  };

  // Calculate gradients for a specific sample
  const calculateGradientsForSample = (sample: any, currentEmbeddings: typeof embeddings = embeddings) => {
    if (!sample || !sample.centerNode || !currentEmbeddings[sample.centerNode as keyof typeof currentEmbeddings]) return {};
    
    const centerEmb = currentEmbeddings[sample.centerNode as keyof typeof currentEmbeddings];
    const newGradients: { [key: string]: number[] } = {};

    // Initialize gradients for all relevant nodes
    const allRelevantNodes = [sample.centerNode];
    if (sample.contextNodes) allRelevantNodes.push(...sample.contextNodes);
    if (sample.negativeNodes) allRelevantNodes.push(...sample.negativeNodes);
    
    allRelevantNodes.forEach((node: string) => {
      if (currentEmbeddings[node as keyof typeof currentEmbeddings]) {
        newGradients[node] = [0, 0, 0];
      }
    });

    // Gradient for positive samples
    if (sample.contextNodes) {
      sample.contextNodes.forEach((contextNode: string) => {
        const contextEmb = currentEmbeddings[contextNode as keyof typeof currentEmbeddings];
        if (contextEmb && contextEmb.length === embeddingDim && newGradients[contextNode]) {
          const dot = dotProduct(centerEmb, contextEmb);
          const sigmoidVal = sigmoid(dot);
          const factor = sigmoidVal - 1;

          for (let i = 0; i < embeddingDim; i++) {
            newGradients[sample.centerNode][i] += factor * contextEmb[i];
            newGradients[contextNode][i] += factor * centerEmb[i];
          }
        }
      });
    }

    // Gradient for negative samples
    if (sample.negativeNodes) {
      sample.negativeNodes.forEach((negNode: string) => {
        const negEmb = currentEmbeddings[negNode as keyof typeof currentEmbeddings];
        if (negEmb && negEmb.length === embeddingDim && newGradients[negNode]) {
          const dot = dotProduct(centerEmb, negEmb);
          const sigmoidVal = sigmoid(-dot);
          const factor = sigmoidVal;

          for (let i = 0; i < embeddingDim; i++) {
            newGradients[sample.centerNode][i] += factor * negEmb[i];
            newGradients[negNode][i] += factor * centerEmb[i];
          }
        }
      });
    }

    return newGradients;
  };

  // Perform one SGD step
  const performSGDStep = () => {
    setSampleIndex(prevIndex => {
      const currentSample = trainingDataset[prevIndex % trainingDataset.length];
      
      // Update training sample first so UI reflects current sample
      setTrainingSample(currentSample);
      
      // Use current embeddings from state
      setEmbeddings(currentEmbeddings => {
        // Calculate loss and gradients with current sample using current embeddings
        const currentLoss = calculateLossForSample(currentSample, currentEmbeddings);
        const currentGradients = calculateGradientsForSample(currentSample, currentEmbeddings);
        
        // Update embeddings
        const newEmbeddings = { ...currentEmbeddings };
        Object.keys(currentGradients).forEach((node: string) => {
          if (newEmbeddings[node as keyof typeof newEmbeddings]) {
            for (let i = 0; i < embeddingDim; i++) {
              newEmbeddings[node as keyof typeof newEmbeddings][i] -= learningRate * currentGradients[node][i];
            }
          }
        });

        // Update other state
        setGradients(currentGradients);
        setLossHistory(prev => [...prev, currentLoss]);
        setCurrentStep(prev => prev + 1);
        
        return newEmbeddings;
      });
      
      return prevIndex + 1;
    });
  };

  const runAnimation = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    let stepCount = 0;
    const totalSamples = trainingDataset.length;
    intervalRef.current = setInterval(() => {
      performSGDStep();
      stepCount++;
      
      if (stepCount >= totalSamples) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setIsAnimating(false);
      }
    }, 800);
  };

  const reset = () => {
    // Stop any running animation
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setEmbeddings({
      'n1': [0.2, -0.1, 0.3],
      'n2': [-0.1, 0.4, -0.2],
      'n3': [0.3, 0.1, -0.1],
      'n4': [0.1, -0.3, 0.2],
      'n5': [-0.2, 0.2, 0.1],
      'n6': [0.4, -0.1, -0.3],
      'n7': [-0.3, -0.2, 0.4],
      'n8': [0.2, 0.3, -0.1],
      'n9': [0.1, 0.2, -0.2],
      'n10': [-0.1, -0.1, 0.3],
      'n11': [0.2, -0.2, 0.1],
      'n12': [-0.3, 0.1, 0.2],
      'n13': [0.3, -0.1, -0.1],
      'n14': [-0.2, 0.3, 0.1],
      'n15': [0.1, -0.3, 0.2]
    });
    setTrainingSample({
      centerNode: 'n1',
      contextNodes: ['n2', 'n3'],
      negativeNodes: ['n8', 'n9', 'n12', 'n14', 'n15']
    });
    setSampleIndex(0);
    setCurrentStep(0);
    setLossHistory([]);
    setGradients({});
    setIsAnimating(false);
  };

  const currentLoss = calculateLossForSample(trainingSample);

  return (
    <div>
      <div className="mb-8">
        <div className="text-slate-600 text-sm font-light leading-relaxed">
          <p className="mb-4">
            node2vec optimizes embeddings using the skip-gram objective with negative sampling. The loss function 
            maximizes the probability of observing context nodes while minimizing the probability of negative samples. 
            Stochastic Gradient Descent (SGD) is used to update embeddings after each training sample.
          </p>
        </div>
      </div>

      {/* Mathematical Formulation */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-slate-600">Mathematical Formulation</h3>
          <button
            onClick={() => setShowMath(!showMath)}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            {showMath ? 'Hide' : 'Show'} Math
          </button>
        </div>
        
        {showMath && (
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium text-slate-700 mb-2">Objective Function</h4>
                <div className="bg-slate-50 p-3 rounded font-mono text-sm">
                  L = -log σ(f(u)ᵀf(v₁)) - log σ(f(u)ᵀf(v₂)) - ... - log σ(-f(u)ᵀf(n₁)) - log σ(-f(u)ᵀf(n₂)) - ...
                </div>
                <div className="text-xs text-slate-600 mt-2">
                  Where: u = center node, v = context nodes, n = negative samples, σ = sigmoid function
                </div>
              </div>

              <div>
                <h4 className="font-medium text-slate-700 mb-2">SGD Update Rule</h4>
                <div className="bg-slate-50 p-3 rounded font-mono text-sm">
                  f(node) ← f(node) - α · ∂L/∂f(node)
                </div>
                <div className="text-xs text-slate-600 mt-2">
                  Where: α = learning rate = {learningRate}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Panel: Network Visualization */}
        <div>
          <h3 className="text-sm font-medium text-slate-600 mb-4">Network Structure</h3>
          
          {/* Network Graph */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4">
            <svg width="320" height="300" className="w-full">
              {/* Edges */}
              {networkEdges.map((edge, idx) => {
                const fromPos = nodePositions[edge.from as keyof typeof nodePositions];
                const toPos = nodePositions[edge.to as keyof typeof nodePositions];
                const isHighlighted = 
                  (edge.from === trainingSample.centerNode && trainingSample.contextNodes.includes(edge.to)) ||
                  (edge.to === trainingSample.centerNode && trainingSample.contextNodes.includes(edge.from));
                
                return (
                  <line
                    key={idx}
                    x1={fromPos.x}
                    y1={fromPos.y}
                    x2={toPos.x}
                    y2={toPos.y}
                    stroke={isHighlighted ? "#10B981" : "#E2E8F0"}
                    strokeWidth={isHighlighted ? "3" : "1"}
                    className="transition-all duration-300"
                  />
                );
              })}
              
              {/* Nodes */}
              {networkNodes.map(node => {
                const pos = nodePositions[node as keyof typeof nodePositions];
                const isCenter = node === trainingSample.centerNode;
                const isContext = trainingSample.contextNodes.includes(node);
                const isNegative = trainingSample.negativeNodes.includes(node);
                
                return (
                  <g key={node}>
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isCenter ? "12" : "8"}
                      fill={
                        isCenter ? "#DC2626" : 
                        isContext ? "#10B981" : 
                        isNegative ? "#F59E0B" : "#6B7280"
                      }
                      stroke={isCenter ? "#DC2626" : isContext ? "#10B981" : "none"}
                      strokeWidth={isCenter || isContext ? "2" : "0"}
                      className="transition-all duration-300"
                      style={{ 
                        opacity: isCenter || isContext || isNegative ? 1 : 0.4
                      }}
                    />
                    <text
                      x={pos.x}
                      y={pos.y + 4}
                      textAnchor="middle"
                      className="text-white text-xs font-medium pointer-events-none"
                      style={{ fontSize: '10px' }}
                    >
                      {node.substring(1)}
                    </text>
                  </g>
                );
              })}
            </svg>
            
            {/* Legend */}
            <div className="mt-3 text-xs space-y-1">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
                <span>Center node</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>Context nodes</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                <span>Negative samples</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-slate-500 rounded-full mr-2"></div>
                <span>Other nodes</span>
              </div>
            </div>
          </div>

          {/* Network Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Network Properties</h4>
            <div className="text-xs text-blue-700 space-y-1">
              <div>• 15 nodes, 16 edges (~0.2 density)</div>
              <div>• Core cluster: n1-n4 (dense)</div>
              <div>• Secondary cluster: n5-n7</div>
              <div>• Bridge nodes: n8-n9</div>
              <div>• Peripheral: n10-n15 (sparse)</div>
            </div>
          </div>
        </div>

        {/* Middle Panel: Current State */}
        <div>
          <h3 className="text-sm font-medium text-slate-600 mb-4">Current Embeddings & Loss</h3>
          
          {/* Controls */}
          <div className="mb-4 flex gap-2">
            <button
              onClick={runAnimation}
              disabled={isAnimating}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-slate-300 text-sm"
            >
              {isAnimating ? 'Running...' : 'Run one epoch'}
            </button>
            <button
              onClick={reset}
              className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 text-sm"
            >
              Reset
            </button>
          </div>

          {/* Training Sample */}
          <div className="mb-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="text-sm font-medium text-slate-700 mb-3">Current Training Sample (Step {currentStep})</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-red-600">Center Node:</span>
                <span className="ml-2 font-mono">{trainingSample.centerNode}</span>
              </div>
              <div>
                <span className="font-medium text-green-600">Context Nodes:</span>
                <span className="ml-2 font-mono">{trainingSample.contextNodes.join(', ')}</span>
              </div>
              <div>
                <span className="font-medium text-orange-600">Negative Samples:</span>
                <span className="ml-2 font-mono text-xs">{trainingSample.negativeNodes.join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Current Loss */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-medium text-slate-700 mb-2">
              Step {currentStep} - Current Loss: {currentLoss.toFixed(4)}
            </h4>
            {lossHistory.length > 1 && (
              <div className="text-xs text-slate-600">
                Change: {(currentLoss - lossHistory[lossHistory.length - 1]).toFixed(4)}
              </div>
            )}
          </div>

          {/* Embeddings Table */}
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-slate-700 mb-3">Node Embeddings</h4>
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-white border-b">
                  <tr>
                    <th className="text-left p-2 border-r">Node</th>
                    <th className="text-left p-2 border-r">Embedding</th>
                    <th className="text-left p-2">Gradient</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(embeddings).map(node => {
                    const isCenter = node === trainingSample.centerNode;
                    const isContext = trainingSample.contextNodes.includes(node);
                    const isNegative = trainingSample.negativeNodes.includes(node);
                    const gradient = gradients[node] || [0, 0, 0];
                    
                    return (
                      <tr key={node} className={
                        isCenter ? 'bg-red-50' : 
                        isContext ? 'bg-green-50' : 
                        isNegative ? 'bg-orange-50' : 'bg-white'
                      }>
                        <td className={`p-2 border-r font-mono font-medium ${
                          isCenter ? 'text-red-600' : 
                          isContext ? 'text-green-600' : 
                          isNegative ? 'text-orange-600' : 'text-slate-600'
                        }`}>
                          {node}
                        </td>
                        <td className="p-2 border-r font-mono text-xs">
                          [{embeddings[node as keyof typeof embeddings].map(v => v.toFixed(3)).join(', ')}]
                        </td>
                        <td className="p-2 font-mono text-xs">
                          [{gradient.map(g => g.toFixed(3)).join(', ')}]
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Panel: Loss Progress */}
        <div>
          <h3 className="text-sm font-medium text-slate-600 mb-4">Training Progress</h3>
          
          {/* Loss Chart */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-medium text-slate-700 mb-3">Loss Over Time</h4>
            {lossHistory.length > 0 ? (
              <div className="h-48 relative">
                <svg width="100%" height="100%" viewBox="0 0 400 180">
                  {/* Axes */}
                  <line x1="40" y1="160" x2="380" y2="160" stroke="#E2E8F0" strokeWidth="1" />
                  <line x1="40" y1="160" x2="40" y2="20" stroke="#E2E8F0" strokeWidth="1" />
                  
                  {/* Loss line */}
                  {lossHistory.length > 1 && (
                    <polyline
                      points={lossHistory.map((loss, idx) => {
                        const x = 40 + (idx / Math.max(lossHistory.length - 1, 1)) * 340;
                        const maxLoss = Math.max(...lossHistory);
                        const minLoss = Math.min(...lossHistory);
                        const y = 160 - ((loss - minLoss) / Math.max(maxLoss - minLoss, 0.001)) * 140;
                        return `${x},${y}`;
                      }).join(' ')}
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="2"
                    />
                  )}
                  
                  {/* Data points */}
                  {lossHistory.map((loss, idx) => {
                    const x = 40 + (idx / Math.max(lossHistory.length - 1, 1)) * 340;
                    const maxLoss = Math.max(...lossHistory);
                    const minLoss = Math.min(...lossHistory);
                    const y = 160 - ((loss - minLoss) / Math.max(maxLoss - minLoss, 0.001)) * 140;
                    return (
                      <circle
                        key={idx}
                        cx={x}
                        cy={y}
                        r="3"
                        fill="#3B82F6"
                      />
                    );
                  })}
                  
                  {/* Labels */}
                  <text x="200" y="180" textAnchor="middle" className="text-xs fill-slate-600">Step</text>
                  <text x="15" y="90" textAnchor="middle" className="text-xs fill-slate-600" transform="rotate(-90 15 90)">Loss</text>
                </svg>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-slate-500 text-sm">
                Run training to see loss progression
              </div>
            )}
          </div>

          {/* Computation Details */}
          {Object.keys(gradients).length > 0 && (
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-slate-700 mb-3">Current Step Computation</h4>
              <div className="space-y-3 text-xs">
                {/* Positive terms */}
                <div>
                  <div className="font-medium text-green-600 mb-1">Positive Terms:</div>
                  {trainingSample.contextNodes.map((contextNode: string) => {
                    const centerEmb = embeddings[trainingSample.centerNode as keyof typeof embeddings];
                    const contextEmb = embeddings[contextNode as keyof typeof embeddings];
                    const dot = dotProduct(centerEmb, contextEmb);
                    const sigmoidVal = sigmoid(dot);
                    
                    return (
                      <div key={contextNode} className="font-mono">
                        σ({trainingSample.centerNode}·{contextNode}) = σ({dot.toFixed(3)}) = {sigmoidVal.toFixed(3)}
                      </div>
                    );
                  })}
                </div>

                {/* Negative terms */}
                <div>
                  <div className="font-medium text-orange-600 mb-1">Negative Terms:</div>
                  {trainingSample.negativeNodes.slice(0, 3).map((negNode: string) => {
                    const centerEmb = embeddings[trainingSample.centerNode as keyof typeof embeddings];
                    const negEmb = embeddings[negNode as keyof typeof embeddings];
                    const dot = dotProduct(centerEmb, negEmb);
                    const sigmoidVal = sigmoid(-dot);
                    
                    return (
                      <div key={negNode} className="font-mono">
                        σ(-{trainingSample.centerNode}·{negNode}) = σ({(-dot).toFixed(3)}) = {sigmoidVal.toFixed(3)}
                      </div>
                    );
                  })}
                  {trainingSample.negativeNodes.length > 3 && (
                    <div className="text-slate-500">... and {trainingSample.negativeNodes.length - 3} more</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Node2Vec Component
const Node2Vec = () => {
  const [activeTab, setActiveTab] = useState<TabType>('intro');

  const tabs = [
    { id: 'intro' as TabType, label: 'Introduction', description: 'Overview of node2vec' },
    { id: 'walks' as TabType, label: 'Random Walks', description: 'Biased random walks' },
    { id: 'sampling' as TabType, label: 'Context Sampling', description: 'Training sample generation' },
    { id: 'loss' as TabType, label: 'Loss & Gradients', description: 'Learning the embeddings' }
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'intro':
        return <IntroSection />;
      case 'walks':
        return <RandomWalksSection />;
      case 'sampling':
        return <ContextSamplingSection />;
      case 'loss':
        return <LossGradientSection />;
      default:
        return <IntroSection />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg shadow-sm">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-light text-slate-700 mb-4 text-center">node2vec</h2>
        <p className="text-center text-slate-600 text-sm font-light max-w-4xl mx-auto">
          Learn how node2vec generates node embeddings through biased random walks, context sampling, and gradient-based optimization.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="flex flex-wrap justify-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-600 border border-slate-200'
              }`}
            >
              <div className="font-medium">{tab.label}</div>
              <div className="text-xs opacity-75">{tab.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {renderActiveTab()}
      </div>
    </div>
  );
};

export default Node2Vec;