// src/components/RichText/Editor.tsx
'use client';

import { useState, useRef, useCallback } from 'react';

type EditorProps = {
    initialContent?: string;
    onChange?: (content: string) => void;
    className?: string;
};

export function Editor({ initialContent = '', onChange, className }: EditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize editor ONCE
    const initializeEditor = useCallback(() => {
        if (!editorRef.current || isInitialized) return;

        // Convert initial markdown to HTML just once
        const initialHtml = initialContent
            .replace(/^# (.*$)/gim, '<h1 className="text-4xl">$1</h1>')
            .replace(/^## (.*$)/gim, '<h2 className="text-3xl">$1</h2>')
            .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            // Handle single line breaks within paragraphs
            .replace(/([^\n])\n([^\n])/g, '$1<br>$2')
            // Handle multiple line breaks (paragraphs)
            .split(/\n{2,}/)
            .map(p => p.trim() ? `<p>${p}</p>` : '')
            .join('');

        editorRef.current.innerHTML = initialHtml || '<p>Start typing...</p>';
        setIsInitialized(true);
    }, [initialContent, isInitialized]);

    // Convert HTML to markdown
    const htmlToMarkdown = useCallback((html: string): string => {
        const div = document.createElement('div');
        div.innerHTML = html;

        // Convert elements to markdown
        div.querySelectorAll('h1').forEach(h => h.replaceWith(`# ${h.textContent}\n\n`));
        div.querySelectorAll('h2').forEach(h => h.replaceWith(`## ${h.textContent}\n\n`));
        div.querySelectorAll('strong, b').forEach(b => b.replaceWith(`**${b.textContent}**`));
        div.querySelectorAll('em, i').forEach(i => i.replaceWith(`*${i.textContent}*`));
        div.querySelectorAll('code').forEach(c => c.replaceWith(`\`${c.textContent}\``));

        // Convert <br> tags to newlines
        div.querySelectorAll('br').forEach(br => br.replaceWith('\n'));

        // Convert paragraphs to double newlines
        div.querySelectorAll('p').forEach(p => {
            const content = p.innerHTML.replace(/<br>/g, '\n');
            p.replaceWith(`${content}\n\n`);
        });

        // Clean up excessive newlines
        return div.textContent
            ?.replace(/\n{3,}/g, '\n\n')  // More than 2 newlines becomes 2
            .replace(/([^\n])\n([^\n])/g, '$1\n$2')  // Preserve single newlines
            .trim() || '';
    }, []);

    // Rest of the component remains the same...
    const handleInput = useCallback(() => {
        if (!editorRef.current) return;
        const markdown = htmlToMarkdown(editorRef.current.innerHTML);
        onChange?.(markdown);
    }, [onChange, htmlToMarkdown]);

    const executeCommand = useCallback((command: string, value?: string) => {
        if (!editorRef.current) return;

        editorRef.current.focus();
        document.execCommand(command, false, value);
        handleInput();
    }, [handleInput]);

    return (
        <div className={`rounded-lg ${className}`}>
            {/* Toolbar */}
            <div className="flex items-center p-2 border-b bg-gray-50 gap-2">
                <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => executeCommand('bold')}
                    className="px-3 py-1 rounded hover:bg-gray-200 font-bold border"
                    title="Bold"
                >
                    B
                </button>

                <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => executeCommand('italic')}
                    className="px-3 py-1 rounded hover:bg-gray-200 italic border"
                    title="Italic"
                >
                    I
                </button>

                <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => executeCommand('formatBlock', '<h1>')}
                    className="px-3 py-1 rounded hover:bg-gray-200 font-bold border"
                    title="Heading 1"
                >
                    H1
                </button>

                <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => executeCommand('formatBlock', '<h2>')}
                    className="px-3 py-1 rounded hover:bg-gray-200 font-semibold border"
                    title="Heading 2"
                >
                    H2
                </button>

                <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => executeCommand('formatBlock', '<p>')}
                    className="px-3 py-1 rounded hover:bg-gray-200 border"
                    title="Paragraph"
                >
                    P
                </button>
            </div>

            {/* Editor Area */}
            <div
                ref={editorRef}
                contentEditable
                onFocus={initializeEditor}
                onInput={handleInput}
                className="p-4 min-h-[300px] focus:outline-none"
                style={{
                    lineHeight: '1.6',
                }}
                suppressContentEditableWarning={true}
            />

            <style jsx>{`
        [contenteditable] h1 {
          font-size: 5em;
          font-weight: bold;
          margin: 0.5em 0;
          color: blue;
        }
        [contenteditable] h2 {
          font-size: 2.5em;
          font-weight: bold;
          margin: 0.4em 0;
        }
        [contenteditable] p {
          margin: 0.5em 0;
          white-space: pre-wrap;
        }
        [contenteditable] strong {
          font-weight: bold;
        }
        [contenteditable] em {
          font-style: italic;
        }
        [contenteditable] code {
          background: #f4f4f4;
          padding: 2px 4px;
          border-radius: 3px;
          font-family: monospace;
        }
        [contenteditable] br {
          display: block;
          content: '';
          margin: 0;
        }
        [contenteditable] {
          outline: none;
        }
      `}</style>
        </div>
    );
}