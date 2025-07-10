import type { ProbabilityNode, DecisionTree, ValidationResult } from '../types/tree';

export const calculateExpectedValue = (branches: Array<{ probability: number; value: number }>): number => {
  return branches.reduce((sum, branch) => sum + (branch.probability / 100) * branch.value, 0);
};

export const validateProbabilities = (branches: Array<{ probability: number }>): ValidationResult => {
  const errors: string[] = [];
  const totalProbability = branches.reduce((sum, branch) => sum + branch.probability, 0);
  
  if (Math.abs(totalProbability - 100) > 0.01) {
    errors.push(`Las probabilidades deben sumar exactamente 100%. Total actual: ${totalProbability.toFixed(2)}%`);
  }
  
  branches.forEach((branch, index) => {
    if (branch.probability < 0 || branch.probability > 100) {
      errors.push(`La probabilidad de la rama ${index + 1} debe estar entre 0% y 100%`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const calculateTreeValue = (nodes: ProbabilityNode[]): number => {
  if (nodes.length === 0) return 0;
  
  // El valor final es el promedio de los valores esperados de todos los nodos
  const totalExpectedValue = nodes.reduce((sum, node) => sum + node.expectedValue, 0);
  return totalExpectedValue / nodes.length;
};

export const formatCurrency = (value: number): string => {
  return `S/ ${new Intl.NumberFormat('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)}`;
};