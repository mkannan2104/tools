import type { ToolDefinition } from "@/types/tool";

export const tools: ToolDefinition[] = [
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    description: "Format and beautify JSON online.",
    path: "/json-formatter",
    category: "JSON",
    seoTitle: "JSON Formatter - Format JSON Online Free",
    seoDescription:
      "Format and beautify JSON online for free. Fast JSON formatting that runs directly in your browser.",
    primaryAction: "Format JSON",
    related: ["json-validator", "json-minifier", "json-viewer"],
    howTo: [
      "Paste your JSON into the input area.",
      "Click Format JSON.",
      "Copy or download the formatted result.",
    ],
    examples: [
      {
        label: "Minified input",
        input: '{"name":"John","age":25}',
        output: '{\n  "name": "John",\n  "age": 25\n}',
      },
    ],
    faqs: [
      {
        question: "Is my JSON uploaded to a server?",
        answer:
          "No. Formatting runs entirely in your browser. Your data is not sent to our servers.",
      },
      {
        question: "What indentation is used?",
        answer:
          "Choose 2-space or 4-space indentation in the input panel before formatting. The default is 2 spaces.",
      },
      {
        question: "What does JSON Specification mean?",
        answer:
          "RFC 8259, RFC 7159, and ECMA-404 accept any JSON value. RFC 4627 requires a top-level object or array. Skip Validation uses the same parser but skips the RFC 4627 root-type rule.",
      },
    ],
  },
  {
    slug: "json-validator",
    name: "JSON Validator",
    description: "Validate JSON and find syntax errors.",
    path: "/json-validator",
    category: "JSON",
    seoTitle: "JSON Validator - Validate JSON Online Free",
    seoDescription:
      "Validate JSON online for free. Check if your JSON is valid and get clear error messages with line information.",
    primaryAction: "Validate JSON",
    related: ["json-formatter", "json-repair", "json-minifier"],
    howTo: [
      "Paste your JSON into the input area.",
      "Click Validate JSON.",
      "Review the valid or invalid status and any error details.",
    ],
    examples: [
      {
        label: "Valid JSON",
        input: '{"name":"John","age":25}',
        output: "Valid JSON",
      },
    ],
    faqs: [
      {
        question: "Does validation modify my data?",
        answer: "No. The validator only checks syntax and does not change your input.",
      },
    ],
  },
  {
    slug: "json-minifier",
    name: "JSON Minifier",
    description: "Minify JSON by removing whitespace.",
    path: "/json-minifier",
    category: "JSON",
    seoTitle: "JSON Minifier - Minify JSON Online Free",
    seoDescription:
      "Minify JSON online for free. Remove whitespace and create compact JSON that runs in your browser.",
    primaryAction: "Minify JSON",
    related: ["json-formatter", "json-validator", "json-escape"],
    howTo: [
      "Paste your JSON into the input area.",
      "Click Minify JSON.",
      "Copy or download the compact result.",
    ],
    examples: [
      {
        input: '{\n  "name": "John",\n  "age": 25\n}',
        output: '{"name":"John","age":25}',
      },
    ],
    faqs: [
      {
        question: "Will minifying change my data values?",
        answer:
          "No. Minifying only removes unnecessary whitespace while keeping the same JSON structure and values.",
      },
    ],
  },
  {
    slug: "json-viewer",
    name: "JSON Viewer",
    description: "Explore JSON as a readable tree.",
    path: "/json-viewer",
    category: "JSON",
    seoTitle: "JSON Viewer - View JSON Tree Online Free",
    seoDescription:
      "View JSON as an expandable tree online for free. Expand nodes, search values, and copy paths in your browser.",
    primaryAction: "View JSON",
    related: ["json-formatter", "json-query", "json-compare"],
    howTo: [
      "Paste your JSON into the input area.",
      "Click View JSON to render the tree.",
      "Expand or collapse nodes, search values, and copy a path or value.",
    ],
    examples: [
      {
        input: '{"user":{"name":"John","age":25},"active":true}',
      },
    ],
    faqs: [
      {
        question: "Can I edit values in the viewer?",
        answer:
          "The viewer is read-only and optimized for readability. Use the formatter if you need to edit JSON text.",
      },
      {
        question: "Can I copy a JSON path?",
        answer:
          "Yes. Use Copy path on a node to copy paths like user.address.city, or Copy value for the node contents.",
      },
    ],
  },
  {
    slug: "json-compare",
    name: "JSON Compare",
    description: "Compare two JSON documents structurally.",
    path: "/json-compare",
    category: "JSON",
    seoTitle: "JSON Compare - Diff Two JSON Files Online",
    seoDescription:
      "Compare two JSON documents online for free. Find added, removed, and changed properties by structure.",
    primaryAction: "Compare",
    related: ["json-formatter", "json-viewer", "json-validator"],
    howTo: [
      "Paste JSON A and JSON B into the editors.",
      "Click Compare.",
      "Review added, removed, and changed differences.",
    ],
    examples: [
      {
        label: "JSON A vs JSON B",
        input: 'A: {"name":"John","age":25}\nB: {"name":"Jane","age":25,"city":"NYC"}',
        output: "Changed: name\nAdded: city",
      },
    ],
    faqs: [
      {
        question: "Is comparison text-based or structural?",
        answer:
          "Comparison is structural. Objects are compared by keys and values, not raw text formatting.",
      },
    ],
  },
  {
    slug: "json-repair",
    name: "JSON Repair",
    description: "Fix common JSON syntax issues.",
    path: "/json-repair",
    category: "JSON",
    seoTitle: "JSON Repair - Fix Broken JSON Online Free",
    seoDescription:
      "Repair common JSON errors online for free. Fix trailing commas, quote issues, and other frequent syntax problems.",
    primaryAction: "Repair JSON",
    related: ["json-validator", "json-formatter", "json-minifier"],
    howTo: [
      "Paste broken JSON into the input area.",
      "Click Repair JSON.",
      "Review the repaired output or the detected issue.",
    ],
    examples: [
      {
        label: "Trailing comma",
        input: '{"name":"John","age":25,}',
        output: '{\n  "name": "John",\n  "age": 25\n}',
      },
    ],
    faqs: [
      {
        question: "Can every broken JSON document be repaired?",
        answer:
          "No. Repair is conservative. If a fix cannot be applied confidently, the tool shows the problem instead of guessing.",
      },
    ],
  },
  {
    slug: "json-to-csv",
    name: "JSON to CSV",
    description: "Convert JSON arrays to CSV.",
    path: "/json-to-csv",
    category: "Convert",
    seoTitle: "JSON to CSV - Convert JSON Online Free",
    seoDescription:
      "Convert JSON arrays of objects to CSV online for free. Copy or download CSV generated in your browser.",
    primaryAction: "Convert to CSV",
    related: ["csv-to-json", "json-formatter", "json-validator"],
    howTo: [
      "Paste an array of objects as JSON.",
      "Click Convert to CSV.",
      "Copy or download the CSV output.",
    ],
    examples: [
      {
        input: '[{"name":"John","age":25},{"name":"Jane","age":30}]',
        output: "name,age\nJohn,25\nJane,30",
      },
    ],
    faqs: [
      {
        question: "What JSON structures are supported?",
        answer:
          "MVP supports arrays of flat objects. Deeply nested structures may need flattening first.",
      },
    ],
  },
  {
    slug: "csv-to-json",
    name: "CSV to JSON",
    description: "Convert CSV data to JSON.",
    path: "/csv-to-json",
    category: "Convert",
    seoTitle: "CSV to JSON - Convert CSV Online Free",
    seoDescription:
      "Convert CSV to JSON online for free. Paste CSV and get formatted JSON that runs in your browser.",
    primaryAction: "Convert to JSON",
    related: ["json-to-csv", "json-formatter", "json-validator"],
    howTo: [
      "Paste CSV with a header row into the input area.",
      "Click Convert to JSON.",
      "Copy or download the JSON output.",
    ],
    examples: [
      {
        input: "name,age\nJohn,25\nJane,30",
        output:
          '[\n  {\n    "name": "John",\n    "age": "25"\n  },\n  {\n    "name": "Jane",\n    "age": "30"\n  }\n]',
      },
    ],
    faqs: [
      {
        question: "Are numbers converted to number types?",
        answer:
          "Values are kept as strings by default so leading zeros and formats are preserved.",
      },
    ],
  },
  {
    slug: "json-query",
    name: "JSON Query",
    description: "Query JSON with simple path expressions.",
    path: "/json-query",
    category: "JSON",
    seoTitle: "JSON Query - Query JSON Paths Online Free",
    seoDescription:
      "Query JSON with simple paths like users[0].name. Free browser-based JSON transform tool.",
    primaryAction: "Run Query",
    related: ["json-viewer", "json-formatter", "json-escape"],
    howTo: [
      "Paste your JSON into the input area.",
      "Enter a simple path such as users[0].name.",
      "Click Run Query to see the selected value.",
    ],
    examples: [
      {
        label: "Path example",
        input: 'JSON: {"users":[{"name":"John"}]}\nPath: users[0].name',
        output: '"John"',
      },
    ],
    faqs: [
      {
        question: "Is full JSONPath supported?",
        answer:
          "No. MVP supports simple property and array index paths such as users[0].name.",
      },
    ],
  },
  {
    slug: "json-escape",
    name: "JSON Escape / Unescape",
    description: "Escape or unescape JSON strings.",
    path: "/json-escape",
    category: "JSON",
    seoTitle: "JSON Escape / Unescape - Escape JSON Strings Free",
    seoDescription:
      "Escape and unescape JSON strings online for free. Convert quotes and special characters safely in your browser.",
    primaryAction: "Escape",
    related: ["json-formatter", "json-minifier", "json-validator"],
    howTo: [
      "Paste your text into the input area.",
      "Click Escape or Unescape.",
      "Copy the result.",
    ],
    examples: [
      {
        label: "Escape",
        input: 'Hello "World"',
        output: 'Hello \\"World\\"',
      },
    ],
    faqs: [
      {
        question: "Does escape process full JSON documents?",
        answer:
          "This tool escapes and unescapes string content. Use the formatter for full JSON documents.",
      },
    ],
  },
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getRelatedTools(slug: string): ToolDefinition[] {
  const tool = getToolBySlug(slug);
  if (!tool) return [];
  return tool.related
    .map((relatedSlug) => getToolBySlug(relatedSlug))
    .filter((item): item is ToolDefinition => Boolean(item));
}
