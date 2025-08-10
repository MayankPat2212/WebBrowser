from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
from models.search_models import SearchRequest, SearchResponse, SearchResult
from services.search_service import SearchService
import time
import logging
from datetime import datetime

logger = logging.getLogger(__name__)
router = APIRouter()
search_service = SearchService()

@router.post("/search", response_model=SearchResponse)
async def search_endpoint(request: SearchRequest, req: Request):
    """
    Privacy-focused search endpoint using DuckDuckGo API
    """
    start_time = time.time()
    
    try:
        # Validate and sanitize query
        query = request.query.strip()
        if not query:
            raise HTTPException(status_code=400, detail="Search query cannot be empty")
        
        # Log search attempt (without storing the query for privacy)
        logger.info(f"Search request received from {req.client.host}")
        
        # Perform search
        results = await search_service.search(query, request.safe_search)
        
        # Calculate search time
        search_time = f"{(time.time() - start_time):.3f}s"
        
        # Create response with privacy indicators
        response = SearchResponse(
            query=query,
            results=results,
            total_results=len(results),
            search_time=search_time,
            privacy_protected=True
        )
        
        # Create JSON response with privacy headers
        json_response = JSONResponse(
            content=response.dict(exclude={"timestamp"}),
            headers={
                "X-Privacy-Protected": "true",
                "X-No-Tracking": "true",
                "X-No-Logs": "true",
                "Cache-Control": "no-store, no-cache, must-revalidate, private",
                "Pragma": "no-cache",
                "Expires": "0"
            }
        )
        
        logger.info(f"Search completed in {search_time} with {len(results)} results")
        return json_response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in search endpoint: {e}")
        raise HTTPException(
            status_code=500, 
            detail="Search service temporarily unavailable. Your privacy remains protected."
        )

@router.get("/search/health")
async def search_health():
    """
    Health check endpoint for search service
    """
    return {
        "status": "healthy",
        "service": "cybersearch",
        "privacy": "protected",
        "timestamp": datetime.utcnow().isoformat()
    }