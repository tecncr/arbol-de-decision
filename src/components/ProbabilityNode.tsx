import React from 'react';
import { TrendingUp, AlertCircle } from 'lucide-react';
import type { ProbabilityNode, ValidationResult } from '../types/tree';
import { validateProbabilities, calculateExpectedValue, formatCurrency } from '../utils/calculations';

interface Props {
  node: ProbabilityNode;
  onUpdateNode: (node: ProbabilityNode) => void;
  nodeNumber: number;
}

export const ProbabilityNodeComponent: React.FC<Props> = ({ node, onUpdateNode, nodeNumber }) => {
  const validation: ValidationResult = validateProbabilities(node.branches);
  const expectedValue = calculateExpectedValue(node.branches);
  
  const handleProbabilityChange = (branchIndex: number, probability: string) => {
    const newBranches = [...node.branches];
    newBranches[branchIndex] = {
      ...newBranches[branchIndex],
      probability: probability === '' ? 0 : parseFloat(probability) || 0
    };
    
    onUpdateNode({
      ...node,
      branches: newBranches,
      expectedValue: calculateExpectedValue(newBranches)
    });
  };
  
  const handleValueChange = (branchIndex: number, value: string) => {
    const newBranches = [...node.branches];
    newBranches[branchIndex] = {
      ...newBranches[branchIndex],
      value: value === '' ? 0 : parseFloat(value) || 0
    };
    
    onUpdateNode({
      ...node,
      branches: newBranches,
      expectedValue: calculateExpectedValue(newBranches)
    });
  };
  
  const handleNameChange = (name: string) => {
    onUpdateNode({
      ...node,
      name
    });
  };
  
  const handleBranchLabelChange = (branchIndex: number, label: string) => {
    const newBranches = [...node.branches];
    newBranches[branchIndex] = {
      ...newBranches[branchIndex],
      label
    };
    
    onUpdateNode({
      ...node,
      branches: newBranches,
      expectedValue: calculateExpectedValue(newBranches)
    });
  };
  
  const totalProbability = node.branches.reduce((sum, branch) => sum + branch.probability, 0);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
          <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Nodo de Probabilidad {nodeNumber}
          </h3>
          <input
            type="text"
            value={node.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Nombre del nodo"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>
      
      <div className="space-y-4 mb-6">
        {node.branches.map((branch, index) => (
          <div key={branch.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Nombre de la Rama {index + 1}
              </label>
              <input
                type="text"
                value={branch.label}
                onChange={(e) => handleBranchLabelChange(index, e.target.value)}
                placeholder={`Rama ${index + 1}`}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Probabilidad (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={branch.probability || ''}
                  onChange={(e) => handleProbabilityChange(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Valor (S/)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={branch.value || ''}
                  onChange={(e) => handleValueChange(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-gray-700 dark:text-gray-300">Total de Probabilidades:</span>
          <span className={`font-semibold ${validation.isValid ? 'text-green-600' : 'text-red-600'}`}>
            {totalProbability.toFixed(2)}%
          </span>
        </div>
        
        {!validation.isValid && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400" />
              <span className="text-sm font-medium text-red-800 dark:text-red-300">Errores de validación:</span>
            </div>
            <ul className="mt-2 text-sm text-red-700 dark:text-red-300">
              {validation.errors.map((error, index) => (
                <li key={index} className="ml-6 list-disc">{error}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="font-medium text-green-800 dark:text-green-300">Valor Esperado:</span>
            <span className="text-lg font-bold text-green-600 dark:text-green-400">
              {formatCurrency(expectedValue)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};