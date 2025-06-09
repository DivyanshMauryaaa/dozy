// src/components/RichText/markdown/engine.ts
type MarkdownNode = {
  type: string;
  content?: string;
  children?: MarkdownNode[];
  attributes?: Record<string, string>;
};

export class MarkdownEngine {
  private static blockRules = [
    { regex: /^#{6}\s(.+)/, type: 'heading', level: 6 },
    { regex: /^#{5}\s(.+)/, type: 'heading', level: 5 },
    { regex: /^#{4}\s(.+)/, type: 'heading', level: 4 },
    { regex: /^#{3}\s(.+)/, type: 'heading', level: 3 },
    { regex: /^#{2}\s(.+)/, type: 'heading', level: 2 },
    { regex: /^#{1}\s(.+)/, type: 'heading', level: 1 },
    { regex: /^```([a-z]*)\n([\s\S]*?)\n```$/m, type: 'codeBlock' },
    { regex: /^-\s(.*)/, type: 'listItem' },
    { regex: /^\*\s(.*)/, type: 'listItem' },
    { regex: /^\d+\.\s(.*)/, type: 'listItem', ordered: true },
    { regex: /^>\s(.*)/, type: 'blockquote' },
    { regex: /^$/, type: 'emptyLine' }
  ];

  private static inlineRules = [
    { regex: /(`{3}[\s\S]*?`{3})/g, type: 'codeBlock' }, // Triple backticks
    { regex: /(`[^`]+`)/g, type: 'code' }, // Single backticks
    { regex: /(\*\*[^*]+\*\*)/g, type: 'bold' }, // **bold**
    { regex: /(\*[^*]+\*)/g, type: 'italic' }, // *italic*
    { regex: /(!\[[^\]]*\]\([^)]+\))/g, type: 'image' }, // ![alt](url)
    { regex: /(\[[^\]]+\]\([^)]+\))/g, type: 'link' } // [text](url)
  ];

  static parse(markdown: string): MarkdownNode[] {
    if (!markdown || markdown.trim() === '') {
      return [{ type: 'paragraph', children: [{ type: 'text', content: '' }] }];
    }

    const lines = markdown.split('\n');
    const nodes: MarkdownNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i].trim();
      let matched = false;

      // Skip empty lines but don't create nodes for them
      if (line === '') {
        i++;
        continue;
      }

      // Try to match block rules
      for (const rule of this.blockRules) {
        const match = line.match(rule.regex);
        if (match) {
          nodes.push(this.createBlockNode(rule.type, match, rule));
          i++;
          matched = true;
          break;
        }
      }

      // If no block rule matched, treat as paragraph
      if (!matched) {
        const { node, linesConsumed } = this.parseParagraph(lines, i);
        if (node.children && node.children.length > 0) {
          nodes.push(node);
        }
        i += linesConsumed;
      }
    }

    return nodes.length > 0 ? nodes : [{ type: 'paragraph', children: [{ type: 'text', content: '' }] }];
  }

  private static createBlockNode(type: string, match: RegExpMatchArray, rule: any): MarkdownNode {
    if (type === 'heading') {
      return {
        type: 'heading',
        attributes: { level: rule.level.toString() },
        children: this.parseInline(match[1])
      };
    }
    
    if (type === 'codeBlock') {
      return {
        type: 'codeBlock',
        content: match[2] || match[1] || '',
        attributes: { language: match[1] || 'text' }
      };
    }

    if (type === 'listItem') {
      return {
        type: 'listItem',
        children: this.parseInline(match[1]),
        attributes: rule.ordered ? { ordered: 'true' } : {}
      };
    }

    if (type === 'blockquote') {
      return {
        type: 'blockquote',
        children: this.parseInline(match[1])
      };
    }

    return {
      type: type,
      children: this.parseInline(match[1] || match[0])
    };
  }

  private static parseParagraph(lines: string[], start: number): { node: MarkdownNode; linesConsumed: number } {
    let content = '';
    let i = start;
    
    // Collect lines until we hit a block element or empty line
    while (i < lines.length) {
      const line = lines[i].trim();
      
      // Stop at empty line
      if (line === '') break;
      
      // Stop at block elements
      if (this.blockRules.some(r => r.type !== 'emptyLine' && line.match(r.regex))) {
        break;
      }
      
      content += (content ? '\n' : '') + line;
      i++;
    }

    return {
      node: {
        type: 'paragraph',
        children: content ? this.parseInline(content) : []
      },
      linesConsumed: Math.max(1, i - start) // At least consume 1 line
    };
  }

  private static parseInline(text: string): MarkdownNode[] {
    if (!text) return [];
    
    const nodes: MarkdownNode[] = [];
    let remaining = text;

    while (remaining.length > 0) {
      let earliestMatch: { index: number; rule: any; match: RegExpMatchArray } | null = null;

      // Find the earliest match among all inline rules
      for (const rule of this.inlineRules) {
        rule.regex.lastIndex = 0; // Reset regex state
        const match = rule.regex.exec(remaining);
        if (match && (!earliestMatch || match.index < earliestMatch.index)) {
          earliestMatch = { index: match.index, rule, match };
        }
      }

      if (!earliestMatch) {
        // No more matches, add remaining text
        if (remaining.trim()) {
          nodes.push({ type: 'text', content: remaining });
        }
        break;
      }

      // Add text before the match
      if (earliestMatch.index > 0) {
        const beforeText = remaining.slice(0, earliestMatch.index);
        if (beforeText.trim()) {
          nodes.push({ type: 'text', content: beforeText });
        }
      }

      // Add the matched element
      const matchedText = earliestMatch.match[1];
      
      if (earliestMatch.rule.type === 'bold') {
        const innerText = matchedText.slice(2, -2); // Remove **
        nodes.push({
          type: 'bold',
          children: [{ type: 'text', content: innerText }]
        });
      } else if (earliestMatch.rule.type === 'italic') {
        const innerText = matchedText.slice(1, -1); // Remove *
        nodes.push({
          type: 'italic',
          children: [{ type: 'text', content: innerText }]
        });
      } else if (earliestMatch.rule.type === 'code') {
        const innerText = matchedText.slice(1, -1); // Remove `
        nodes.push({
          type: 'code',
          content: innerText
        });
      } else if (earliestMatch.rule.type === 'link') {
        const linkMatch = matchedText.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          nodes.push({
            type: 'link',
            children: [{ type: 'text', content: linkMatch[1] }],
            attributes: { href: linkMatch[2] }
          });
        }
      } else if (earliestMatch.rule.type === 'image') {
        const imgMatch = matchedText.match(/!\[([^\]]*)\]\(([^)]+)\)/);
        if (imgMatch) {
          nodes.push({
            type: 'image',
            attributes: { src: imgMatch[2], alt: imgMatch[1] }
          });
        }
      }

      // Move past the matched text
      remaining = remaining.slice(earliestMatch.index + earliestMatch.match[0].length);
    }

    return nodes;
  }

  static toHtml(nodes: MarkdownNode[]): string {
    if (!nodes || nodes.length === 0) return '';
    
    return nodes.map(node => {
      switch (node.type) {
        case 'heading':
          const level = node.attributes?.level || '1';
          return `<h${level}>${this.toHtml(node.children || [])}</h${level}>`;
          
        case 'paragraph':
          return `<p>${this.toHtml(node.children || [])}</p>`;
          
        case 'bold':
          return `<strong>${this.toHtml(node.children || [])}</strong>`;
          
        case 'italic':
          return `<em>${this.toHtml(node.children || [])}</em>`;
          
        case 'code':
          return `<code>${this.escapeHtml(node.content || '')}</code>`;
          
        case 'codeBlock':
          const lang = node.attributes?.language || '';
          return `<pre><code class="language-${lang}">${this.escapeHtml(node.content || '')}</code></pre>`;
          
        case 'link':
          const href = node.attributes?.href || '#';
          return `<a href="${this.escapeHtml(href)}">${this.toHtml(node.children || [])}</a>`;
          
        case 'image':
          const src = node.attributes?.src || '';
          const alt = node.attributes?.alt || '';
          return `<img src="${this.escapeHtml(src)}" alt="${this.escapeHtml(alt)}" />`;
          
        case 'listItem':
          return `<li>${this.toHtml(node.children || [])}</li>`;
          
        case 'blockquote':
          return `<blockquote>${this.toHtml(node.children || [])}</blockquote>`;
          
        case 'text':
          return this.escapeHtml(node.content || '').replace(/\n/g, '<br>');
          
        default:
          return '';
      }
    }).join('');
  }

  private static escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}