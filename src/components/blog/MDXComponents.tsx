import Image from 'next/image';

function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^가-힣a-z0-9 ]/g, '') // 한글과 영문, 숫자, 공백만 남김
    .replace(/ /g, '-')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '');
}

const MDXComponents = {
  // Headers with auto-generated IDs
  h1: ({ children, id, ...props }: any) => {
    const text = typeof children === 'string' ? children : '';
    const slug = id || createSlug(text);
    return (
      <h1
        id={slug}
        className="text-3xl font-bold text-foreground mb-4 mt-8 first:mt-0 scroll-mt-20"
        {...props}
      >
        {children}
      </h1>
    );
  },
  h2: ({ children, id, ...props }: any) => {
    const text = typeof children === 'string' ? children : '';
    const slug = id || createSlug(text);
    return (
      <h2
        id={slug}
        className="text-2xl font-semibold text-foreground mb-3 mt-6 scroll-mt-20"
        {...props}
      >
        {children}
      </h2>
    );
  },
  h3: ({ children, id, ...props }: any) => {
    const text = typeof children === 'string' ? children : '';
    const slug = id || createSlug(text);
    return (
      <h3
        id={slug}
        className="text-xl font-semibold text-foreground mb-2 mt-4 scroll-mt-20"
        {...props}
      >
        {children}
      </h3>
    );
  },
  h4: ({ children, id, ...props }: any) => {
    const text = typeof children === 'string' ? children : '';
    const slug = id || createSlug(text);
    return (
      <h4
        id={slug}
        className="text-lg font-semibold text-foreground mb-2 mt-3 scroll-mt-20"
        {...props}
      >
        {children}
      </h4>
    );
  },
  h5: ({ children, id, ...props }: any) => {
    const text = typeof children === 'string' ? children : '';
    const slug = id || createSlug(text);
    return (
      <h5
        id={slug}
        className="text-base font-semibold text-foreground mb-1 mt-2 scroll-mt-20"
        {...props}
      >
        {children}
      </h5>
    );
  },
  h6: ({ children, id, ...props }: any) => {
    const text = typeof children === 'string' ? children : '';
    const slug = id || createSlug(text);
    return (
      <h6
        id={slug}
        className="text-sm font-semibold text-foreground mb-1 mt-2 scroll-mt-20"
        {...props}
      >
        {children}
      </h6>
    );
  },

  // Paragraphs
  p: ({ children, ...props }: any) => (
    <p className="text-foreground leading-relaxed" {...props}>
      {children}
    </p>
  ),

  // Lists
  ul: ({ children, ...props }: any) => (
    <ul className="list-disc list-inside mb-4 space-y-1" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol className="list-decimal list-inside mb-4 space-y-1" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: any) => (
    <li className="text-foreground" {...props}>
      {children}
    </li>
  ),

  // Links
  a: ({ children, href, ...props }: any) => {
    const isExternal = href && href.startsWith('http');
    return (
      <a
        href={href}
        className="text-chart-2 hover:text-chart-2/80 underline decoration-2 underline-offset-2"
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...props}
      >
        {children}
      </a>
    );
  },

  // Images
  img: ({ src, alt, ...props }: any) => {
    if (!src) return null;

    // Handle relative paths for images in _posts directory
    const isRelativePath = src.startsWith('/');
    const imageSrc = isRelativePath ? src : `/_posts/${src}`;

    return (
      <Image
        src={imageSrc}
        alt={alt || 'Blog image'}
        width={800}
        height={400}
        className="rounded-lg w-full h-auto my-6"
        {...props}
      />
    );
  },

  // Blockquotes
  blockquote: ({ children, ...props }: any) => (
    <blockquote className="border-l-4 border-primary pl-4 py-2 my-4 bg-muted/30" {...props}>
      {children}
    </blockquote>
  ),

  // Code blocks
  code: ({ children, className, ...props }: any) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      );
    }
    return (
      <code className={`block bg-muted p-4 rounded-lg overflow-x-auto ${className || ''}`} {...props}>
        {children}
      </code>
    );
  },

  // Pre (for code blocks)
  pre: ({ children, ...props }: any) => (
    <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-4" {...props}>
      {children}
    </pre>
  ),

  // Horizontal rule
  hr: (props: any) => (
    <hr className="border-border my-8" {...props} />
  ),

  // Tables
  table: ({ children, ...props }: any) => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full border-collapse border border-border" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }: any) => (
    <th className="border border-border px-4 py-2 bg-muted text-left font-semibold" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: any) => (
    <td className="border border-border px-4 py-2" {...props}>
      {children}
    </td>
  ),

  // Strong and emphasis
  strong: ({ children, ...props }: any) => (
    <strong className="font-semibold" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }: any) => (
    <em className="italic" {...props}>
      {children}
    </em>
  ),

  // Custom div wrapper for the blog styling
  div: ({ children, className, ...props }: any) => {
    if (className && className.includes('flex')) {
      return (
        <div className={className} {...props}>
          {children}
        </div>
      );
    }
    return (
      <div {...props}>
        {children}
      </div>
    );
  },
};

export default MDXComponents;
