import React, { useState, useEffect, useCallback } from 'react';

const ClusteringCoefficientDemo = () => {
  // Fixed node positions for consistent layout
  const nodes = [
    { id: 0, x: 200, y: 100 },
    { id: 1, x: 300, y: 80 },
    { id: 2, x: 380, y: 140 },
    { id: 3, x: 360, y: 220 },
    { id: 4, x: 280, y: 260 },
    { id: 5, x: 200, y: 240 },
    { id: 6, x: 120, y: 200 },
    { id: 7, x: 100, y: 120 },
    { id: 8, x: 140, y: 160 },
    { id: 9, x: 250, y: 180 }
  ];

  // Initial edges - creating a network with some triangles
  const [edges, setEdges] = useState(new Set([
    '0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-0',
    '0-9', '1-9', '2-9', '4-9', '5-9', '8-5', '8-6', '8-9'
  ]));

  const [clusteringCoeff, setClusteringCoeff] = useState(0);
  const [pathsOfLengthTwo, setPathsOfLengthTwo] = useState(0);
  const [closedPaths, setClosedPaths] = useState(0);

  // Calculate clustering coefficient
  const calculateClusteringCoefficient = useCallback(() => {
    // Build adjacency list
    const adjList = {};
    nodes.forEach(node => {
      adjList[node.id] = [];
    });

    edges.forEach(edge => {
      const [u, v] = edge.split('-').map(Number);
      adjList[u].push(v);
      adjList[v].push(u);
    });

    let totalPathsOfLengthTwo = 0;
    let totalClosedPaths = 0;

    // For each node, count paths of length two starting from it
    nodes.forEach(node => {
      const nodeId = node.id;
      const neighbors = adjList[nodeId];
      
      // For each pair of neighbors, we have a path of length two
      for (let i = 0; i < neighbors.length; i++) {
        for (let j = 0; j < neighbors.length; j++) {
          if (i !== j) {
            totalPathsOfLengthTwo++;
            // Check if this path is closed (neighbors[i] and neighbors[j] are connected)
            if (edges.has(`${Math.min(neighbors[i], neighbors[j])}-${Math.max(neighbors[i], neighbors[j])}`)) {
              totalClosedPaths++;
            }
          }
        }
      }
    });

    setPathsOfLengthTwo(totalPathsOfLengthTwo);
    setClosedPaths(totalClosedPaths);
    setClusteringCoeff(totalPathsOfLengthTwo > 0 ? totalClosedPaths / totalPathsOfLengthTwo : 0);
  }, [edges]);

  useEffect(() => {
    calculateClusteringCoefficient();
  }, [calculateClusteringCoefficient]);

  // Check if an edge is part of a closed path (triangle)
  const isEdgeInTriangle = (edgeKey) => {
    const [u, v] = edgeKey.split('-').map(Number);
    
    // Build adjacency list
    const adjList = {};
    nodes.forEach(node => {
      adjList[node.id] = [];
    });
    edges.forEach(edge => {
      const [a, b] = edge.split('-').map(Number);
      adjList[a].push(b);
      adjList[b].push(a);
    });

    // Find common neighbors of u and v
    const neighborsU = new Set(adjList[u]);
    const neighborsV = new Set(adjList[v]);
    
    for (let neighbor of neighborsU) {
      if (neighborsV.has(neighbor)) {
        return true; // Found a triangle
      }
    }
    return false;
  };

  // Toggle edge
  const toggleEdge = (u, v) => {
    const edgeKey = `${Math.min(u, v)}-${Math.max(u, v)}`;
    const newEdges = new Set(edges);
    
    if (newEdges.has(edgeKey)) {
      newEdges.delete(edgeKey);
    } else {
      newEdges.add(edgeKey);
    }
    
    setEdges(newEdges);
  };

  // Reset to original configuration
  const resetToOriginal = () => {
    setEdges(new Set([
      '0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-0',
      '0-9', '1-9', '2-9', '4-9', '5-9', '8-5', '8-6', '8-9'
    ]));
  };

  // Create complete graph (clustering coefficient = 1)
  const createCompleteGraph = () => {
    const completeEdges = new Set();
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        completeEdges.add(`${i}-${j}`);
      }
    }
    setEdges(completeEdges);
  };

  // Generate all possible edges for click detection
  const allPossibleEdges = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      allPossibleEdges.push({ u: i, v: j });
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Interactive Clustering Coefficient Demo
        </h1>
        <p className="text-gray-600 mb-4">
          Click on the space between any two nodes to toggle edges. 
          The clustering coefficient measures the fraction of paths of length two that are closed (form triangles).
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700">Paths of Length Two</h3>
            <p className="text-2xl font-bold text-blue-600">{pathsOfLengthTwo}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700">Closed Paths</h3>
            <p className="text-2xl font-bold text-green-600">{closedPaths}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700">Clustering Coefficient</h3>
            <p className="text-2xl font-bold text-purple-600">{clusteringCoeff.toFixed(3)}</p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-blue-500"></div>
                <span>Edges in triangles (closed paths)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-gray-600"></div>
                <span>Other edges</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                <span>Nodes</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={resetToOriginal}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                Reset Original
              </button>
              <button
                onClick={createCompleteGraph}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
              >
                Complete Graph (C=1)
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <svg width="500" height="350" className="border border-gray-300 rounded-lg bg-gray-50">
          {/* Invisible click areas for toggling edges */}
          {allPossibleEdges.map(({ u, v }) => {
            const node1 = nodes[u];
            const node2 = nodes[v];
            const midX = (node1.x + node2.x) / 2;
            const midY = (node1.y + node2.y) / 2;
            
            return (
              <circle
                key={`click-${u}-${v}`}
                cx={midX}
                cy={midY}
                r="12"
                fill="transparent"
                className="cursor-pointer hover:fill-gray-200 hover:fill-opacity-30"
                onClick={() => toggleEdge(u, v)}
              />
            );
          })}

          {/* Render edges */}
          {Array.from(edges).map(edgeKey => {
            const [u, v] = edgeKey.split('-').map(Number);
            const node1 = nodes[u];
            const node2 = nodes[v];
            const isInTriangle = isEdgeInTriangle(edgeKey);
            
            return (
              <line
                key={edgeKey}
                x1={node1.x}
                y1={node1.y}
                x2={node2.x}
                y2={node2.y}
                stroke={isInTriangle ? '#3B82F6' : '#4B5563'}
                strokeWidth="2"
                className="pointer-events-none"
              />
            );
          })}

          {/* Render nodes */}
          {nodes.map(node => (
            <circle
              key={node.id}
              cx={node.x}
              cy={node.y}
              r="8"
              fill="#4B5563"
              className="pointer-events-none"
            />
          ))}

          {/* Node labels */}
          {nodes.map(node => (
            <text
              key={`label-${node.id}`}
              x={node.x}
              y={node.y - 15}
              textAnchor="middle"
              className="text-xs fill-gray-700 pointer-events-none font-medium"
            >
              {node.id}
            </text>
          ))}
        </svg>
      </div>

      <div className="mt-6 text-sm text-gray-600">
        <h3 className="font-semibold mb-2">How it works:</h3>
        <ul className="space-y-1">
          <li>• A <strong>path of length two</strong> is any sequence u→v→w where edges u-v and v-w exist</li>
          <li>• A path is <strong>closed</strong> if the third edge u-w also exists (forming a triangle)</li>
          <li>• <strong>Clustering coefficient</strong> = (closed paths) / (total paths of length two)</li>
          <li>• Click between nodes to add/remove edges and see how it affects the clustering coefficient</li>
        </ul>
      </div>
    </div>
  );
};

export default ClusteringCoefficientDemo;