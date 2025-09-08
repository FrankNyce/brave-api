import { useState } from 'react';
import { SearchInput } from './components/SearchInput';
import { InvestmentPanel } from './components/InvestmentPanel';
import { buildInvestmentPanel } from './services/braveApi';
import { InvestmentPanel as InvestmentPanelType } from './types/investment';
import { ChartBarIcon } from '@heroicons/react/24/outline';

function App() {
  const [panelData, setPanelData] = useState<InvestmentPanelType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (ticker: string, company: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await buildInvestmentPanel(ticker, company);
      setPanelData(data);
    } catch (err) {
      setError('Failed to fetch investment data. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (panelData) {
      await handleSearch(panelData.ticker, panelData.company);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Investment Insights Panel
              </h1>
              <p className="text-sm text-gray-600">
                Powered by Brave Search API
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchInput onSearch={handleSearch} loading={loading} />
        
        {error && (
          <div className="card mb-8 border-red-200 bg-red-50">
            <div className="flex items-center gap-2 text-red-800">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}
        
        {panelData && (
          <InvestmentPanel 
            data={panelData} 
            onRefresh={handleRefresh}
            loading={loading}
          />
        )}
        
        {!panelData && !loading && (
          <div className="text-center py-12">
            <ChartBarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Ready to Research
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Enter a stock ticker and company name above to get comprehensive investment insights including latest news, SEC filings, investor relations content, and risk signals.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>
              This demo shows how to build search-enabled financial tools using the{' '}
              <a 
                href="https://brave.com/search/api/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Brave Search API
              </a>
            </p>
            <p className="mt-1">
              In production, API calls should be proxied through your backend to keep API keys secure.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;