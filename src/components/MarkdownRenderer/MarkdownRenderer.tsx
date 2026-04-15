import { useEffect, useState, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ActionIcon, Tooltip, useComputedColorScheme } from '@mantine/core';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import mermaid from 'mermaid';
import {
  IconMaximize,
  IconMinimize,
} from '@tabler/icons-react';
import styles from './MarkdownRenderer.module.css';

interface MarkdownRendererProps {
  content: string;
}

function MermaidDiagram({ code, isDark }: { code: string; isDark: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const renderDiagram = async () => {
      if (await mermaid.parse(code)) {
        const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        const { svg } = await mermaid.render(id, code);
        setSvg(svg);
        setError('');
      } else {
        const errorText = `Mermaid render error for code=${code}`
        console.error(errorText);
        setError(errorText)
      }
    };
    renderDiagram();
  }, [code]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = !!document.fullscreenElement;
      setIsFullscreen(isFs);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement && containerRef.current) {
      await containerRef.current.requestFullscreen();
    } else if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
  };

  if (error) {
    return (
      <div className={styles.mermaidError}>
        <div className={styles.mermaidErrorLabel}>Mermaid-диаграмма невалидная</div>
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
    return <div className={styles.mermaidContainer}>Рендеринг диаграммы...</div>;
  }

  return (
    <div
      ref={containerRef}
      className={`${styles.mermaidContainer} ${isFullscreen ? styles.mermaidFullscreen : ''}`}
    >
      <div className={styles.mermaidControls}>
        <Tooltip position="bottom" label={isFullscreen ? 'Выйти из полноэкраного режима (Esc)' : 'Открыть диаграмму в полноэкранном режиме'}>
            <ActionIcon 
            onClick={toggleFullscreen}
            size='sm'
            variant="light"
            color="gray"
          >
            {isFullscreen ? <IconMinimize size={14}  /> : <IconMaximize size={14} />}
          </ActionIcon >
        </Tooltip>
      </div>
      <div
        ref={svgContainerRef}
        className={styles.svgContainer}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
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