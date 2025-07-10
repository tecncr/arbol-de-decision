import React, { useState, useEffect } from 'react';
import { Calculator, RotateCcw, Save, Download, Upload, TreeDeciduous, Plus } from 'lucide-react';
import { ProbabilityNodeComponent } from './ProbabilityNode';
import { TreeVisualization } from './TreeVisualization';
import type { DecisionTree, ProbabilityNode } from '../types/tree';
import { calculateTreeValue, formatCurrency, validateProbabilities } from '../utils/calculations';

const createInitialNode = (id: string, name: string, branchCount: number = 3): ProbabilityNode => {
  const equalProbability = 100 / branchCount;
  const branches = [];
  
  for (let i = 0; i < branchCount; i++) {
    branches.push({
      id: `${id}-${i + 1}`,
      probability: i === branchCount - 1 ? 100 - (equalProbability * (branchCount - 1)) : equalProbability,
      value: 0,
      label: i === 0 ? 'Optimista' : i === 1 ? 'Probable' : i === 2 ? 'Pesimista' : `Rama ${i + 1}`
    });
  }
  
  return {
  id,
  name,
  branches,
  expectedValue: 0
  };
};

export const DecisionTreeComponent: React.FC = () => {
  const [tree, setTree] = useState<DecisionTree>({
    nodes: [
      createInitialNode('node1', 'Escenario A'),
      createInitialNode('node2', 'Escenario B')
    ],
    finalExpectedValue: 0,
    calculationMethod: 'average'
  });

  const [savedTrees, setSavedTrees] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('decision-trees');
    if (saved) {
      setSavedTrees(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const newFinalValue = calculateTreeValue(tree.nodes);
    setTree(prev => ({ ...prev, finalExpectedValue: newFinalValue }));
  }, [tree.nodes]);

  const handleUpdateNode = (updatedNode: ProbabilityNode) => {
    setTree(prev => ({
      ...prev,
      nodes: prev.nodes.map(node => 
        node.id === updatedNode.id ? updatedNode : node
      )
    }));
  };

  const handleAddNode = () => {
    const newNodeId = `node${Date.now()}`;
    const newNode = createInitialNode(newNodeId, `Escenario ${String.fromCharCode(65 + tree.nodes.length)}`);
    
    setTree(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }));
  };

  const handleDeleteNode = (nodeId: string) => {
    setTree(prev => ({
      ...prev,
      nodes: prev.nodes.filter(node => node.id !== nodeId)
    }));
  };

  const handleCalculate = () => {
    const newFinalValue = calculateTreeValue(tree.nodes);
    setTree(prev => ({ ...prev, finalExpectedValue: newFinalValue }));
  };

  const handleReset = () => {
    setTree({
      nodes: [
        createInitialNode('node1', 'Escenario A'),
        createInitialNode('node2', 'Escenario B')
      ],
      finalExpectedValue: 0,
      calculationMethod: 'average'
    });
  };

  const handleSave = () => {
    const treeName = prompt('Ingrese un nombre para guardar este árbol de decisión:');
    if (treeName) {
      const treeData = {
        name: treeName,
        tree: tree,
        savedAt: new Date().toISOString()
      };
      
      const saved = localStorage.getItem('decision-trees');
      const savedTrees = saved ? JSON.parse(saved) : [];
      savedTrees.push(treeData);
      
      localStorage.setItem('decision-trees', JSON.stringify(savedTrees));
      setSavedTrees(savedTrees.map(t => t.name));
      
      alert(`Árbol de decisión "${treeName}" guardado exitosamente.`);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(tree, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'arbol-decision.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedTree = JSON.parse(e.target?.result as string);
          setTree(importedTree);
          alert('Árbol de decisión importado exitosamente.');
        } catch (error) {
          alert('Error al importar el archivo. Asegúrese de que sea un archivo JSON válido.');
        }
      };
      reader.readAsText(file);
    }
  };

  const allNodesValid = tree.nodes.every(node => validateProbabilities(node.branches).isValid);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TreeDeciduous className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              Evaluador de Árboles de Decisión
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Evalúa escenarios con nodos de probabilidad y calcula valores esperados para tomar decisiones informadas.
          </p>
        </header>

        <div className="mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={handleCalculate}
              className="flex items-center gap-2 bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-lg"
            >
              <Calculator className="w-5 h-5" />
              Calcular
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 bg-gray-600 dark:bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors shadow-lg"
            >
              <RotateCcw className="w-5 h-5" />
              Reiniciar
            </button>
            <button
              onClick={handleAddNode}
              className="flex items-center gap-2 bg-green-600 dark:bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Agregar Nodo
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-green-600 dark:bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors shadow-lg"
            >
              <Save className="w-5 h-5" />
              Guardar
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-purple-600 dark:bg-purple-700 text-white px-6 py-3 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors shadow-lg"
            >
              <Download className="w-5 h-5" />
              Exportar
            </button>
            <label className="flex items-center gap-2 bg-orange-600 dark:bg-orange-700 text-white px-6 py-3 rounded-lg hover:bg-orange-700 dark:hover:bg-orange-600 transition-colors shadow-lg cursor-pointer">
              <Upload className="w-5 h-5" />
              Importar
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-8 justify-items-center">
          {tree.nodes.map((node, index) => (
            <ProbabilityNodeComponent
              key={node.id}
              node={node}
              onUpdateNode={handleUpdateNode}
              onDeleteNode={() => handleDeleteNode(node.id)}
              nodeNumber={index + 1}
              canDelete={tree.nodes.length > 1}
            />
          ))}
        </div>

        <div className="mb-8">
          <TreeVisualization tree={tree} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border-2 border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
            Resultado Final del Árbol de Decisión
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {tree.nodes.map((node, index) => (
              <div key={node.id} className="text-center">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">{node.name}</h3>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(node.expectedValue)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Valor Esperado Final
              </h3>
              <div className={`inline-block px-8 py-4 rounded-xl ${
                allNodesValid 
                  ? 'bg-green-100 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800' 
                  : 'bg-red-100 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800'
              }`}>
                <span className={`text-3xl font-bold ${
                  allNodesValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {formatCurrency(tree.finalExpectedValue)}
                </span>
              </div>
              {!allNodesValid && (
                <p className="text-red-600 dark:text-red-400 mt-2 text-sm">
                  * Corrija los errores de validación antes de confiar en este resultado
                </p>
              )}
            </div>
          </div>
        </div>

        {savedTrees.length > 0 && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Árboles Guardados ({savedTrees.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {savedTrees.map((treeName, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{treeName}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};