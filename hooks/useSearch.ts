import { SearchResult } from '@/types/search';
import { useState, useCallback } from 'react';

interface Searchable {
  id: string;
  title?: string;
  description?: string;
}

export const useSearch = <T extends Searchable>(items: T[] = []) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResult<T>[]>([]);

  const performSearch = useCallback((query: string) => {
    setSearchQuery(query);
    
    const filtered: SearchResult<T>[] = items
      .map(item => {
        let relevance = 0;
        const highlights: { field: string; snippet: string }[] = [];

        // Check title match
        if (item.title?.toLowerCase().includes(query.toLowerCase())) {
          relevance += 2; // Title matches are weighted more heavily
          highlights.push({
            field: 'title',
            snippet: item.title
          });
        }

        // Check description match
        if (item.description?.toLowerCase().includes(query.toLowerCase())) {
          relevance += 1;
          highlights.push({
            field: 'description',
            snippet: item.description
          });
        }

        return {
          item,
          relevance,
          highlights: highlights.length > 0 ? highlights : undefined
        };
      })
      .filter(result => result.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance);

    setSearchResults(filtered);
  }, [items]);

  return {
    searchQuery,
    searchResults,
    performSearch
  };
};