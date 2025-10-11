"use client";

import { useRouter } from 'next/navigation';
import { Sort } from '@/components/blog/sort';

interface SortClientWrapperProps {
  selectedSortOption: string;
}

export function SortClientWrapper({ selectedSortOption }: SortClientWrapperProps) {
  const router = useRouter();

  return (
    <Sort
      selectedSortOption={selectedSortOption}
      onSortOptionChange={(sortOption) => {
        const url = new URL(window.location.href);
        if (sortOption) {
          url.searchParams.set('sort', sortOption);
        } else {
          url.searchParams.delete('sort');
        }
        router.push(url.pathname + url.search);
      }}
    />
  );
}
