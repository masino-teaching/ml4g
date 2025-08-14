import React, { useState } from 'react';

const GnnPermutationDemo = () => {
  const [activeTab, setActiveTab] = useState<'matrices' | 'invariance'>('matrices');

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-t-lg text-center">
        <h1 className="text-4xl font-light mb-2">Permutation Matrices & GNN Properties</h1>
        <p className="text-lg opacity-90">
          Interactive exploration of permutation matrices and their role in graph neural networks
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('matrices')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'matrices'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Permutation Matrices
          </button>
          <button
            onClick={() => setActiveTab('invariance')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'invariance'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Invariance & Equivariance
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'matrices' && <PermutationMatricesTab />}
        {activeTab === 'invariance' && <InvarianceEquivarianceTab />}
      </div>
    </div>
  );
};

const PermutationMatricesTab = () => {
  const [selectedOperation, setSelectedOperation] = useState<'left' | 'right'>('left');
  const [permutationType, setPermutationType] = useState<'identity' | 'swap01' | 'swap02' | 'cycle'>('identity');

  // Sample 3x3 matrix A
  const matrixA = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
  ];

  // Permutation matrices
  const getPermutationMatrix = (type: string) => {
    switch (type) {
      case 'identity':
        return [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
      case 'swap01':
        return [[0, 1, 0], [1, 0, 0], [0, 0, 1]]; // Swaps rows/cols 0 and 1
      case 'swap02':
        return [[0, 0, 1], [0, 1, 0], [1, 0, 0]]; // Swaps rows/cols 0 and 2
      case 'cycle':
        return [[0, 0, 1], [1, 0, 0], [0, 1, 0]]; // Cyclic permutation 0→1→2→0
      default:
        return [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    }
  };

  // Matrix operations
  const multiplyMatrices = (A: number[][], B: number[][]) => {
    const result = Array(A.length).fill(0).map(() => Array(B[0].length).fill(0));
    for (let i = 0; i < A.length; i++) {
      for (let j = 0; j < B[0].length; j++) {
        for (let k = 0; k < B.length; k++) {
          result[i][j] += A[i][k] * B[k][j];
        }
      }
    }
    return result;
  };

  const transpose = (matrix: number[][]) => {
    return matrix[0].map((_, i) => matrix.map(row => row[i]));
  };

  const formatMatrix = (matrix: number[][]) => {
    return matrix.map(row => `[${row.join(', ')}]`).join('\n');
  };

  const P = getPermutationMatrix(permutationType);
  const PA = multiplyMatrices(P, matrixA);
  const AP = multiplyMatrices(matrixA, P);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Understanding Permutation Matrices</h2>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-gray-700">
          <strong>Permutation Matrices:</strong> Square matrices that reorder rows or columns when multiplied with other matrices.
          Each row and column contains exactly one 1 and zeros elsewhere.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Operation Type:</label>
            <select 
              value={selectedOperation} 
              onChange={(e) => setSelectedOperation(e.target.value as 'left' | 'right')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="left">P × A (Left Multiplication)</option>
              <option value="right">A × P (Right Multiplication)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Permutation:</label>
            <select 
              value={permutationType} 
              onChange={(e) => setPermutationType(e.target.value as 'identity' | 'swap01' | 'swap02' | 'cycle')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="identity">Identity (no change)</option>
              <option value="swap01">Swap positions 0↔1</option>
              <option value="swap02">Swap positions 0↔2</option>
              <option value="cycle">Cycle 0→1→2→0</option>
            </select>
          </div>
        </div>
      </div>

      {/* Matrix Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Original Matrix A */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Matrix A</h3>
          <div className="bg-white p-3 rounded border font-mono text-sm whitespace-pre-line">
            {formatMatrix(matrixA)}
          </div>
        </div>

        {/* Permutation Matrix P */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Permutation Matrix P</h3>
          <div className="bg-white p-3 rounded border font-mono text-sm whitespace-pre-line">
            {formatMatrix(P)}
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {permutationType === 'identity' && 'Identity: no permutation'}
            {permutationType === 'swap01' && 'Swaps rows/columns 0 and 1'}
            {permutationType === 'swap02' && 'Swaps rows/columns 0 and 2'}
            {permutationType === 'cycle' && 'Cycles: 0→1, 1→2, 2→0'}
          </p>
        </div>

        {/* Result */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">
            {selectedOperation === 'left' && 'Result: P × A'}
            {selectedOperation === 'right' && 'Result: A × P'}
          </h3>
          <div className="bg-blue-50 p-3 rounded border font-mono text-sm whitespace-pre-line">
            {selectedOperation === 'left' && formatMatrix(PA)}
            {selectedOperation === 'right' && formatMatrix(AP)}
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {selectedOperation === 'left' && 'Left multiplication swaps rows'}
            {selectedOperation === 'right' && 'Right multiplication swaps columns'}
          </p>
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">What's happening:</h4>
        <p className="text-blue-700 text-sm">
          {selectedOperation === 'left' && 'Left multiplication P × A permutes the rows of A according to permutation P. Compare the rows of the result with the original matrix A.'}
          {selectedOperation === 'right' && 'Right multiplication A × P permutes the columns of A according to permutation P. Compare the columns of the result with the original matrix A.'}
        </p>
      </div>
    </div>
  );
};

const InvarianceEquivarianceTab = () => {
  const [currentPermutation, setCurrentPermutation] = useState([0, 1, 2, 3]);
  const [activeButton, setActiveButton] = useState('identity');

  // 4-node graph with complex structure
  const originalAdjMatrix = [
    [0, 1, 1, 0],
    [1, 0, 1, 1],
    [1, 1, 0, 0],
    [0, 1, 0, 0]
  ];

  // Node positions for visualization (arranged in a square)
  const nodePositions = [
    { x: 80, y: 60 },   // Node 0
    { x: 220, y: 60 },  // Node 1  
    { x: 220, y: 140 }, // Node 2
    { x: 80, y: 140 }   // Node 3
  ];

  const nodeColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#feca57'];

  // Matrix operations
  const createPermutationMatrix = (perm: number[]) => {
    const n = perm.length;
    const P = Array(n).fill(0).map(() => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      P[i][perm[i]] = 1;
    }
    return P;
  };

  const matrixMultiply = (A: number[][], B: number[][]) => {
    const rows = A.length;
    const cols = B[0].length;
    const result = Array(rows).fill(0).map(() => Array(cols).fill(0));
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        for (let k = 0; k < A[0].length; k++) {
          result[i][j] += A[i][k] * B[k][j];
        }
      }
    }
    return result;
  };

  const transpose = (matrix: number[][]) => {
    return matrix[0].map((_, i) => matrix.map(row => row[i]));
  };

  const applyPermutation = (matrix: number[][], perm: number[]) => {
    const P = createPermutationMatrix(perm);
    const PT = transpose(P);
    return matrixMultiply(matrixMultiply(P, matrix), PT);
  };

  const getInversePermutation = (perm: number[]) => {
    const inverse = new Array(perm.length);
    for (let i = 0; i < perm.length; i++) {
      inverse[perm[i]] = i;
    }
    return inverse;
  };

  const formatMatrix = (matrix: number[][]) => {
    return matrix.map(row => `[${row.join(' ')}]`).join('\n');
  };

  // GNN Functions
  const computeInvariantFunction = (adjMatrix: number[][]) => {
    let sum = 0;
    for (let i = 0; i < adjMatrix.length; i++) {
      for (let j = 0; j < adjMatrix[i].length; j++) {
        sum += adjMatrix[i][j];
      }
    }
    return (sum / 2).toFixed(1); // Divide by 2 since undirected
  };

  const computeEquivariantFunction = (adjMatrix: number[][]) => {
    const degrees = adjMatrix.map(row => row.reduce((sum, val) => sum + val, 0));
    return degrees.map(deg => deg.toFixed(1));
  };

  const applyPermutationToVector = (vector: string[], perm: number[]) => {
    return perm.map(i => vector[i]);
  };

  // Graph drawing component
  const GraphSvg = ({ adjMatrix, isPermuted, svgId }: { adjMatrix: number[][], isPermuted: boolean, svgId: string }) => {
    const nodeLabels = isPermuted ? getInversePermutation(currentPermutation) : [0, 1, 2, 3];
    const edgeMatrix = isPermuted ? originalAdjMatrix : adjMatrix;
    
    return (
      <svg width="100%" height="200" className="border border-gray-300 bg-white rounded">
        {/* Draw edges */}
        {edgeMatrix.map((row, i) => 
          row.map((cell, j) => {
            if (i < j && cell === 1) {
              return (
                <line
                  key={`${i}-${j}`}
                  x1={nodePositions[i].x}
                  y1={nodePositions[i].y}
                  x2={nodePositions[j].x}
                  y2={nodePositions[j].y}
                  stroke="#666"
                  strokeWidth="2"
                />
              );
            }
            return null;
          })
        )}
        
        {/* Draw nodes */}
        {nodeLabels.map((label, i) => (
          <g key={i}>
            <circle
              cx={nodePositions[i].x}
              cy={nodePositions[i].y}
              r="15"
              fill={nodeColors[label]}
              stroke="#333"
              strokeWidth="2"
            />
            <text
              x={nodePositions[i].x}
              y={nodePositions[i].y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="12"
              fontWeight="bold"
              fill="white"
            >
              {label}
            </text>
          </g>
        ))}
      </svg>
    );
  };

  // Computed values
  const permutedMatrix = applyPermutation(originalAdjMatrix, currentPermutation);
  const permutationMatrix = createPermutationMatrix(currentPermutation);
  
  const invariantOrig = computeInvariantFunction(originalAdjMatrix);
  const invariantPerm = computeInvariantFunction(permutedMatrix);
  const invariantSame = Math.abs(parseFloat(invariantOrig) - parseFloat(invariantPerm)) < 0.01;
  
  const equivariantOrig = computeEquivariantFunction(originalAdjMatrix);
  const equivariantPerm = computeEquivariantFunction(permutedMatrix);
  const equivariantExpected = applyPermutationToVector(equivariantOrig, currentPermutation);
  const equivariantSame = equivariantPerm.every((val, i) => 
    Math.abs(parseFloat(val) - parseFloat(equivariantExpected[i])) < 0.01
  );

  const setPermutation = (type: string) => {
    setActiveButton(type);
    let newPerm;
    switch(type) {
      case 'identity':
        newPerm = [0, 1, 2, 3];
        break;
      case 'swap01':
        newPerm = [1, 0, 2, 3];
        break;
      case 'swap03':
        newPerm = [3, 1, 2, 0];
        break;
      case 'cycle':
        newPerm = [1, 2, 3, 0];
        break;
      case 'reverse':
        newPerm = [3, 2, 1, 0];
        break;
      default:
        newPerm = [0, 1, 2, 3];
    }
    setCurrentPermutation(newPerm);
  };

  const randomPermutation = () => {
    setActiveButton('random');
    let newPerm = [0, 1, 2, 3];
    for (let i = newPerm.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newPerm[i], newPerm[j]] = [newPerm[j], newPerm[i]];
    }
    setCurrentPermutation(newPerm);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Permutation Invariance & Equivariance</h2>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-gray-700">
          <strong>Permutation Invariance:</strong> f(P A P<sup>T</sup>) = f(A) - The function output is unchanged by node relabeling<br />
          <strong>Permutation Equivariance:</strong> f(P A P<sup>T</sup>) = P f(A) - The function output is permuted in the same way as the input
        </p>
      </div>

      {/* Controls */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'identity', label: 'Identity (no permutation)' },
            { key: 'swap01', label: 'Swap nodes 0↔1' },
            { key: 'swap03', label: 'Swap nodes 0↔3' },
            { key: 'cycle', label: 'Cycle 0→1→2→3→0' },
            { key: 'reverse', label: 'Reverse order' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setPermutation(key)}
              className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                activeButton === key
                  ? 'bg-purple-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={randomPermutation}
            className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
              activeButton === 'random'
                ? 'bg-purple-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Random Permutation
          </button>
        </div>
      </div>

      {/* Graph Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h3 className="font-semibold text-center mb-4 text-gray-700">Original Graph (A)</h3>
          <GraphSvg adjMatrix={originalAdjMatrix} isPermuted={false} svgId="original" />
          <div className="mt-4 bg-gray-100 p-3 rounded border-l-4 border-blue-600">
            <div className="font-semibold text-gray-800 mb-2">Adjacency Matrix A:</div>
            <pre className="font-mono text-sm">{formatMatrix(originalAdjMatrix)}</pre>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h3 className="font-semibold text-center mb-4 text-gray-700">Permuted Graph (P A P<sup>T</sup>)</h3>
          <GraphSvg adjMatrix={permutedMatrix} isPermuted={true} svgId="permuted" />
          <div className="mt-4 space-y-3">
            <div className="bg-gray-100 p-3 rounded border-l-4 border-blue-600">
              <div className="font-semibold text-gray-800 mb-2">Permutation Matrix P:</div>
              <pre className="font-mono text-sm">{formatMatrix(permutationMatrix)}</pre>
            </div>
            <div className="bg-gray-100 p-3 rounded border-l-4 border-blue-600">
              <div className="font-semibold text-gray-800 mb-2">Permuted Matrix P A P<sup>T</sup>:</div>
              <pre className="font-mono text-sm">{formatMatrix(permutedMatrix)}</pre>
            </div>
          </div>
        </div>
      </div>

      {/* GNN Function Outputs */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">GNN Function Outputs</h3>
        
        <div className="mb-6">
          <strong className="text-gray-800">Invariant Function (graph-level):</strong><br />
          <div className="mt-2 space-y-2">
            <div>
              f(A) = <span className="inline-block px-3 py-1 bg-green-100 text-green-800 border border-green-300 rounded-full font-semibold">{invariantOrig}</span>
            </div>
            <div>
              f(P A P<sup>T</sup>) = <span className="inline-block px-3 py-1 bg-green-100 text-green-800 border border-green-300 rounded-full font-semibold">{invariantPerm}</span>
            </div>
            <div className={`font-semibold ${invariantSame ? 'text-green-600' : 'text-red-600'}`}>
              {invariantSame ? '✓ Invariant property satisfied!' : '✗ Invariant property violated!'}
            </div>
          </div>
        </div>

        <div>
          <strong className="text-gray-800">Equivariant Function (node-level embeddings):</strong><br />
          <div className="mt-2 space-y-2">
            <div>
              f(A) = <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 border border-blue-300 rounded-full font-semibold">[{equivariantOrig.join(', ')}]</span>
            </div>
            <div>
              f(P A P<sup>T</sup>) = <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 border border-blue-300 rounded-full font-semibold">[{equivariantPerm.join(', ')}]</span>
            </div>
            <div>
              P·f(A) = <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 border border-blue-300 rounded-full font-semibold">[{equivariantExpected.join(', ')}]</span>
            </div>
            <div className={`font-semibold ${equivariantSame ? 'text-green-600' : 'text-red-600'}`}>
              {equivariantSame ? '✓ Equivariant property satisfied!' : '✗ Equivariant property violated!'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GnnPermutationDemo;