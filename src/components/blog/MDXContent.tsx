'use client';

import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote';
import MDXComponents from '@/components/blog/MDXComponents';

interface MDXContentProps {
  mdxSource: MDXRemoteSerializeResult;
}

export default function MDXContent({ mdxSource }: MDXContentProps) {
  if (!mdxSource) {
    return <div>콘텐츠를 불러오는 중...</div>;
  }

  return (
    <div className="prose prose-lg max-w-none">
      <MDXRemote
        {...mdxSource}
        components={MDXComponents}
      />
    </div>
  );
}
