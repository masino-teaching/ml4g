import React from 'react';

const WalkPathVisualization = () => {
  // Node positions for consistent layout
  const nodePositions = {
    A: { x: 80, y: 80 },
    B: { x: 200, y: 80 },
    C: { x: 320, y: 80 },
    D: { x: 140, y: 160 },
    E: { x: 260, y: 160 }
  };

  // Define examples
  const examples = [
    {
      title: 'Undirected Network - Walk',
      subtitle: 'A→B→D→E→B→C',
      directed: false,
      edges: [
        {from: 'A', to: 'B'},
        {from: 'B', to: 'C'},
        {from: 'B', to: 'D'},
        {from: 'D', to: 'E'},
        {from: 'E', to: 'B'},
        {from: 'C', to: 'E'}
      ],
      sequence: ['A', 'B', 'D', 'E', 'B', 'C'],
      highlightEdges: [
        {from: 'A', to: 'B', order: 1},
        {from: 'B', to: 'D', order: 2},
        {from: 'D', to: 'E', order: 3},
        {from: 'E', to: 'B', order: 4},
        {from: 'B', to: 'C', order: 5}
      ],
      description: 'WALK: Node B visited twice, forming a loop B→D→E→B',
      isPath: false
    },
    {
      title: 'Undirected Network - Path',
      subtitle: 'A→B→D→E→C',
      directed: false,
      edges: [
        {from: 'A', to: 'B'},
        {from: 'B', to: 'C'},
        {from: 'B', to: 'D'},
        {from: 'D', to: 'E'},
        {from: 'E', to: 'B'},
        {from: 'C', to: 'E'}
      ],
      sequence: ['A', 'B', 'D', 'E', 'C'],
      highlightEdges: [
        {from: 'A', to: 'B', order: 1},
        {from: 'B', to: 'D', order: 2},
        {from: 'D', to: 'E', order: 3},
        {from: 'E', to: 'C', order: 4}
      ],
      description: 'PATH: All nodes distinct, no repetition',
      isPath: true
    },
    {
      title: 'Directed Network - Walk',
      subtitle: 'A→B→D→E→B→C',
      directed: true,
      edges: [
        {from: 'A', to: 'B'},
        {from: 'B', to: 'C'},
        {from: 'B', to: 'D'},
        {from: 'D', to: 'E'},
        {from: 'E', to: 'B'},
        {from: 'E', to: 'C'}
      ],
      sequence: ['A', 'B', 'D', 'E', 'B', 'C'],
      highlightEdges: [
        {from: 'A', to: 'B', order: 1},
        {from: 'B', to: 'D', order: 2},
        {from: 'D', to: 'E', order: 3},
        {from: 'E', to: 'B', order: 4},
        {from: 'B', to: 'C', order: 5}
      ],
      description: 'WALK: Node B visited twice, edges follow direction',
      isPath: false
    },
    {
      title: 'Directed Network - Path',
      subtitle: 'A→B→D→E→C',
      directed: true,
      edges: [
        {from: 'A', to: 'B'},
        {from: 'B', to: 'C'},
        {from: 'B', to: 'D'},
        {from: 'D', to: 'E'},
        {from: 'E', to: 'B'},
        {from: 'E', to: 'C'}
      ],
      sequence: ['A', 'B', 'D', 'E', 'C'],
      highlightEdges: [
        {from: 'A', to: 'B', order: 1},
        {from: 'B', to: 'D', order: 2},
        {from: 'D', to: 'E', order: 3},
        {from: 'E', to: 'C', order: 4}
      ],
      description: 'PATH: All nodes distinct, edges follow direction',
      isPath: true
    }
  ];

  // Helper function to create arrow marker
  const createArrowMarker = (color = '#666', id = 'arrowhead') => (
    <marker
      id={id}
      markerWidth="8"
      markerHeight="6"
      refX="7"
      refY="3"
      orient="auto"
    >
      <polygon
        points="0 0, 8 3, 0 6"
        fill={color}
      />
    </marker>
  );

  // Helper function to draw edges
  const drawEdge = (from, to, isHighlighted = false, order = null, isDirected = false) => {
    const fromPos = nodePositions[from];
    const toPos = nodePositions[to];
    
    // Calculate edge positions (accounting for node radius)
    const nodeRadius = 16;
    const dx = toPos.x - fromPos.x;
    const dy = toPos.y - fromPos.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const unitX = dx / length;
    const unitY = dy / length;
    
    const startX = fromPos.x + unitX * nodeRadius;
    const startY = fromPos.y + unitY * nodeRadius;
    const endX = toPos.x - unitX * (isDirected ? nodeRadius + 4 : nodeRadius);
    const endY = toPos.y - unitY * (isDirected ? nodeRadius + 4 : nodeRadius);

    const color = isHighlighted ? '#e74c3c' : '#999';
    const width = isHighlighted ? 2.5 : 1.5;

    return (
      <g key={`${from}-${to}`}>
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke={color}
          strokeWidth={width}
          markerEnd={isDirected ? (isHighlighted ? 'url(#arrowhead-red)' : 'url(#arrowhead-gray)') : ''}
        />
        {isHighlighted && order && (
          <circle
            cx={(startX + endX) / 2}
            cy={(startY + endY) / 2}
            r="10"
            fill="#e74c3c"
            stroke="white"
            strokeWidth="1.5"
          />
        )}
        {isHighlighted && order && (
          <text
            x={(startX + endX) / 2}
            y={(startY + endY) / 2}
            textAnchor="middle"
            dy="0.3em"
            fill="white"
            fontSize="10"
            fontWeight="bold"
          >
            {order}
          </text>
        )}
      </g>
    );
  };

  const renderNetwork = (example, index) => {
    return (
      <div key={index} className="bg-white border border-gray-300 rounded-lg p-4">
        <div className="text-center mb-3">
          <h3 className="text-sm font-semibold text-gray-800">{example.title}</h3>
          <div className="text-xs font-mono text-gray-600 mt-1">{example.subtitle}</div>
        </div>
        
        <div className="flex justify-center mb-3">
          <svg width="400" height="240" className="border border-gray-200 rounded bg-gray-50">
            <defs>
              {createArrowMarker('#999', 'arrowhead-gray')}
              {createArrowMarker('#e74c3c', 'arrowhead-red')}
            </defs>
            
            {/* Draw all edges */}
            {example.edges.map(edge => {
              const highlightEdge = example.highlightEdges.find(
                h => (h.from === edge.from && h.to === edge.to) || 
                     (!example.directed && h.from === edge.to && h.to === edge.from)
              );
              return drawEdge(
                edge.from, 
                edge.to, 
                !!highlightEdge, 
                highlightEdge?.order,
                example.directed
              );
            })}
            
            {/* Draw nodes */}
            {Object.entries(nodePositions).map(([node, pos]) => {
              const visitCount = example.sequence.filter(n => n === node).length;
              const isRepeated = visitCount > 1;
              
              return (
                <g key={node}>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="16"
                    fill={isRepeated ? '#f39c12' : '#3498db'}
                    stroke={isRepeated ? '#e67e22' : '#2980b9'}
                    strokeWidth="2"
                  />
                  <text
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dy="0.3em"
                    fill="white"
                    fontSize="13"
                    fontWeight="bold"
                  >
                    {node}
                  </text>
                  {isRepeated && (
                    <text
                      x={pos.x}
                      y={pos.y + 28}
                      textAnchor="middle"
                      fill="#e67e22"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      ×{visitCount}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Description */}
        <div className={`text-center p-2 rounded text-xs ${example.isPath ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
          {example.description}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">Walks vs Paths in Networks</h1>
        <p className="text-center text-sm text-gray-600 mb-6">
          A <strong>walk</strong> allows repeated nodes; a <strong>path</strong> requires all nodes to be distinct
        </p>
        
        {/* Four examples in a 2x2 grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {examples.map((example, index) => renderNetwork(example, index))}
        </div>

        {/* Definitions and Legend */}
        <div className="bg-white rounded-lg border border-gray-300 p-4">
          <div className="grid md:grid-cols-3 gap-4 text-xs">
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">Walk Definition</h4>
              <p className="text-gray-700">
                A sequence of nodes where consecutive pairs are connected by edges. 
                Nodes and edges may be repeated.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-green-800 mb-1">Path Definition</h4>
              <p className="text-gray-700">
                A walk where all nodes are distinct. No node repetition means no edge repetition.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Legend</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Regular node</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span>Repeated node</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-0.5 bg-red-500"></div>
                  <span>Highlighted sequence</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalkPathVisualization;