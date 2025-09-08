import { SearchResult, BraveNewsResponse, BraveWebResponse } from '../types/investment';
import { getStockQuote, getMarketStatus } from './financialApi';

const BRAVE_API = "https://api.search.brave.com/res/v1";

// Note: In a real application, you would handle API keys securely
// This is a demo showing the structure - you'd typically proxy through your backend
const headers = {
  "Accept": "application/json",
  "X-Subscription-Token": import.meta.env.VITE_BRAVE_API_KEY || "demo-key",
};

export async function braveNews(query: string, count = 10): Promise<SearchResult[]> {
  // Note: Direct API calls to Brave Search are blocked by CORS in browsers
  // In a production environment, you would need a backend proxy server
  console.log('Using mock news data due to CORS limitations in browser environment');
  console.log('News query:', query);
  return getMockNewsData(query);
}

export async function braveWeb(query: string, count = 10): Promise<SearchResult[]> {
  // Note: Direct API calls to Brave Search are blocked by CORS in browsers
  // In a production environment, you would need a backend proxy server
  console.log('Using mock web data due to CORS limitations in browser environment');
  console.log('Web search query:', query);
  return getMockWebData(query);
}

// Mock data for demo purposes when API is not available
function getMockNewsData(query: string): SearchResult[] {
  const ticker = query.includes('AAPL') ? 'AAPL' : 'STOCK';
  return [
    {
      title: `${ticker} Reports Strong Q4 Earnings, Beats Expectations`,
      url: "https://www.bloomberg.com/news/articles/2024/01/15/earnings-beat",
      snippet: "The company reported revenue of $119.6 billion, surpassing analyst estimates...",
      source: "Bloomberg",
      published: "2 hours ago"
    },
    {
      title: `${ticker} Stock Rises on New Product Launch Announcement`,
      url: "https://www.cnbc.com/2024/01/15/product-launch.html",
      snippet: "Shares jumped 3% in after-hours trading following the announcement...",
      source: "CNBC",
      published: "4 hours ago"
    },
    {
      title: `Analysts Upgrade ${ticker} Price Target Following Strong Performance`,
      url: "https://www.reuters.com/business/analyst-upgrade",
      snippet: "Multiple analysts raised their price targets citing strong fundamentals...",
      source: "Reuters",
      published: "1 day ago"
    }
  ];
}

function getMockWebData(query: string): SearchResult[] {
  if (query.includes('sec.gov')) {
    return [
      {
        title: "Form 10-K Annual Report - Latest Filing",
        url: "https://www.sec.gov/Archives/edgar/data/320193/000032019324000007/aapl-20230930.htm",
        snippet: "Annual report pursuant to Section 13 or 15(d) of the Securities Exchange Act of 1934...",
      },
      {
        title: "Form 10-Q Quarterly Report - Q1 2024",
        url: "https://www.sec.gov/Archives/edgar/data/320193/000032019324000004/aapl-20231230.htm",
        snippet: "Quarterly report pursuant to Section 13 or 15(d) of the Securities Exchange Act...",
      }
    ];
  }
  
  if (query.includes('investor relations')) {
    return [
      {
        title: "Investor Relations - Press Releases",
        url: "https://investor.apple.com/news-and-events/press-releases/",
        snippet: "Latest press releases and corporate announcements from the company...",
      },
      {
        title: "Quarterly Earnings Call Transcript",
        url: "https://investor.apple.com/news-and-events/earnings/",
        snippet: "Complete transcript and audio from the latest earnings call...",
      }
    ];
  }
  
  return [
    {
      title: "Risk Assessment: Regulatory Challenges Ahead",
      url: "https://example.com/risk-analysis",
      snippet: "Analysis of potential regulatory risks facing the company...",
    }
  ];
}

export async function buildInvestmentPanel(
  ticker: string, 
  company: string, 
  irDomain?: string
) {
  console.log('Building investment panel for:', ticker, company);
  
  // Try to get real stock data first, fallback to mock data
  let stockOverview = await getStockQuote(ticker);
  
  // If no real data available, generate mock data
  if (!stockOverview) {
    const basePrice = 50 + Math.random() * 200;
    const change = (Math.random() - 0.5) * 10;
    const changePercent = (change / basePrice) * 100;
    
    stockOverview = {
      currentPrice: basePrice,
      priceChange: change,
      priceChangePercent: changePercent,
      marketStatus: await getMarketStatus(),
      lastUpdated: new Date().toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }) + ' EST',
      dayHigh: basePrice + Math.random() * 5,
      dayLow: basePrice - Math.random() * 5,
      volume: (Math.random() * 10 + 1).toFixed(2) + 'M',
      marketCap: (Math.random() * 500 + 50).toFixed(2) + 'B',
      peRatio: Math.random() * 50 + 10,
      analystRating: {
        rating: ['Strong Buy', 'Buy', 'Hold', 'Sell', 'Strong Sell'][Math.floor(Math.random() * 5)] as any,
        score: Math.random() * 100,
        analystCount: Math.floor(Math.random() * 30) + 10
      },
      relatedStocks: [
        {
          ticker: 'DELL',
          company: 'Dell Technologies Inc',
          price: 123.29,
          change: -1.54,
          changePercent: -1.23
        },
        {
          ticker: 'HPE',
          company: 'Hewlett Packard Enterprise',
          price: 23.27,
          change: -0.24,
          changePercent: -1.04
        },
        {
          ticker: 'IBM',
          company: 'International Business Mac...',
          price: 251.81,
          change: 3.28,
          changePercent: 1.32
        },
        {
          ticker: 'NTAP',
          company: 'NetApp Inc',
          price: 119.30,
          change: 0.55,
          changePercent: 0.46
        }
      ]
    };
  }

  // 1) Latest News
  const newsQ = `${company} stock OR ${ticker} site:bloomberg.com OR site:cnbc.com OR site:reuters.com`;
  const latestNews = await braveNews(newsQ, 8);

  // 2) SEC Filings
  const secQ = `site:sec.gov ${company} 10-K OR 10-Q OR 8-K`;
  const filings = await braveWeb(secQ, 6);

  // 3) Investor Relations (primary sources)
  const domain = irDomain || `${company.toLowerCase().replace(/\s+/g, "")}.com`;
  const irQ = `site:${domain} "investor relations" OR "press releases"`;
  const investorRelations = await braveWeb(irQ, 6);

  // 4) Risk Signals
  const riskQ = `${company} (lawsuit OR recall OR probe OR downgrade OR "SEC investigation") -forum -reddit`;
  const riskSignals = await braveWeb(riskQ, 6);

  // Basic dedupe by URL host + title
  const dedupe = (arr: SearchResult[]) => {
    const seen = new Set<string>();
    return arr.filter(item => {
      try {
        const key = (new URL(item.url).host + "|" + (item.title || "")).toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      } catch {
        return true; // Keep items with invalid URLs
      }
    });
  };

  return {
    ticker,
    company,
    lastUpdated: new Date().toISOString(),
    stockOverview,
    latestNews: dedupe(latestNews),
    filings: dedupe(filings),
    investorRelations: dedupe(investorRelations),
    riskSignals: dedupe(riskSignals),
  };
}