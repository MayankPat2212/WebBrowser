from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=500, description="Search query")
    safe_search: Optional[str] = Field(default="moderate", description="Safe search level: off, moderate, strict")

class SearchResult(BaseModel):
    title: str
    url: str
    snippet: str
    tags: Optional[List[str]] = None

class SearchResponse(BaseModel):
    query: str
    results: List[SearchResult]
    total_results: int
    search_time: str
    privacy_protected: bool = True
    timestamp: datetime = Field(default_factory=datetime.utcnow)