'use client';

import React, { useCallback, useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { useHelpers, useRemirrorContext } from '@remirror/react';
import { WysiwygEditor } from '@remirror/react-editors/wysiwyg';

// Use the correct type from ProseMirror
type RemirrorJSON = any; // or just use 'any' for simplicity

// Types for the component props
interface RemirrorEditorProps {
  initialContent?: RemirrorJSON | string;
  value?: RemirrorJSON;
  onChange?: (content: RemirrorJSON) => void;
  onTextChange?: (text: string) => void;
  placeholder?: string;
  editable?: boolean;
  className?: string;
  autoFocus?: boolean;
  minHeight?: number;
  maxHeight?: number;
}

// Ref methods that parent components can call
export interface RemirrorEditorRef {
  getContent: () => RemirrorJSON;
  setContent: (content: RemirrorJSON | string) => void;
  getText: () => string;
  clear: () => void;
  focus: () => void;
  blur: () => void;
  insertText: (text: string) => void;
}

// Helper function to create default document
const createDefaultDoc = (content?: string): RemirrorJSON => {
  if (!content) {
    return {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          attrs: { dir: null, ignoreBidiAutoUpdate: null },
          content: [],
        },
      ],
    };
  }

  return {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        attrs: { dir: null, ignoreBidiAutoUpdate: null },
        content: [{ type: 'text', text: content }],
      },
    ],
  };
};

// Convert string to RemirrorJSON
const stringToDoc = (text: string): RemirrorJSON => {
  const paragraphs = text.split('\n').map(line => ({
    type: 'paragraph',
    attrs: { dir: null, ignoreBidiAutoUpdate: null },
    content: line ? [{ type: 'text', text: line }] : [],
  }));

  return {
    type: 'doc',
    content: paragraphs,
  };
};

// Internal component that has access to Remirror context
function EditorContent({ 
  value, 
  onChange, 
  onTextChange, 
  editorRef 
}: {
  value?: RemirrorJSON;
  onChange?: (content: RemirrorJSON) => void;
  onTextChange?: (text: string) => void;
  editorRef: React.MutableRefObject<RemirrorEditorRef | null>;
}) {
  const { setContent } = useRemirrorContext();
  const { getText, insertText, getJSON } = useHelpers();
  const { focus, blur } = useRemirrorContext();

  // Expose methods to parent via ref
  useImperativeHandle(editorRef, () => ({
    getContent: () => getJSON(),
    setContent: (content: RemirrorJSON | string) => {
      const doc = typeof content === 'string' ? stringToDoc(content) : content;
      setContent(doc);
    },
    getText: () => getText(),
    clear: () => setContent(createDefaultDoc()),
    focus: () => focus(),
    blur: () => blur(),
    insertText: (text: string) => insertText(text),
  }), [setContent, getJSON, getText, insertText, focus, blur]);

  // Handle controlled value changes
  useEffect(() => {
    if (value) {
      setContent(value);
    }
  }, [value, setContent]);

  // Handle content changes
  useEffect(() => {
    const handleChange = () => {
      const content = getJSON();
      const text = getText();
      
      onChange?.(content);
      onTextChange?.(text);
    };

    // Set up a listener for content changes
    const interval = setInterval(handleChange, 100);
    return () => clearInterval(interval);
  }, [getJSON, getText, onChange, onTextChange]);

  return null;
}

// Main editor component
const CustomizableRemirrorEditor = forwardRef<RemirrorEditorRef, RemirrorEditorProps>(({
  initialContent,
  value,
  onChange,
  onTextChange,
  placeholder = 'Start typing...',
  editable = true,
  className = '',
  autoFocus = false,
  minHeight = 200,
  maxHeight,
}, ref) => {
  const [isMounted, setIsMounted] = useState(false);
  const mountRef = useRef<boolean>(false);
  const editorRef = useRef<RemirrorEditorRef | null>(null);

  // Forward ref to parent
  useImperativeHandle(ref, () => editorRef.current!, []);

  useEffect(() => {
    if (!mountRef.current) {
      setIsMounted(true);
      mountRef.current = true;
    }

    return () => {
      mountRef.current = false;
    };
  }, []);

  if (!isMounted) {
    return <div style={{ height: minHeight }}>Loading editor...</div>;
  }

  // Prepare initial content
  const initialDoc = React.useMemo(() => {
    if (initialContent) {
      return typeof initialContent === 'string' 
        ? stringToDoc(initialContent) 
        : initialContent;
    }
    return createDefaultDoc();
  }, [initialContent]);

  const editorStyle: React.CSSProperties = {
    minHeight,
    maxHeight,
    overflowY: maxHeight ? 'auto' : 'visible',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    backgroundColor: '#fff',
  };

  return (
    <div className={className} suppressHydrationWarning={true}>
      <div style={editorStyle}>
        <WysiwygEditor
          placeholder={placeholder}
          editable={editable}
          autoFocus={autoFocus}
          initialContent={initialDoc}
          key="customizable-remirror-editor"
        >
          <EditorContent
            value={value}
            onChange={onChange}
            onTextChange={onTextChange}
            editorRef={editorRef}
          />
        </WysiwygEditor>
      </div>
    </div>
  );
});

CustomizableRemirrorEditor.displayName = 'CustomizableRemirrorEditor';

export default CustomizableRemirrorEditor;