import React, { useState } from 'react';
import { InvestmentPanel as InvestmentPanelType } from '../types/investment';
import { ResultCard } from './ResultCard';
import { StockOverview } from './StockOverview';
import { 
  NewspaperIcon, 
  DocumentTextIcon, 
  BuildingOfficeIcon, 
  ExclamationTriangleIcon,
  ArrowPathIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface InvestmentPanelProps {
  data: InvestmentPanelType;
  onRefresh: () => void;
  loading: boolean;
}

type TabType = 'news' | 'filings' | 'ir' | 'risks';

export const InvestmentPanel: React.FC<InvestmentPanelProps> = ({ 
  data, 
  onRefresh, 
  loading 
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('news');

  const tabs = [
    { 
      id: 'news' as TabType, 
      label: 'Latest News', 
      icon: NewspaperIcon, 
      count: data.latestNews.length,
      color: 'text-blue-600'
    },
    { 
      id: 'filings' as TabType, 
      label: 'SEC Filings', 
      icon: DocumentTextIcon, 
      count: data.filings.length,
      color: 'text-green-600'
    },
    { 
      id: 'ir' as TabType, 
      label: 'Investor Relations', 
      icon: BuildingOfficeIcon, 
      count: data.investorRelations.length,
      color: 'text-purple-600'
    },
    { 
      id: 'risks' as TabType, 
      label: 'Risk Signals', 
      icon: ExclamationTriangleIcon, 
      count: data.riskSignals.length,
      color: 'text-red-600'
    },
  ];

  const formatLastUpdated = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRiskLevel = (title: string, snippet?: string): 'low' | 'medium' | 'high' => {
    const text = (title + ' ' + (snippet || '')).toLowerCase();
    
    if (text.includes('lawsuit') || text.includes('investigation') || text.includes('probe')) {
      return 'high';
    }
    if (text.includes('downgrade') || text.includes('recall') || text.includes('warning')) {
      return 'medium';
    }
    return 'low';
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'news':
        return (
          <div className="space-y-4">
            {data.latestNews.length > 0 ? (
              data.latestNews.map((result, index) => (
                <ResultCard key={index} result={result} showSource={true} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <NewspaperIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No recent news found</p>
              </div>
            )}
          </div>
        );
      
      case 'filings':
        return (
          <div className="space-y-4">
            {data.filings.length > 0 ? (
              data.filings.map((result, index) => (
                <ResultCard key={index} result={result} showSource={false} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <DocumentTextIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No SEC filings found</p>
              </div>
            )}
          </div>
        );
      
      case 'ir':
        return (
          <div className="space-y-4">
            {data.investorRelations.length > 0 ? (
              data.investorRelations.map((result, index) => (
                <ResultCard key={index} result={result} showSource={false} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BuildingOfficeIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No investor relations content found</p>
              </div>
            )}
          </div>
        );
      
      case 'risks':
        return (
          <div className="space-y-4">
            {data.riskSignals.length > 0 ? (
              data.riskSignals.map((result, index) => (
                <ResultCard 
                  key={index} 
                  result={result} 
                  showSource={true}
                  riskLevel={getRiskLevel(result.title, result.snippet)}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ExclamationTriangleIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No risk signals detected</p>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="card">
      {/* Stock Overview Section */}
      {data.stockOverview && (
        <div className="mb-8 -m-6">
          <StockOverview 
            data={data.stockOverview} 
            ticker={data.ticker}
            company={data.company}
          />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {data.company} ({data.ticker})
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
            <CalendarIcon className="h-4 w-4" />
            <span>Last updated: {formatLastUpdated(data.lastUpdated)}</span>
          </div>
        </div>
        
        <button
          onClick={onRefresh}
          disabled={loading}
          className="btn-secondary disabled:opacity-50 flex items-center gap-2"
        >
          <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors
                  ${isActive 
                    ? 'border-primary-500 text-primary-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className={`h-4 w-4 ${isActive ? tab.color : ''}`} />
                {tab.label}
                {tab.count > 0 && (
                  <span className={`
                    inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full
                    ${isActive ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-600'}
                  `}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <ArrowPathIcon className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-3" />
              <p className="text-gray-600">Loading investment insights...</p>
            </div>
          </div>
        ) : (
          renderTabContent()
        )}
      </div>
    </div>
  );
};