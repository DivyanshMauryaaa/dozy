'use client';

import dynamic from 'next/dynamic';

const RemirrorEditor = dynamic(() => import('./editor'), {
  ssr: false,
  loading: () => <div>Loading editor...</div>
});

const MyPage = () => {
  return (
    <div>
      <h1>My Editor</h1>
      <RemirrorEditor />
    </div>
  );
};

export default MyPage;