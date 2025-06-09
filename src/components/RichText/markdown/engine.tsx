// src/components/RichText/markdown/engine.ts
type MarkdownNode = {
  type: string;
  content?: string;
  children?: MarkdownNode[];
  attributes?: Record<string, string>;
};

export class MarkdownEngine {
  private static blockRules = [
    { regex: /^#{1,6}\s(.+)/, type: 'heading', getDepth: (match: RegExpMatchArray) => match[0].trim().length },
    { regex: /^```([a-z]*)\n([\s\S]*?)\n```$/, type: 'codeBlock' },
    { regex: /^-\s(.*)/, type: 'listItem' },
    { regex: /^\*\s(.*)/, type: 'listItem' },
    { regex: /^\d\.\s(.*)/, type: 'listItem', ordered: true },
    { regex: /^>\s(.*)/, type: 'blockquote' },
    { regex: /^$/, type: 'emptyLine' }
  ];

  private static inlineRules = [
    { regex: /(`{1,3})([^`]+)\1/, type: 'code' },
    { regex: /\*\*(.*?)\*\*/, type: 'bold' },
    { regex: /\*(.*?)\*/, type: 'italic' },
    { regex: /!\[([^\]]*)\]\(([^)]+)\)/, type: 'image' },
    { regex: /\[([^\]]+)\]\(([^)]+)\)/, type: 'link' }
  ];

  static parse(markdown: string): MarkdownNode[] {
    const lines = markdown.split('\n');
    const nodes: MarkdownNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      let matched = false;

      for (const rule of this.blockRules) {
        const match = line.match(rule.regex);
        if (match) {
          nodes.push(this.createNode(rule.type, match, rule));
          i++;
          matched = true;
          break;
        }
      }

      if (!matched) {
        const { node, linesConsumed } = this.parseParagraph(lines, i);
        nodes.push(node);
        i += linesConsumed;
      }
    }

    return nodes;
  }

  private static createNode(type: string, match: RegExpMatchArray, rule: any): MarkdownNode {
    const baseNode: MarkdownNode = { type };
    
    if (type === 'heading') {
      return {
        ...baseNode,
        attributes: { level: rule.getDepth(match).toString() },
        children: this.parseInline(match[1])
      };
    }
    
    if (type === 'codeBlock') {
      return {
        ...baseNode,
        content: match[2],
        attributes: { language: match[1] || 'text' }
      };
    }

    return {
      ...baseNode,
      children: this.parseInline(match[1] || match[0])
    };
  }

  private static parseParagraph(lines: string[], start: number): { node: MarkdownNode; linesConsumed: number } {
    let content = '';
    let i = start;
    
    while (i < lines.length && !this.blockRules.some(r => lines[i].match(r.regex))) {
      content += (content ? '\n' : '') + lines[i];
      i++;
    }

    return {
      node: {
        type: 'paragraph',
        children: this.parseInline(content)
      },
      linesConsumed: i - start
    };
  }

  private static parseInline(text: string): MarkdownNode[] {
    const nodes: MarkdownNode[] = [];
    let remaining = text;

    while (remaining.length > 0) {
      let earliestMatch: { index: number; rule: any; match: RegExpMatchArray } | null = null;

      for (const rule of this.inlineRules) {
        const match = remaining.match(rule.regex);
        if (match && (!earliestMatch || match.index! < earliestMatch.index)) {
          earliestMatch = { index: match.index!, rule, match };
        }
      }

      if (!earliestMatch) {
        nodes.push({ type: 'text', content: remaining });
        break;
      }

      if (earliestMatch.index > 0) {
        nodes.push({ type: 'text', content: remaining.slice(0, earliestMatch.index) });
      }

      nodes.push({
        type: earliestMatch.rule.type,
        content: earliestMatch.match[2] || earliestMatch.match[1],
        ...(['link', 'image'].includes(earliestMatch.rule.type) && {
          attributes: { href: earliestMatch.match[2] }
        })
      });

      remaining = remaining.slice(earliestMatch.index + earliestMatch.match[0].length);
    }

    return nodes;
  }

  static toHtml(nodes: MarkdownNode[]): string {
    return nodes.map(node => {
      switch (node.type) {
        case 'heading':
          return `<h${node.attributes?.level}>${this.toHtml(node.children || [])}</h${node.attributes?.level}>`;
        case 'paragraph':
          return `<p>${this.toHtml(node.children || [])}</p>`;
        case 'bold':
          return `<strong>${this.toHtml(node.children || [])}</strong>`;
        case 'italic':
          return `<em>${this.toHtml(node.children || [])}</em>`;
        case 'code':
          return `<code>${node.content}</code>`;
        case 'codeBlock':
          return `<pre><code class="language-${node.attributes?.language}">${node.content}</code></pre>`;
        case 'link':
          return `<a href="${node.attributes?.href}">${node.content}</a>`;
        case 'text':
          return node.content?.replace(/\n/g, '<br>') || '';
        default:
          return '';
      }
    }).join('');
  }
}