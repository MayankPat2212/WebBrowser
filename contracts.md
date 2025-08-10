# CyberSearch API Contracts & Backend Implementation Plan

## 1. API Contracts

### Search Endpoint
```
POST /api/search
Content-Type: application/json

Request Body:
{
  "query": "string",
  "safe_search": "moderate" | "strict" | "off" (optional, default: "moderate")
}

Response:
{
  "query": "string",
  "results": [
    {
      "title": "string",
      "url": "string", 
      "snippet": "string",
      "tags": ["string"] (optional)
    }
  ],
  "total_results": "number",
  "search_time": "string",
  "privacy_protected": true
}
```

### Health Check Endpoint (already exists)
```
GET /api/
Response: {"message": "Hello World"}
```

## 2. Mock Data to Replace

### Current Mock Location: `/app/frontend/src/data/mockSearchResults.js`

**Mock Data Structure:**
- 12 pre-defined cybersecurity-related search results
- Static titles, URLs, snippets, and tags
- No real-time search capability

**Data to Replace:**
- `mockSearchResults` array will be replaced with real DuckDuckGo API responses
- Search results will be dynamic based on user queries
- Real URLs and snippets from DuckDuckGo

## 3. Backend Implementation Requirements

### DuckDuckGo Integration
- **API Endpoint**: `https://api.duckduckgo.com/`
- **Parameters**:
  - `q`: search query
  - `format`: "json"
  - `no_redirect`: "1"
  - `no_html`: "1" 
  - `skip_disambig`: "1"
  - `safe_search`: "1" (for privacy)

### Backend Components to Implement:
1. **Search Service** (`/app/backend/services/search_service.py`)
   - DuckDuckGo API client integration
   - Query sanitization and validation
   - Response parsing and formatting
   - Error handling for API failures

2. **Search Router** (`/app/backend/routers/search_router.py`)
   - POST `/api/search` endpoint
   - Request validation using Pydantic models
   - Privacy-focused response headers
   - Rate limiting considerations

3. **Models** (`/app/backend/models/search_models.py`)
   - SearchRequest model
   - SearchResult model
   - SearchResponse model

### Privacy & Security Features:
- No query logging to database
- No user tracking or session storage
- Request anonymization
- Secure headers for privacy protection
- CORS configured for frontend-only access

## 4. Frontend & Backend Integration

### Frontend Changes Required:

1. **Replace Mock API Call** in `/app/frontend/src/components/SearchEngine.jsx`:
   ```javascript
   // REPLACE THIS:
   const filteredResults = mockSearchResults.filter(...)
   
   // WITH THIS:
   const response = await axios.post(`${API}/search`, {
     query: query.trim()
   });
   const results = response.data.results;
   ```

2. **Update Import Statements**:
   ```javascript
   // REMOVE:
   import { mockSearchResults } from "../data/mockSearchResults";
   
   // ADD:
   import axios from "axios";
   const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
   ```

3. **Error Handling**:
   - Handle API errors gracefully
   - Show privacy-focused error messages
   - Fallback behavior for failed searches

### Backend Dependencies to Add:
- `httpx` or `requests`: HTTP client for DuckDuckGo API
- `python-multipart`: For form data handling
- Enhanced error handling middleware

## 5. Implementation Steps:

1. ✅ **Frontend Complete**: Boot sequence + Search UI with mock data
2. 🔄 **Backend Development**:
   - Install HTTP client dependencies
   - Create search models and services
   - Implement DuckDuckGo API integration
   - Add search router with privacy features
3. 🔄 **Frontend Integration**:
   - Replace mock data with real API calls
   - Add proper error handling
   - Test end-to-end functionality
4. 🔄 **Testing & Validation**:
   - Test various search queries
   - Verify privacy features
   - Performance optimization

## 6. Privacy Compliance Notes:
- No search queries stored in database
- No user identification or tracking
- Anonymous API requests to DuckDuckGo
- Privacy headers in all responses
- No analytics or logging of user behavior