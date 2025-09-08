import { StockOverview } from '../types/investment';

// Alpha Vantage API for real-time stock data
const ALPHA_VANTAGE_BASE = 'https://www.alphavantage.co/query';
const POLYGON_BASE = 'https://api.polygon.io/v2';
const FMP_BASE = 'https://financialmodelingprep.com/api/v3';

interface AlphaVantageQuote {
  'Global Quote': {
    '01. symbol': string;
    '05. price': string;
    '09. change': string;
    '10. change percent': string;
    '03. high': string;
    '04. low': string;
    '06. volume': string;
    '07. latest trading day': string;
  };
}

interface PolygonQuote {
  results: {
    c: number; // close
    h: number; // high
    l: number; // low
    o: number; // open
    v: number; // volume
    T: string; // ticker
  }[];
}

interface FMPProfile {
  symbol: string;
  price: number;
  beta: number;
  volAvg: number;
  mktCap: number;
  lastDiv: number;
  range: string;
  changes: number;
  companyName: string;
  currency: string;
  cik: string;
  isin: string;
  cusip: string;
  exchange: string;
  exchangeShortName: string;
  industry: string;
  website: string;
  description: string;
  ceo: string;
  sector: string;
  country: string;
  fullTimeEmployees: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  dcfDiff: number;
  dcf: number;
  image: string;
  ipoDate: string;
  defaultImage: boolean;
  isEtf: boolean;
  isActivelyTrading: boolean;
  isAdr: boolean;
  isFund: boolean;
}

export async function getStockQuote(ticker: string): Promise<StockOverview | null> {
  const alphaVantageKey = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
  const polygonKey = import.meta.env.VITE_POLYGON_API_KEY;

  // Try Alpha Vantage first (most reliable for basic quotes)
  if (alphaVantageKey && alphaVantageKey !== 'your_alpha_vantage_key_here') {
    try {
      const response = await fetch(
        `${ALPHA_VANTAGE_BASE}?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${alphaVantageKey}`
      );
      const data: AlphaVantageQuote = await response.json();
      
      if (data['Global Quote'] && data['Global Quote']['01. symbol']) {
        const quote = data['Global Quote'];
        const price = parseFloat(quote['05. price']);
        const change = parseFloat(quote['09. change']);
        const changePercent = parseFloat(quote['10. change percent'].replace('%', ''));
        
        return {
          currentPrice: price,
          priceChange: change,
          priceChangePercent: changePercent,
          marketStatus: 'Market Closed', // Alpha Vantage doesn't provide market status
          lastUpdated: new Date().toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }) + ' EST',
          dayHigh: parseFloat(quote['03. high']),
          dayLow: parseFloat(quote['04. low']),
          volume: formatVolume(parseInt(quote['06. volume'])),
          marketCap: 'N/A', // Would need additional API call
          peRatio: 0, // Would need additional API call
          analystRating: {
            rating: 'Hold',
            score: 50,
            analystCount: 0
          },
          relatedStocks: []
        };
      }
    } catch (error) {
      console.log('Alpha Vantage API error:', error);
    }
  }

  // Try Polygon.io as fallback
  if (polygonKey && polygonKey !== 'your_polygon_key_here') {
    try {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const dateStr = yesterday.toISOString().split('T')[0];
      
      const response = await fetch(
        `${POLYGON_BASE}/aggs/ticker/${ticker}/range/1/day/${dateStr}/${dateStr}?adjusted=true&sort=asc&limit=1&apikey=${polygonKey}`
      );
      const data: PolygonQuote = await response.json();
      
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        const change = result.c - result.o;
        const changePercent = (change / result.o) * 100;
        
        return {
          currentPrice: result.c,
          priceChange: change,
          priceChangePercent: changePercent,
          marketStatus: 'Market Closed',
          lastUpdated: new Date().toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }) + ' EST',
          dayHigh: result.h,
          dayLow: result.l,
          volume: formatVolume(result.v),
          marketCap: 'N/A',
          peRatio: 0,
          analystRating: {
            rating: 'Hold',
            score: 50,
            analystCount: 0
          },
          relatedStocks: []
        };
      }
    } catch (error) {
      console.log('Polygon API error:', error);
    }
  }

  // Try Financial Modeling Prep as another fallback
  if (fmpKey && fmpKey !== 'your_fmp_key_here') {
    try {
      const response = await fetch(
        `${FMP_BASE}/profile/${ticker}?apikey=${fmpKey}`
      );
      const data: FMPProfile[] = await response.json();
      
      if (data && data.length > 0) {
        const profile = data[0];
        
        return {
          currentPrice: profile.price,
          priceChange: profile.changes,
          priceChangePercent: (profile.changes / profile.price) * 100,
          marketStatus: profile.isActivelyTrading ? 'Market Open' : 'Market Closed',
          lastUpdated: new Date().toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }) + ' EST',
          dayHigh: profile.price * 1.02, // Approximate
          dayLow: profile.price * 0.98, // Approximate
          volume: formatVolume(profile.volAvg),
          marketCap: formatMarketCap(profile.mktCap),
          peRatio: 0, // Would need additional API call
          analystRating: {
            rating: 'Hold',
            score: 50,
            analystCount: 0
          },
          relatedStocks: []
        };
      }
    } catch (error) {
      console.log('FMP API error:', error);
    }
  }

  return null; // Return null if no API keys are configured or all fail
}

export async function getMarketStatus(): Promise<string> {
  // Simple market hours check (NYSE/NASDAQ)
  const now = new Date();
  const easternTime = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
  const hour = easternTime.getHours();
  const day = easternTime.getDay();
  
  // Weekend
  if (day === 0 || day === 6) {
    return 'Market Closed';
  }
  
  // Market hours: 9:30 AM - 4:00 PM ET
  if (hour >= 9 && hour < 16) {
    if (hour === 9 && easternTime.getMinutes() < 30) {
      return 'Pre-Market';
    }
    return 'Market Open';
  } else if (hour >= 4 && hour < 20) {
    return 'After Hours';
  } else {
    return 'Market Closed';
  }
}

function formatVolume(volume: number): string {
  if (volume >= 1000000000) {
    return (volume / 1000000000).toFixed(2) + 'B';
  } else if (volume >= 1000000) {
    return (volume / 1000000).toFixed(2) + 'M';
  } else if (volume >= 1000) {
    return (volume / 1000).toFixed(2) + 'K';
  }
  return volume.toString();
}

function formatMarketCap(marketCap: number): string {
  if (marketCap >= 1000000000000) {
    return (marketCap / 1000000000000).toFixed(2) + 'T';
  } else if (marketCap >= 1000000000) {
    return (marketCap / 1000000000).toFixed(2) + 'B';
  } else if (marketCap >= 1000000) {
    return (marketCap / 1000000).toFixed(2) + 'M';
  }
  return marketCap.toString();
}

// Get related stocks based on sector/industry
export async function getRelatedStocks(ticker: string): Promise<any[]> {
  // This would require additional API calls to get sector information
  // and then find related stocks in the same sector
  return [];
}

// Get analyst ratings (requires premium APIs)
export async function getAnalystRatings(ticker: string): Promise<any> {
  // This typically requires premium financial data APIs
  return {
    rating: 'Hold',
    score: 50,
    analystCount: 0
  };
}