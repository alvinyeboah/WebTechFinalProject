export interface SearchResult<T> {
    item: T;
    relevance: number;
    highlights?: {
      field: string;
      snippet: string;
    }[];
  }
  