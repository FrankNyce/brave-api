import { SearchResult, BraveNewsResponse, BraveWebResponse } from '../types/investment';
import { getStockQuote, getMarketStatus } from './financialApi';

// Backend API base URL
const BACKEND_API = "http://localhost:3001";

export async function braveNews(query: string, count = 10): Promise<SearchResult[]> {
  try {
    const response = await fetch(`${BACKEND_API}/api/search/news?q=${encodeURIComponent(query)}&count=${count}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data: BraveNewsResponse = await response.json();
    
    if (!data.results || data.results.length === 0) {
      console.log('No news results found for query:', query);
      return [];
    }

    return data.results.map(item => ({
      title: item.title,
      url: item.url,
      snippet: item.description,
      source: item.source?.name,
      published: item.age || item.published,
      favicon: `https://www.google.com/s2/favicons?domain=${new URL(item.url).hostname}&sz=16`
    }));

  } catch (error) {
    console.error('Brave News API error:', error);
    throw new Error(`Failed to fetch news: ${error.message}`);
  }
}

export async function braveWeb(query: string, count = 10): Promise<SearchResult[]> {
  try {
    const response = await fetch(`${BACKEND_API}/api/search/web?q=${encodeURIComponent(query)}&count=${count}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data: BraveWebResponse = await response.json();
    
    if (!data.web?.results || data.web.results.length === 0) {
      console.log('No web results found for query:', query);
      return [];
    }

    return data.web.results.map(item => ({
      title: item.title,
      url: item.url,
      snippet: item.description,
      favicon: item.meta_url?.favicon || `https://www.google.com/s2/favicons?domain=${new URL(item.url).hostname}&sz=16`
    }));

  } catch (error) {
    console.error('Brave Web API error:', error);
    throw new Error(`Failed to fetch web results: ${error.message}`);
  }
}

export async function buildInvestmentPanel(
  ticker: string, 
  company: string, 
  irDomain?: string
) {
  console.log('Building investment panel for:', ticker, company);
  
  // Get stock data
  const stockOverview = await getStockQuote(ticker);
  
  // If no real stock data available, generate mock data for demo
  let finalStockOverview = stockOverview;
  if (!stockOverview) {
    const basePrice = 50 + Math.random() * 200;
    const change = (Math.random() - 0.5) * 10;
    const changePercent = (change / basePrice) * 100;
    
    finalStockOverview = {
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

  try {
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
      stockOverview: finalStockOverview,
      latestNews: dedupe(latestNews),
      filings: dedupe(filings),
      investorRelations: dedupe(investorRelations),
      riskSignals: dedupe(riskSignals),
    };

  } catch (error) {
    console.error('Error building investment panel:', error);
    throw new Error(`Failed to fetch investment data: ${error.message}`);
  }
}