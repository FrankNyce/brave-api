import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchInputProps {
  onSearch: (ticker: string, company: string) => void;
  loading: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({ onSearch, loading }) => {
  const [ticker, setTicker] = useState('');
  const [company, setCompany] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticker.trim() && company.trim()) {
      onSearch(ticker.trim().toUpperCase(), company.trim());
    }
  };

  const handleQuickSearch = (tickerSymbol: string, companyName: string) => {
    setTicker(tickerSymbol);
    setCompany(companyName);
    onSearch(tickerSymbol, companyName);
  };

  return (
    <div className="card mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Investment Research</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ticker" className="block text-sm font-medium text-gray-700 mb-1">
              Stock Ticker
            </label>
            <input
              type="text"
              id="ticker"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              placeholder="e.g., AAPL"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              disabled={loading}
            />
          </div>
          
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g., Apple Inc."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              disabled={loading}
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading || !ticker.trim() || !company.trim()}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <MagnifyingGlassIcon className="h-4 w-4" />
          {loading ? 'Researching...' : 'Research Company'}
        </button>
      </form>

      <div className="mt-6">
        <p className="text-sm text-gray-600 mb-3">Quick examples:</p>
        <div className="flex flex-wrap gap-2">
          {[
            { ticker: 'AAPL', company: 'Apple Inc.' },
            { ticker: 'MSFT', company: 'Microsoft Corporation' },
            { ticker: 'GOOGL', company: 'Alphabet Inc.' },
            { ticker: 'TSLA', company: 'Tesla Inc.' },
          ].map(({ ticker: t, company: c }) => (
            <button
              key={t}
              onClick={() => handleQuickSearch(t, c)}
              disabled={loading}
              className="btn-secondary text-xs disabled:opacity-50"
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};