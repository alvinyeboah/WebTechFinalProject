import React, { useState } from 'react';
import { Search, Grid, List } from 'lucide-react';

interface SearchFilterProps {
  onSearchChange: (term: string) => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  viewMode: 'grid' | 'list';
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  onSearchChange,
  onViewModeChange,
  viewMode
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearchChange(term);
  };

  return (
    <div className="flex gap-4 mb-8">
      <div className="relative flex-grow">
        <input 
          type="text" 
          placeholder="Search artworks, artists, styles..."
          className="w-full bg-[#2D2D2D] text-white px-4 py-3 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Search className="absolute left-3 top-4 text-gray-400" />
      </div>

      <div className="flex gap-2">
        <button 
          onClick={() => onViewModeChange('grid')}
          className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-[#FFD700] text-black' : 'bg-[#2D2D2D] text-white'}`}
        >
          <Grid />
        </button>
        <button 
          onClick={() => onViewModeChange('list')}
          className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-[#FFD700] text-black' : 'bg-[#2D2D2D] text-white'}`}
        >
          <List />
        </button>
      </div>
    </div>
  );
};