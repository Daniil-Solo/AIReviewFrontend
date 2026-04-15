import { useEffect, useState, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useComputedColorScheme } from '@mantine/core';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import mermaid from 'mermaid';
import styles from './MarkdownRenderer.module.css';

interface MarkdownRendererProps {
  content: string;
}

function MermaidDiagram({ code, isDark }: { code: string; isDark: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const renderDiagram = async () => {
      const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
      try {
        const { svg } = await mermaid.render(id, code);
        setSvg(svg);
        setError('');
      } catch (e) {
        console.error('Mermaid render error:', e);
        setError(e instanceof Error ? e.message : 'Unknown error');
      }
    };
    renderDiagram();
  }, [code]);

  if (error) {
    return (
      <div className={styles.mermaidError}>
        <div className={styles.mermaidErrorLabel}>Mermaid diagram (broken)</div>
        <SyntaxHighlighter
          style={isDark ? oneDark : oneLight}
          language="mermaid"
          PreTag="div"
          className={styles.codeBlock}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    );
  }

  if (!svg) {
    return <div className={styles.mermaidContainer}>Loading diagram...</div>;
  }

  return (
    <div
      ref={containerRef}
      className={styles.mermaidContainer}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const isDark = computedColorScheme === 'dark';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
      securityLevel: 'loose',
    });
  }, [isDark]);

  const renderCode = useCallback(({ className, children }: { className?: string; children?: React.ReactNode }) => {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    const code = String(children).replace(/\n$/, '');
    const isInline = !match && !code.includes('\n');

    if (isInline) {
      return <code className={styles.inlineCode}>{children}</code>;
    }

    if (language === 'mermaid') {
      return <MermaidDiagram code={code} isDark={isDark} />;
    }

    return (
      <SyntaxHighlighter
        style={isDark ? oneDark : oneLight}
        language={language || 'text'}
        PreTag="div"
        className={styles.codeBlock}
      >
        {code}
      </SyntaxHighlighter>
    );
  }, [isDark]);

  const renderPre = useCallback(({ children }: { children?: React.ReactNode }) => {
    return <>{children}</>;
  }, []);

  if (!mounted) {
    return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>;
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        table: ({ children }) => (
          <table className={styles.table}>{children}</table>
        ),
        thead: ({ children }) => (
          <thead>{children}</thead>
        ),
        tbody: ({ children }) => (
          <tbody>{children}</tbody>
        ),
        tr: ({ children }) => (
          <tr>{children}</tr>
        ),
        th: ({ children }) => (
          <th>{children}</th>
        ),
        td: ({ children }) => (
          <td>{children}</td>
        ),
        ul: ({ children }) => (
          <ul className={styles.ul}>{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className={styles.ol}>{children}</ol>
        ),
        li: ({ children }) => (
          <li className={styles.li}>{children}</li>
        ),
        blockquote: ({ children }) => (
          <blockquote className={styles.blockquote}>{children}</blockquote>
        ),
        h1: ({ children }) => (
          <h1 className={styles.h1}>{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className={styles.h2}>{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className={styles.h3}>{children}</h3>
        ),
        p: ({ children }) => (
          <p className={styles.p}>{children}</p>
        ),
        code: (props) => renderCode(props as { className?: string; children?: React.ReactNode }),
        pre: renderPre,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}