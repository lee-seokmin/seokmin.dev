export interface Post {
  title: string;
  description: string;
  thumbnail: string;
  create_at: string;
  category: string;
  tags: string[];
  slug: string;
  content: string;
  best: boolean;
  subcategory?: string;
}