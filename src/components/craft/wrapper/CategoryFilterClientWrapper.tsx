"use client";

import { useRouter } from 'next/navigation';
import { CategoryFilter } from '@/components/craft/filter';

interface CategoryFilterClientWrapperProps {
  categories: string[];
  selectedCategory: string;
}

export function CategoryFilterClientWrapper({
  categories,
  selectedCategory
}: CategoryFilterClientWrapperProps) {
  const router = useRouter();

  return (
    <CategoryFilter
      categories={categories}
      selectedCategory={selectedCategory}
      onCategoryChange={(category) => {
        const url = new URL(window.location.href);
        if (category) {
          url.searchParams.set('category', category);
        } else {
          url.searchParams.delete('category');
        }
        router.push(url.pathname + url.search);
      }}
    />
  );
}
