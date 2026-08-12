import type { ToolDefinition } from "@/types/tool";

export function ToolSeoContent({ tool }: { tool: ToolDefinition }) {
  return (
    <>
      <section className="content-block">
        <h2>How to use</h2>
        <ol>
          {tool.howTo.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      {tool.examples.length > 0 ? (
        <section className="content-block">
          <h2>Example</h2>
          {tool.examples.map((example) => (
            <div key={example.input} className="example-box">
              {example.label ? <h3>{example.label}</h3> : null}
              <pre>{example.input}</pre>
              {example.output ? (
                <>
                  <h3 style={{ marginTop: 16 }}>Output</h3>
                  <pre>{example.output}</pre>
                </>
              ) : null}
            </div>
          ))}
        </section>
      ) : null}

      {tool.faqs.length > 0 ? (
        <section className="content-block">
          <h2>FAQ</h2>
          {tool.faqs.map((faq) => (
            <div key={faq.question} className="faq-item">
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </section>
      ) : null}
    </>
  );
}
