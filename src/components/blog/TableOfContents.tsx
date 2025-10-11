"use client";

import { useState, useEffect } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Scroll } from "lucide-react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  // 헤더 수집 및 구조화
  useEffect(() => {
    const headingElements = document.querySelectorAll('h1, h2, h3');
    const headingList: Heading[] = [];

    headingElements.forEach((element) => {
      const id = element.id;
      const text = element.textContent || '';
      const level = parseInt(element.tagName.charAt(1));

      if (id && text) {
        headingList.push({ id, text, level });
      }
    });

    setHeadings(headingList);
  }, []);

  // 스크롤 진행도 및 활성 헤더 추적
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = Math.min((scrollTop / documentHeight) * 100, 100);

      setProgress(Math.round(scrollProgress));

      // 활성 헤더 찾기
      const headingElements = headings.map(h => document.getElementById(h.id)).filter(Boolean);

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const element = headingElements[i];
        if (element && element.offsetTop <= scrollTop + 100) {
          setActiveId(headings[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // 초기 실행

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  // 목차 클릭 핸들러
  const handleHeadingClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // 스무스 스크롤
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      // URL 업데이트
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', `#${id}`);
      }

      setActiveId(id);
      setIsOpen(false);
    }
  };

  // 목차가 비어있으면 렌더링하지 않음
  if (headings.length === 0) {
    return null;
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          className="w-9 h-9 rounded-full cursor-pointer relative bg-background border-2 border-border hover:border-primary/50 transition-all duration-200 shadow-lg hover:shadow-xl"
          title="목차"
        >
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            {/* 배경 원 */}
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-muted-foreground/20"
            />
            {/* 진행률 원 */}
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray={`${progress}, 100`}
              className="text-primary transition-all duration-300"
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-mono font-bold text-foreground">
            {progress}
          </span>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 bg-background/95 backdrop-blur-sm border shadow-xl"
        align="center"
        side="bottom"
        sideOffset={14}
      >
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
            <Scroll className="h-5 w-5" />
            목차
          </h3>
          <nav className="space-y-1 max-h-96 overflow-y-auto">
            {headings.map((heading) => {
              const isActive = activeId === heading.id;
              const indentClass = heading.level === 2 ? 'ml-4' : heading.level === 3 ? 'ml-8' : '';

              return (
                <button
                  key={heading.id}
                  onClick={() => handleHeadingClick(heading.id)}
                  className={`
                        w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 hover:bg-muted/50 cursor-pointer
                        ${indentClass}
                        ${isActive
                      ? 'bg-primary/10 text-primary font-medium border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                    }
                      `}
                >
                  {heading.text}
                </button>
              );
            })}
          </nav>
        </div>
      </PopoverContent>
    </Popover>
  );
}