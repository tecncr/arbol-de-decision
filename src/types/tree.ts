export interface Branch {
  id: string;
  probability: number;
  value: number;
  label: string;
}

export interface ProbabilityNode {
  id: string;
  name: string;
  branches: Branch[];
  expectedValue: number;
}

export interface DecisionTree {
  nodes: ProbabilityNode[];
  finalExpectedValue: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}