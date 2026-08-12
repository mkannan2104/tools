export interface ToolDefinition {
  slug: string;
  name: string;
  description: string;
  path: string;
  category: string;
  seoTitle: string;
  seoDescription: string;
  primaryAction: string;
  related: string[];
  howTo: string[];
  examples: { input: string; output?: string; label?: string }[];
  faqs: { question: string; answer: string }[];
}

export interface ToolError {
  message: string;
  line?: number;
  column?: number;
}

export type DifferenceType = "added" | "removed" | "changed";

export interface JsonDifference {
  path: string;
  type: DifferenceType;
  oldValue?: unknown;
  newValue?: unknown;
}
