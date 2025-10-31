import SearchClient from './search-client';
import { getArticlesData } from '@/lib/article_data';

interface SearchPageProps {
  searchParams?: { q?: string };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const allArticles = getArticlesData();
  const query = searchParams?.q || '';

  const filteredArticles = query
    ? allArticles.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.content.toLowerCase().includes(query.toLowerCase())
      )
    : allArticles;

  return <SearchClient articles={filteredArticles} initialQuery={query} />;
}
