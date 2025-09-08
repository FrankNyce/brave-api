import React from 'react';
import { StockOverview as StockOverviewType } from '../types/investment';
import { 
  TrendingUpIcon, 
  TrendingDownIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface StockOverviewProps {
  data: StockOverviewType;
  ticker: string;
  company: string;
}

export const StockOverview: React.FC<StockOverviewProps> = ({ data, ticker, company }) => {
  const isPositive = data.priceChange >= 0;
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatLargeNumber = (num: string) => {
    return num;
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Strong Buy': return 'text-green-700 bg-green-100';
      case 'Buy': return 'text-green-600 bg-green-50';
      case 'Hold': return 'text-yellow-600 bg-yellow-50';
      case 'Sell': return 'text-red-600 bg-red-50';
      case 'Strong Sell': return 'text-red-700 bg-red-100';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getRatingArc = (score: number) => {
    // Convert score (0-100) to rotation angle (-90 to 90 degrees)
    const angle = (score - 50) * 1.8;
    return `rotate(${angle}deg)`;
  };

  return (
    <div className="card mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stock Price Section */}
        <div className="lg:col-span-1">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-2xl font-bold text-gray-900">{formatPrice(data.currentPrice)}</h3>
              <span className="text-sm text-gray-500">USD</span>
              <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? (
                  <TrendingUpIcon className="h-4 w-4" />
                ) : (
                  <TrendingDownIcon className="h-4 w-4" />
                )}
                <span className="font-medium">
                  {isPositive ? '+' : ''}{data.priceChange.toFixed(2)} ({isPositive ? '+' : ''}{data.priceChangePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <ClockIcon className="h-4 w-4" />
              <span>{data.lastUpdated} • {data.marketStatus}</span>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Open</span>
              <div className="font-medium">{formatPrice(data.currentPrice - data.priceChange)}</div>
            </div>
            <div>
              <span className="text-gray-500">Volume</span>
              <div className="font-medium">{formatLargeNumber(data.volume)}</div>
            </div>
            <div>
              <span className="text-gray-500">High</span>
              <div className="font-medium">{formatPrice(data.dayHigh)}</div>
            </div>
            <div>
              <span className="text-gray-500">Avg Vol</span>
              <div className="font-medium">3.59M</div>
            </div>
            <div>
              <span className="text-gray-500">Low</span>
              <div className="font-medium">{formatPrice(data.dayLow)}</div>
            </div>
            <div>
              <span className="text-gray-500">52wk High</span>
              <div className="font-medium">{formatPrice(data.dayHigh * 1.15)}</div>
            </div>
            <div>
              <span className="text-gray-500">Mkt Cap</span>
              <div className="font-medium">{formatLargeNumber(data.marketCap)}</div>
            </div>
            <div>
              <span className="text-gray-500">52wk Low</span>
              <div className="font-medium">{formatPrice(data.dayLow * 0.85)}</div>
            </div>
          </div>
        </div>

        {/* Analyst Rating & PE Ratio */}
        <div className="lg:col-span-1 space-y-6">
          {/* Analyst Rating */}
          <div className="text-center">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Analyst rating</h4>
            <div className="relative w-32 h-16 mx-auto mb-3">
              {/* Rating Arc Background */}
              <div className="absolute inset-0">
                <svg viewBox="0 0 100 50" className="w-full h-full">
                  <path
                    d="M 10 40 A 30 30 0 0 1 90 40"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 10 40 A 30 30 0 0 1 50 10"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 50 10 A 30 30 0 0 1 90 40"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              {/* Rating Needle */}
              <div 
                className="absolute top-1/2 left-1/2 w-0.5 h-8 bg-gray-800 origin-bottom transform -translate-x-1/2 -translate-y-full"
                style={{ transform: `translate(-50%, -100%) ${getRatingArc(data.analystRating.score)}` }}
              />
            </div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRatingColor(data.analystRating.rating)}`}>
              {data.analystRating.rating}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Based on {data.analystRating.analystCount} analysts
            </p>
          </div>

          {/* PE Ratio Comparison */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">PE ratio</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">PSTG</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 rounded">
                    <div className="w-3/4 h-full bg-blue-500 rounded"></div>
                  </div>
                  <span className="text-xs font-medium">{data.peRatio}x</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">DELL</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 rounded">
                    <div className="w-1/4 h-full bg-gray-400 rounded"></div>
                  </div>
                  <span className="text-xs font-medium">17.7x</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">HPE</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 rounded">
                    <div className="w-1/2 h-full bg-gray-400 rounded"></div>
                  </div>
                  <span className="text-xs font-medium">27.9x</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">IBM</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 rounded">
                    <div className="w-full h-full bg-gray-400 rounded"></div>
                  </div>
                  <span className="text-xs font-medium">40.5x</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Stocks */}
        <div className="lg:col-span-1">
          <h4 className="text-sm font-medium text-gray-700 mb-4">Related stocks</h4>
          <div className="space-y-3">
            {data.relatedStocks.map((stock, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <div>
                  <div className="font-medium text-gray-900">{stock.company}</div>
                  <div className="text-sm text-gray-500">{stock.ticker}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">{formatPrice(stock.price)}</div>
                  <div className={`text-sm flex items-center gap-1 ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stock.change >= 0 ? (
                      <TrendingUpIcon className="h-3 w-3" />
                    ) : (
                      <TrendingDownIcon className="h-3 w-3" />
                    )}
                    <span>{stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Suggested Questions */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <button className="text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-700">
            What are {company}'s growth prospects?
          </button>
          <button className="text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-700">
            What recent news affects {ticker} stock?
          </button>
          <button className="text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-700">
            What are {company}'s future projections?
          </button>
          <button className="text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-700">
            Historical Performance of {ticker}
          </button>
        </div>
      </div>
    </div>
  );
};