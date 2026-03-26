import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkEmoji from "remark-emoji";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

type MarkdownContentProps = {
  content: string;
};

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <section className="github-markdown-shell">
      <article className="markdown-body github-markdown-body">
        <ReactMarkdown
          remarkPlugins={[
            remarkGfm,
            remarkEmoji,
          ]}
          components={{
            code({ className, children, ...props }) {
              const match = /language-([\w-]+)/.exec(className || "");
              return match ? (
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    borderRadius: "6px",
                    background: "#161b22",
                    border: "1px solid #30363d",
                  }}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
    </section>
  );
}
