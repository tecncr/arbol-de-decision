import React from 'react';
import { GitBranch, TrendingUp, Target } from 'lucide-react';
import type { DecisionTree } from '../types/tree';
import { formatCurrency } from '../utils/calculations';

interface Props {
  tree: DecisionTree;
}

export const TreeVisualization: React.FC<Props> = ({ tree }) => {
  if (tree.nodes.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <GitBranch className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">
          Agrega nodos para ver la visualización del árbol
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 overflow-x-auto">
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center flex items-center justify-center gap-2">
        <GitBranch className="w-6 h-6" />
        Visualización del Árbol de Decisión
      </h3>
      
      <div className="min-w-max">
        {/* Nodos principales */}
        <div className="flex flex-col gap-8">
          {tree.nodes.map((node, nodeIndex) => (
            <div key={node.id} className="flex items-center gap-4">
              {/* Nodo principal */}
              <div className="bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-300 dark:border-blue-700 rounded-lg p-4 min-w-48">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-semibold text-blue-800 dark:text-blue-300 text-sm">
                    Nodo {nodeIndex + 1}
                  </span>
                </div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2 text-sm">
                  {node.name}
                </h4>
                <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  VE: {formatCurrency(node.expectedValue)}
                </div>
              </div>
              
              {/* Líneas conectoras */}
              <div className="flex-1 relative">
                <div className="absolute left-0 top-1/2 w-8 h-0.5 bg-gray-400 dark:bg-gray-500"></div>
                
                {/* Ramas */}
                <div className="ml-8 flex flex-col gap-2">
                  {node.branches.map((branch, branchIndex) => (
                    <div key={branch.id} className="flex items-center gap-2">
                      {/* Línea horizontal */}
                      <div className="w-4 h-0.5 bg-gray-400 dark:bg-gray-500"></div>
                      
                      {/* Resultado de la rama */}
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 min-w-40">
                        <div className="text-xs font-medium text-green-700 dark:text-green-400 mb-1">
                          {branch.label}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          P: {branch.probability.toFixed(1)}%
                        </div>
                        <div className="text-xs font-semibold text-green-600 dark:text-green-400">
                          {formatCurrency(branch.value)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Resultado final */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-4">
            <div className="w-16 h-0.5 bg-gray-400 dark:bg-gray-500"></div>
            <div className="bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-300 dark:border-purple-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="font-semibold text-purple-800 dark:text-purple-300 text-sm">
                  Resultado Final
                </span>
              </div>
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {formatCurrency(tree.finalExpectedValue)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};