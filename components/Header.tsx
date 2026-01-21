'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PenSquare, Search, X } from 'lucide-react';

interface HeaderProps {
  onSearchChange?: (query: string) => void;
}

export function Header({ onSearchChange }: HeaderProps) {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = useCallback((value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
    }
  }, [onSearchChange]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(searchValue);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    // Trigger search immediately when input changes
    handleSearch(value);
  };

  const handleClear = () => {
    setSearchValue('');
    handleSearch('');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-violet-500/10 via-primary/5 to-blue-500/10 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-lg">
            <PenSquare className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gradient-primary">Blog App</span>
        </div>

        {/* Search Bar and Create Blog Button */}
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search blogs..."
              value={searchValue}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className="w-64 pl-9 pr-9 h-9 rounded-lg bg-background/50 border-muted-200 focus-visible:border-primary/50 focus-visible:ring-primary/20"
            />
            {searchValue && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Create Blog Button */}
          <Button className="rounded-lg bg-gradient-primary hover:bg-gradient-primary/90 shadow-lg hover:shadow-xl transition-all">
            <PenSquare className="w-4 h-4 mr-2" />
            Create Blog
          </Button>
        </div>
      </div>
    </header>
  );
}
