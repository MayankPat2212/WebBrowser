import asyncio
import logging
from typing import List, Dict, Any
from models.search_models import SearchResult
from duckduckgo_search import DDGS

logger = logging.getLogger(__name__)

class SearchService:
    def __init__(self):
        self.timeout = 10.0
        
    async def search(self, query: str, safe_search: str = "moderate") -> List[SearchResult]:
        """
        Search using DuckDuckGo with privacy protection
        """
        try:
            # Run the synchronous search in a thread pool to avoid blocking
            results = await asyncio.get_event_loop().run_in_executor(
                None, self._perform_search, query, safe_search
            )
            return results
                
        except Exception as e:
            logger.error(f"Error while searching for: {query}, Error: {e}")
            return await self._get_fallback_results(query)
    
    def _perform_search(self, query: str, safe_search: str) -> List[SearchResult]:
        """
        Perform synchronous search using DuckDuckGo
        """
        results = []
        
        try:
            # Configure safe search
            safesearch = "moderate"
            if safe_search == "strict":
                safesearch = "strict"
            elif safe_search == "off":
                safesearch = "off"
            
            with DDGS() as ddgs:
                # Get search results (limit to 10)
                search_results = ddgs.text(
                    query, 
                    max_results=10, 
                    safesearch=safesearch,
                    region='us-en'
                )
                
                for result in search_results:
                    # Extract tags from the title and body for cybersecurity relevance
                    tags = self._extract_tags(result.get('title', ''), result.get('body', ''))
                    
                    results.append(SearchResult(
                        title=result.get('title', 'No title'),
                        url=result.get('href', ''),
                        snippet=result.get('body', 'No description available'),
                        tags=tags if tags else None
                    ))
            
            return results
            
        except Exception as e:
            logger.error(f"DuckDuckGo search error: {e}")
            return []
    
    def _extract_tags(self, title: str, body: str) -> List[str]:
        """
        Extract relevant tags based on content for cybersecurity theme
        """
        text = f"{title} {body}".lower()
        tags = []
        
        security_keywords = {
            'cybersecurity': 'cybersecurity',
            'security': 'security', 
            'privacy': 'privacy',
            'encryption': 'encryption',
            'hacking': 'hacking',
            'malware': 'malware',
            'firewall': 'firewall',
            'phishing': 'phishing',
            'vulnerability': 'vulnerability',
            'penetration testing': 'penetration testing',
            'nist': 'nist',
            'owasp': 'owasp',
            'compliance': 'compliance',
            'authentication': 'authentication',
            'authorization': 'authorization',
            'incident response': 'incident response',
            'threat': 'threat',
            'risk': 'risk',
            'audit': 'audit',
            'forensics': 'forensics'
        }
        
        for keyword, tag in security_keywords.items():
            if keyword in text:
                tags.append(tag)
        
        # Limit to 4 most relevant tags
        return tags[:4]
    
    async def _get_fallback_results(self, query: str) -> List[SearchResult]:
        """
        Provide fallback cybersecurity-related results when search fails
        """
        fallback_results = [
            SearchResult(
                title="Cybersecurity Best Practices - NIST Framework",
                url="https://nist.gov/cybersecurity-framework",
                snippet=f"Search for '{query}' - The NIST Cybersecurity Framework helps organizations manage cybersecurity risks through proven practices.",
                tags=["cybersecurity", "nist", "framework"]
            ),
            SearchResult(
                title="OWASP Security Guidelines",
                url="https://owasp.org/",
                snippet=f"Related to '{query}' - OWASP provides security guidance and tools for web applications and APIs.",
                tags=["owasp", "security", "web"]
            ),
            SearchResult(
                title="Privacy Tools and Resources",
                url="https://privacytools.io/",
                snippet=f"Privacy information for '{query}' - Tools and knowledge to protect your privacy online and maintain anonymity.",
                tags=["privacy", "tools", "security"]
            ),
            SearchResult(
                title="Kali Linux Documentation",
                url="https://kali.org/docs/",
                snippet=f"Security tools for '{query}' - Kali Linux penetration testing and security auditing platform documentation.",
                tags=["kali", "penetration testing", "security"]
            )
        ]
        
        return fallback_results[:4]