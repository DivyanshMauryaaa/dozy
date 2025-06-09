'use client';

import { Editor } from '@/components/RichText/markdown/editor';
import { useState } from 'react';

// Option 1: If you want to pass defaultContent as a prop
type NotePageProps = {
  defaultContent?: string;
};

export default function NotePage({ defaultContent }: NotePageProps) {
  const [content, setContent] = useState(defaultContent || '# Welcome to My Editor\n\nStart typing your markdown here...');
  
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Editor</h1>
      <Editor 
        initialContent={content}
        onChange={setContent}
        className="mb-8"
      />
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="font-bold mb-2">Markdown Output:</h2>
        <pre className="text-sm overflow-x-auto bg-white p-4 rounded">
          {content}
        </pre>
      </div>
    </div>
  );
}