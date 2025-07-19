import React, { useState } from 'react';

const InteractiveClusteringAlgorithm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Algorithm steps data - only distinct pairs where u < v
  const steps = [
    { u: 0, v: 1, uLessV: true, checkEdge: '1 ∈ adj[0]', edgeExists: true, action: '+1', connectedPairs: 1, highlightRow: 0 },
    { u: 0, v: 3, uLessV: true, checkEdge: '3 ∈ adj[0]', edgeExists: false, action: 'skip', connectedPairs: 1, highlightRow: 0 },
    { u: 0, v: 4, uLessV: true, checkEdge: '4 ∈ adj[0]', edgeExists: false, action: 'skip', connectedPairs: 1, highlightRow: 0 },
    { u: 1, v: 3, uLessV: true, checkEdge: '3 ∈ adj[1]', edgeExists: false, action: 'skip', connectedPairs: 1, highlightRow: 1 },
    { u: 1, v: 4, uLessV: true, checkEdge: '4 ∈ adj[1]', edgeExists: false, action: 'skip', connectedPairs: 1, highlightRow: 1 },
    { u: 3, v: 4, uLessV: true, checkEdge: '4 ∈ adj[3]', edgeExists: true, action: '+1', connectedPairs: 2, highlightRow: 3 },
  ];
  
  const adjacencyList = [
    { node: 0, neighbors: '[1, 2]' },
    { node: 1, neighbors: '[0, 2]' },
    { node: 2, neighbors: '[0, 1, 3, 4]' },
    { node: 3, neighbors: '[2, 4]' },
    { node: 4, neighbors: '[2, 3]' }
  ];
  
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const reset = () => {
    setCurrentStep(0);
  };
  
  const currentStepData = steps[currentStep];
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Local Clustering Coefficient Computation
      </h2>
      
      {/* Algorithm Description */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Algorithm Overview</h3>
        <p className="text-gray-700 mb-4">
          The local clustering coefficient measures how densely connected a node's neighbors are to each other. 
          It is computed as the ratio of existing edges between neighbors to the maximum possible edges between them.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pseudocode */}
          <div>
            <h4 className="font-semibold mb-2">Pseudocode:</h4>
            <div className="bg-gray-100 p-4 rounded font-mono text-sm">
              <div className="text-blue-600">// Input: Graph G, target node i</div>
              <div>neighbors_i ← GetNeighbors(G, i)</div>
              <div>connected_pairs ← 0</div>
              <div className="mt-2">
                <div>FOR each neighbor u in neighbors_i DO</div>
                <div className="ml-4">FOR each neighbor v in neighbors_i DO</div>
                <div className="ml-8 text-purple-600">IF u &lt; v THEN</div>
                <div className="ml-12 text-green-600">IF EdgeExists(G, u, v) THEN</div>
                <div className="ml-16">connected_pairs ← connected_pairs + 1</div>
                <div className="ml-12 text-green-600">END IF</div>
                <div className="ml-8 text-purple-600">END IF</div>
                <div className="ml-4">END FOR</div>
                <div>END FOR</div>
              </div>
              <div className="mt-2">
                <div>k ← |neighbors_i|</div>
                <div>C_i ← 2 × connected_pairs / (k × (k-1))</div>
                <div>RETURN C_i</div>
              </div>
            </div>
          </div>
          
          {/* Complexity and Formula */}
          <div>
            <h4 className="font-semibold mb-2">Time Complexity:</h4>
            <div className="bg-blue-50 p-4 rounded mb-4">
              <div className="text-sm text-blue-600 mb-2">The complexity depends on network structure:</div>
              <div className="space-y-2">
                <div>
                  <div className="font-mono text-lg text-blue-800">O(k_i³)</div>
                  <div className="text-xs text-blue-600">With degree homophily (neighbors have similar degrees)</div>
                </div>
                <div>
                  <div className="font-mono text-lg text-blue-800">O(k_i² × 2m/n)</div>
                  <div className="text-xs text-blue-600">Without degree correlation (uncorrelated network)</div>
                </div>
              </div>
              <div className="text-xs text-gray-600 mt-2">
                k_i = degree of node i, m = edges, n = nodes
              </div>
            </div>
            
            <h4 className="font-semibold mb-2">Formula:</h4>
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-center">
                <div className="font-mono text-lg">C_i = 2e_i / (k_i(k_i-1))</div>
                <div className="text-sm text-gray-600 mt-2">
                  <div>e_i = number of edges between neighbors</div>
                  <div>k_i = degree of node i</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Top Section: Network, Adjacency List, and Current Operation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Network Visualization */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-center">Network</h3>
          <svg viewBox="0 0 200 160" className="w-full h-48">
            {/* Edges */}
            <line x1="90" y1="50" x2="68" y2="28" stroke="#666" strokeWidth="2"/>
            <line x1="110" y1="50" x2="132" y2="28" stroke="#666" strokeWidth="2"/>
            <line x1="90" y1="70" x2="68" y2="92" stroke="#666" strokeWidth="2"/>
            <line x1="110" y1="70" x2="132" y2="92" stroke="#666" strokeWidth="2"/>
            <line x1="60" y1="20" x2="140" y2="20" stroke="#666" strokeWidth="2"/>
            <line x1="60" y1="100" x2="140" y2="100" stroke="#666" strokeWidth="2"/>
            
            {/* Nodes */}
            <circle cx="100" cy="60" r="15" fill="#e74c3c" stroke="#c0392b" strokeWidth="3"/>
            <circle cx="60" cy="20" r="12" fill="#3498db" stroke="#2980b9" strokeWidth="2"/>
            <circle cx="140" cy="20" r="12" fill="#3498db" stroke="#2980b9" strokeWidth="2"/>
            <circle cx="60" cy="100" r="12" fill="#3498db" stroke="#2980b9" strokeWidth="2"/>
            <circle cx="140" cy="100" r="12" fill="#3498db" stroke="#2980b9" strokeWidth="2"/>
            
            {/* Labels */}
            <text x="100" y="67" textAnchor="middle" className="text-sm font-bold fill-white">2</text>
            <text x="60" y="25" textAnchor="middle" className="text-xs font-bold fill-white">0</text>
            <text x="140" y="25" textAnchor="middle" className="text-xs font-bold fill-white">1</text>
            <text x="60" y="105" textAnchor="middle" className="text-xs font-bold fill-white">3</text>
            <text x="140" y="105" textAnchor="middle" className="text-xs font-bold fill-white">4</text>
          </svg>
          <div className="text-center text-sm text-gray-600 mt-2">
            <div>Target: Node 2</div>
            <div>Neighbors: [0, 1, 3, 4]</div>
          </div>
        </div>
        
        {/* Adjacency List */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-center">Adjacency List</h3>
          <div className="space-y-2">
            {adjacencyList.map((item, index) => (
              <div 
                key={index}
                className={`p-2 rounded font-mono text-sm ${
                  currentStepData.highlightRow === index 
                    ? 'bg-yellow-200 border-2 border-yellow-400' 
                    : item.node === 2 
                      ? 'bg-red-100 font-bold' 
                      : 'bg-gray-100'
                }`}
              >
                {item.node}: {item.neighbors}
              </div>
            ))}
          </div>
        </div>
        
        {/* Current Operation */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-center">Current Operation</h3>
          <div className="space-y-2 text-sm">
            <div className="font-mono bg-gray-100 p-2 rounded">
              connected_pairs = {currentStepData.connectedPairs}
            </div>
            <div className="font-mono">
              Checking pair: u = {currentStepData.u}, v = {currentStepData.v}
            </div>
            <div className="font-mono text-blue-600">
              Check: {currentStepData.checkEdge}
            </div>
            <div className={`font-mono ${currentStepData.edgeExists ? 'text-green-600' : 'text-red-600'}`}>
              Edge exists? {currentStepData.edgeExists ? 'YES' : 'NO'}
            </div>
            <div className={`font-mono font-bold ${currentStepData.action === '+1' ? 'text-green-600' : 'text-gray-600'}`}>
              Action: {currentStepData.action}
            </div>
          </div>
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex justify-center gap-4 mb-6">
        <button 
          onClick={prevStep} 
          disabled={currentStep === 0}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 hover:bg-blue-600"
        >
          Previous
        </button>
        <button 
          onClick={reset}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset
        </button>
        <button 
          onClick={nextStep} 
          disabled={currentStep === steps.length - 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 hover:bg-blue-600"
        >
          Next
        </button>
      </div>
      
      {/* Progress */}
      <div className="text-center mb-6">
        <div className="text-sm text-gray-600">
          Step {currentStep + 1} of {steps.length}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{width: `${((currentStep + 1) / steps.length) * 100}%`}}
          ></div>
        </div>
      </div>
      
      {/* Execution Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h3 className="text-lg font-semibold p-4 bg-gray-100">Algorithm Execution Steps</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Step</th>
                <th className="px-4 py-2 text-left">u</th>
                <th className="px-4 py-2 text-left">v</th>
                <th className="px-4 py-2 text-left">Check Edge</th>
                <th className="px-4 py-2 text-left">Edge Exists?</th>
                <th className="px-4 py-2 text-left">connected_pairs</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {steps.slice(0, currentStep + 1).map((step, index) => (
                <tr 
                  key={index}
                  className={`${
                    index === currentStep 
                      ? 'bg-yellow-100 border-l-4 border-yellow-400' 
                      : index % 2 === 0 
                        ? 'bg-gray-50' 
                        : 'bg-white'
                  }`}
                >
                  <td className="px-4 py-2 font-mono">{index + 1}</td>
                  <td className="px-4 py-2 font-mono">{step.u}</td>
                  <td className="px-4 py-2 font-mono">{step.v}</td>
                  <td className="px-4 py-2 font-mono text-sm">{step.checkEdge}</td>
                  <td className={`px-4 py-2 font-mono ${step.edgeExists ? 'text-green-600' : 'text-red-600'}`}>
                    {step.edgeExists ? 'YES' : 'NO'}
                  </td>
                  <td className={`px-4 py-2 font-mono font-bold ${step.action === '+1' ? 'text-red-600' : ''}`}>
                    {step.connectedPairs}
                  </td>
                  <td className={`px-4 py-2 font-mono ${step.action === '+1' ? 'text-green-600 font-bold' : 'text-gray-600'}`}>
                    {step.action}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Final Result */}
      {currentStep === steps.length - 1 && (
        <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Algorithm Complete!</h3>
          <div className="text-blue-700">
            <div className="font-mono text-lg">Final result: connected_pairs = {currentStepData.connectedPairs}</div>
            <div className="mt-2">
              Local clustering coefficient for node 2: 
              <span className="font-bold"> C₂ = 2 × {currentStepData.connectedPairs} / (4 × 3) = {(2 * currentStepData.connectedPairs / 12).toFixed(3)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveClusteringAlgorithm;