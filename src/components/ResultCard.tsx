import React from 'react';
import { SearchResult } from '../types/investment';
import { ExternalLinkIcon, ClockIcon } from '@heroicons/react/24/outline';

interface ResultCardProps {
  result: SearchResult;
  showSource?: boolean;
  riskLevel?: 'low' | 'medium' | 'high';
}

export const ResultCard: React.FC<ResultCardProps> = ({ 
  result, 
  showSource = true, 
  riskLevel 
}) => {
  const getRiskBadgeClass = (level?: string) => {
    switch (level) {
      case 'high': return 'badge badge-danger';
      case 'medium': return 'badge badge-warning';
      case 'low': return 'badge badge-success';
      default: return 'badge badge-primary';
    }
  };

  const getFilingType = (title: string) => {
    if (title.includes('10-K')) return '10-K';
    if (title.includes('10-Q')) return '10-Q';
    if (title.includes('8-K')) return '8-K';
    if (title.includes('DEF 14A')) return 'Proxy';
    return null;
  };

  const filingType = getFilingType(result.title);

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-medium text-gray-900 line-clamp-2 leading-tight">
              <a 
                href={result.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary-600 transition-colors"
              >
                {result.title}
              </a>
            </h3>
            <ExternalLinkIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
          </div>
          
          {result.snippet && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {result.snippet}
            </p>
          )}
          
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {showSource && result.source && (
              <span className="font-medium">{result.source}</span>
            )}
            
            {result.published && (
              <div className="flex items-center gap-1">
                <ClockIcon className="h-3 w-3" />
                <span>{result.published}</span>
              </div>
            )}
            
            {filingType && (
              <span className="badge badge-primary">{filingType}</span>
            )}
            
            {riskLevel && (
              <span className={getRiskBadgeClass(riskLevel)}>
                {riskLevel.toUpperCase()} RISK
              </span>
            )}
          </div>
        </div>
        
        {result.favicon && (
          <img 
            src={result.favicon} 
            alt="" 
            className="w-4 h-4 flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
      </div>
    </div>
  );
};