import React, { useState } from 'react';

const NetworkPathVisualization = () => {
  const [selectedPower, setSelectedPower] = useState(1);
  const [highlightedPath, setHighlightedPath] = useState(null);

  // Define a simple network structure (no multiedges, no self-loops)
  const nodes = [
    { id: 0, x: 150, y: 100, label: '0' },
    { id: 1, x: 300, y: 50, label: '1' },
    { id: 2, x: 450, y: 100, label: '2' },
    { id: 3, x: 300, y: 200, label: '3' },
    { id: 4, x: 150, y: 250, label: '4' }
  ];

  const edges = [
    { from: 0, to: 1 },
    { from: 0, to: 3 },
    { from: 1, to: 2 },
    { from: 3, to: 2 },
    { from: 3, to: 4 },
    { from: 4, to: 0 }
  ];

  // For undirected network: A_ij = A_ji = 1 if there is an edge between nodes i and j
  const A = [
    [0, 1, 0, 1, 1],  // Node 0: connected to nodes 1, 3, 4
    [1, 0, 1, 0, 0],  // Node 1: connected to nodes 0, 2
    [0, 1, 0, 1, 0],  // Node 2: connected to nodes 1, 3
    [1, 0, 1, 0, 1],  // Node 3: connected to nodes 0, 2, 4
    [1, 0, 0, 1, 0]   // Node 4: connected to nodes 0, 3
  ];

  // Matrix multiplication function
  const multiplyMatrices = (a, b) => {
    const result = Array(5).fill().map(() => Array(5).fill(0));
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        for (let k = 0; k < 5; k++) {
          result[i][j] += a[i][k] * b[k][j];
        }
      }
    }
    return result;
  };

  // Calculate powers of adjacency matrix
  const calculatePower = (matrix, power) => {
    if (power === 1) return matrix;
    let result = matrix;
    for (let i = 2; i <= power; i++) {
      result = multiplyMatrices(result, matrix);
    }
    return result;
  };

  const currentMatrix = calculatePower(A, selectedPower);

  // Example paths following Newman's convention
  const examplePaths = {
    2: { 
      from: 0, 
      to: 2, 
      paths: [[0, 1, 2], [0, 3, 2]], 
      description: "Paths of length 2 from 0 to 2: 0→1→2 and 0→3→2" 
    },
    3: { 
      from: 0, 
      to: 4, 
      paths: [[0, 3, 4, 0]], 
      description: "Walk of length 3 from 0 to 0: 0→3→4→0" 
    }
  };

  const getEdgeColor = (from, to) => {
    if (!highlightedPath) return '#666';
    // Check if this edge is in any of the highlighted paths
    for (let path of highlightedPath.paths) {
      for (let i = 0; i < path.length - 1; i++) {
        if (path[i] === from && path[i + 1] === to) {
          return '#ff4444';
        }
      }
    }
    return '#666';
  };

  const getNodeColor = (nodeId) => {
    if (!highlightedPath) return '#4a90e2';
    // Check if this node is in any of the highlighted paths
    for (let path of highlightedPath.paths) {
      if (path.includes(nodeId)) {
        return '#ff4444';
      }
    }
    return '#4a90e2';
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Network Walks and Adjacency Matrix Powers</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Network Visualization */}
        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Network Graph (Simple Network)</h2>
          <svg width="500" height="300" className="border">
            {/* Edges */}
            {edges.map((edge, idx) => {
              const fromNode = nodes.find(n => n.id === edge.from);
              const toNode = nodes.find(n => n.id === edge.to);
              return (
                <g key={idx}>
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={getEdgeColor(edge.from, edge.to)}
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                  />
                </g>
              );
            })}
            
            {/* Arrow marker */}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                      refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
              </marker>
            </defs>
            
            {/* Nodes */}
            {nodes.map(node => (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="20"
                  fill={getNodeColor(node.id)}
                  stroke="#333"
                  strokeWidth="2"
                />
                <text
                  x={node.x}
                  y={node.y + 5}
                  textAnchor="middle"
                  fill="white"
                  fontSize="14"
                  fontWeight="bold"
                >
                  {node.label}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Matrix Visualization */}
        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">
            Adjacency Matrix A^{selectedPower}
          </h2>
          <div className="text-sm text-gray-600 mb-4">
            <p><strong>Undirected Network:</strong> A_ij = A_ji = 1 if edge between i and j (symmetric matrix)</p>
            <p><strong>Matrix Power:</strong> N_ij^(r) = [A^r]_ij = number of walks of length r from i to j</p>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Matrix Power (r):</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map(power => (
                <button
                  key={power}
                  onClick={() => setSelectedPower(power)}
                  className={`px-3 py-1 rounded ${
                    selectedPower === power 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {power}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-6 gap-1 text-sm">
            {/* Header row */}
            <div className="font-bold text-center">i\j</div>
            {[0, 1, 2, 3, 4].map(j => (
              <div key={j} className="font-bold text-center">{j}</div>
            ))}
            
            {/* Matrix rows */}
            {currentMatrix.map((row, i) => (
              <React.Fragment key={i}>
                <div className="font-bold text-center">{i}</div>
                {row.map((val, j) => (
                  <div 
                    key={j} 
                    className={`text-center p-2 border ${
                      val > 0 ? 'bg-green-100 font-bold' : 'bg-gray-50'
                    }`}
                  >
                    {val}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Path Examples */}
      <div className="mt-8 bg-white border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Example Walks</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded p-4">
            <h3 className="font-semibold mb-2">Paths of length 2 from 0 to 2</h3>
            <p className="text-sm text-gray-600 mb-2">
              Matrix element [A^2]₂₀ = {calculatePower(A, 2)[2][0]}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              Paths: 0→1→2 and 0→3→2
            </p>
            <button
              onClick={() => setHighlightedPath(examplePaths[2])}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 mr-2"
            >
              Highlight Paths
            </button>
            <button
              onClick={() => setSelectedPower(2)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Show A²
            </button>
          </div>

          <div className="border rounded p-4">
            <h3 className="font-semibold mb-2">Walks of length 3 from 0 to 0</h3>
            <p className="text-sm text-gray-600 mb-2">
              Matrix element [A^3]₀₀ = {calculatePower(A, 3)[0][0]}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              Example: 0→3→4→0 (closed walk)
            </p>
            <button
              onClick={() => setHighlightedPath(examplePaths[3])}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 mr-2"
            >
              Highlight Walk
            </button>
            <button
              onClick={() => setSelectedPower(3)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Show A³
            </button>
          </div>
        </div>
        
        <button
          onClick={() => setHighlightedPath(null)}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Clear Highlights
        </button>
      </div>

      {/* Mathematical Verification */}
      <div className="mt-8 bg-blue-50 border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Mathematical Verification</h2>
        <div className="text-sm space-y-3">
          <div>
            <h3 className="font-semibold">Paths of length 2 from 0 to 2:</h3>
            <p>Manual calculation: Sum over all intermediate nodes k: A₂ₖ × Aₖ₀</p>
            <p>= A₂₀×A₀₀ + A₂₁×A₁₀ + A₂₂×A₂₀ + A₂₃×A₃₀ + A₂₄×A₄₀</p>
            <p>= 0×0 + 1×1 + 0×0 + 1×1 + 0×1 = 2</p>
            <p>Matrix result: [A²]₂₀ = {calculatePower(A, 2)[2][0]} ✓</p>
          </div>
          
          <div>
            <h3 className="font-semibold">Walks of length 3 from 0 to 0:</h3>
            <p>This counts all closed walks of length 3 starting and ending at node 0</p>
            <p>Matrix result: [A³]₀₀ = {calculatePower(A, 3)[0][0]}</p>
            <p>Examples: 0→1→0→1, 0→3→0→3, 0→4→0→4, etc.</p>
          </div>
        </div>
      </div>

      {/* Key Concepts */}
      <div className="mt-8 bg-green-50 border-l-4 border-green-500 p-6">
        <h2 className="text-xl font-semibold mb-4">Key Concepts (Newman Ch. 6.11)</h2>
        <div className="space-y-3 text-sm">
          <p>
            <strong>Walk:</strong> Any sequence of nodes where consecutive pairs are connected by edges.
          </p>
          <p>
            <strong>Path:</strong> A walk that doesn't revisit any node (self-avoiding walk).
          </p>
          <p>
            <strong>Simple Network:</strong> No multiedges, no self-loops (as used here).
          </p>
          <p>
            <strong>Matrix Convention:</strong> For undirected networks, A_ij = A_ji = 1 if there's an edge between nodes i and j (symmetric matrix).
          </p>
          <p>
            <strong>Core Result:</strong> N_ij^(r) = [A^r]_ij gives the number of walks of length r from i to j.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NetworkPathVisualization;