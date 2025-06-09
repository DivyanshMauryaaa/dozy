import React from 'react';
import { MarkdownEngine } from './renderer';

type MarkdownRendererProps = {
  children?: string;
  className?: string;
  components?: {
    [key: string]: React.ComponentType<{
      node: MarkdownNode;
      children?: React.ReactNode;
    }>;
  };
};

type MarkdownNode = {
  type: string;
  content?: string;
  children?: MarkdownNode[];
  attributes?: Record<string, string>;
};

const defaultComponents: {
  [key: string]: React.ComponentType<{
    node: MarkdownNode;
    children?: React.ReactNode;
  }>;
} = {
  heading: ({ node, children }: any) => {
    const level = node.attributes?.level || '1';
    const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
    return <HeadingTag>{children}</HeadingTag>;
  },
  paragraph: ({ children }: any) => <p>{children}</p>,
  bold: ({ children }: any) => <strong>{children}</strong>,
  italic: ({ children }: any) => <em>{children}</em>,
  code: ({ node }: any) => <code>{node.content}</code>,
  codeBlock: ({ node }: any) => {
    const lang = node.attributes?.language || '';
    return (
      <pre>
        <code className={`language-${lang}`}>{node.content}</code>
      </pre>
    );
  },
  link: ({ node, children }: any) => (
    <a href={node.attributes?.href || '#'}>{children}</a>
  ),
  image: ({ node }: any) => (
    <img src={node.attributes?.src || ''} alt={node.attributes?.alt || ''} />
  ),
  listItem: ({ children }: any) => <li>{children}</li>,
  blockquote: ({ children }: any) => <blockquote>{children}</blockquote>,
  text: ({ node }: any) => (
    <>
      {node.content?.split('\n').map((line: any, i: any, arr: any) => (
        <React.Fragment key={i}>
          {line}
          {i < arr.length - 1 && <br />}
        </React.Fragment>
      ))}
    </>
  ),
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  children = '',
  className,
  components = {},
}) => {
  const mergedComponents = { ...defaultComponents, ...components };
  const nodes = MarkdownEngine.parse(children);

  const renderNode = (node: MarkdownNode): React.ReactNode => {
    const Component = mergedComponents[node.type] || mergedComponents.text;
    const children = node.children
      ? node.children.map((child, i) => (
          <React.Fragment key={i}>{renderNode(child)}</React.Fragment>
        ))
      : null;

    return Component({ node, children });
  };

  return (
    <div className={className}>
      {nodes.map((node, i) => (
        <React.Fragment key={i}>{renderNode(node)}</React.Fragment>
      ))}
    </div>
  );
};