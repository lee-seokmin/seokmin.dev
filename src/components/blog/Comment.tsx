'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from "next-themes";

const Comment = ({ className }: { className?: string }) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
    }
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    
    const scriptElement = document.createElement('script');
    scriptElement.setAttribute('src', 'https://giscus.app/client.js');
    scriptElement.setAttribute('data-repo', 'lee-seokmin/seokmin.dev');
    scriptElement.setAttribute('data-repo-id', 'R_kgDOQADWAA');
    scriptElement.setAttribute('data-category', 'General');
    scriptElement.setAttribute('data-category-id', 'DIC_kwDOQADWAM4Cwg9k');
    scriptElement.setAttribute('data-mapping', 'pathname');
    scriptElement.setAttribute('data-strict', '0');
    scriptElement.setAttribute('data-reactions-enabled', '1');
    scriptElement.setAttribute('data-emit-metadata', '0');
    scriptElement.setAttribute('data-input-position', 'bottom');
    scriptElement.setAttribute('data-theme', `${theme === 'dark' ? 'dark_dimmed' : 'light_protanopia'}`);
    scriptElement.setAttribute('data-lang', 'ko');
    scriptElement.setAttribute('crossorigin', 'anonymous');
    scriptElement.async = true;

    ref.current?.appendChild(scriptElement);
  }, [mounted]);

  useEffect(() => {
    const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
    if (!iframe) return;
    
    iframe.contentWindow?.postMessage(
      { giscus: { setConfig: { theme } } },
      'https://giscus.app'
    );
  }, [theme]);

  if (!mounted) return null;

  return <div ref={ref} className={`${className}`} />;
};

export default Comment;