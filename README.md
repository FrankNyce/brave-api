# Investment Insights Panel

A comprehensive React application demonstrating how to build search-enabled financial tools using the **Brave Search API**. This example shows how to create an investment research dashboard that pulls timely news, SEC filings, investor relations content, and risk signals for any publicly traded company.

## Features

- **Latest Company News**: Real-time news from Bloomberg, CNBC, Reuters, and other financial sources
- **SEC Filings**: Direct links to 10-K, 10-Q, 8-K, and other regulatory documents
- **Investor Relations**: Press releases and official company communications
- **Risk Signals**: Automated detection of lawsuits, recalls, downgrades, and investigations
- **Clean Dashboard**: Tabbed interface with search, filtering, and refresh capabilities
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Architecture

### API Integration
- Uses Brave Search API's `/news/search` and `/web/search` endpoints
- Implements smart query templates for different content types
- Includes retry logic and error handling
- Deduplicates results by URL and title

### Query Templates
- **News**: `"{company} stock OR {ticker} site:bloomberg.com OR site:cnbc.com OR site:reuters.com"`
- **SEC Filings**: `"site:sec.gov {company} 10-K OR 10-Q OR 8-K"`
- **Investor Relations**: `"site:{domain} investor relations OR press releases"`
- **Risk Signals**: `"{company} (lawsuit OR recall OR probe OR downgrade) -forum -reddit"`

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Brave Search API key (get one at [brave.com/search/api](https://brave.com/search/api/))

### Installation

1. Clone and install dependencies:
```bash
npm install
```

2. Set up your API key:
```bash
cp .env.example .env
# Edit .env and add your Brave API key
```

3. Start the development server:
```bash
npm run dev
```

## Usage

1. **Search**: Enter a stock ticker (e.g., "AAPL") and company name (e.g., "Apple Inc.")
2. **Browse Results**: Use the tabs to explore different types of content
3. **External Links**: Click any result to open the source in a new tab
4. **Refresh**: Update data with the refresh button
5. **Quick Examples**: Use the preset buttons for popular stocks

## API Security Note

⚠️ **Important**: This demo includes API keys in the frontend for demonstration purposes only. In production applications:

- **Never expose API keys in frontend code**
- **Proxy all API calls through your backend**
- **Implement proper authentication and rate limiting**
- **Use environment variables on your server**

## Example Backend Proxy (Node.js/Express)

```javascript
app.get('/api/search/news', async (req, res) => {
  const { q, count = 10 } = req.query;
  
  try {
    const response = await fetch(`https://api.search.brave.com/res/v1/news/search?q=${q}&count=${count}`, {
      headers: {
        'Accept': 'application/json',
        'X-Subscription-Token': process.env.BRAVE_API_KEY
      }
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});
```

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Icons**: Heroicons
- **Build Tool**: Vite
- **API**: Brave Search API (News & Web Search endpoints)

## Customization

### Adding New Content Types
1. Create new query templates in `src/services/braveApi.ts`
2. Add corresponding UI components
3. Update the tab system in `InvestmentPanel.tsx`

### Styling
- Modify `tailwind.config.js` for theme customization
- Update component styles in individual `.tsx` files
- Add custom CSS in `src/index.css`

### Data Processing
- Enhance deduplication logic in `buildInvestmentPanel()`
- Add content filtering and ranking
- Implement caching for better performance

## Deployment

### Frontend Only (with Backend Proxy)
```bash
npm run build
# Deploy dist/ folder to your hosting provider
```

### Full-Stack Deployment
1. Set up a backend API (Node.js, Python, etc.)
2. Implement API proxying with proper security
3. Deploy both frontend and backend
4. Configure environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Resources

- [Brave Search API Documentation](https://brave.com/search/api/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)