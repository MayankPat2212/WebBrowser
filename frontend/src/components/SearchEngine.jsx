import React, { useState, useEffect } from "react";
import { Search, Shield, Lock, Eye, Terminal } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import SearchResults from "./SearchResults";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SearchEngine = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [terminalText, setTerminalText] = useState("");

  const terminalGreeting = "root@cybersearch:~$ Privacy secured. Anonymous search ready.";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < terminalGreeting.length) {
        setTerminalText(terminalGreeting.substring(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);

    return () => clearInterval(timer);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    try {
      // Make real API call to backend
      const response = await axios.post(`${API}/search`, {
        query: query.trim(),
        safe_search: "moderate"
      });

      const searchData = response.data;
      setResults(searchData.results || []);
    } catch (error) {
      console.error("Search error:", error);
      
      // Fallback results on error
      const fallbackResults = [
        {
          title: "Search Service Temporarily Unavailable",
          url: "#",
          snippet: "We're experiencing technical difficulties. Your privacy remains protected. Please try again in a moment.",
          tags: ["system", "privacy"]
        },
        {
          title: "Privacy Protected Search",
          url: "#", 
          snippet: "Even when errors occur, your search queries are not logged or tracked. We prioritize your privacy above all else.",
          tags: ["privacy", "security"]
        }
      ];
      setResults(fallbackResults);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      {/* Header */}
      <div className="border-b border-green-800 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Terminal className="w-8 h-8 text-green-400" />
              <h1 className="text-2xl font-bold text-green-300">CyberSearch</h1>
              <span className="text-green-600 text-sm">v1.0</span>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4 text-green-500" />
                <span className="text-green-300">Privacy: ON</span>
              </div>
              <div className="flex items-center space-x-1">
                <Lock className="w-4 h-4 text-green-500" />
                <span className="text-green-300">Encrypted</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4 text-red-500" />
                <span className="text-green-300">No Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terminal Greeting */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="text-sm text-green-500">
          {terminalText}<span className="animate-pulse">█</span>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-green-300 mb-4">
            Anonymous Web Search
          </h2>
          <p className="text-green-500 text-lg">
            No logs • No tracking • Complete privacy
          </p>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter search query... (privacy protected)"
              className="w-full h-14 text-lg bg-gray-900 border-2 border-green-800 text-green-300 placeholder-green-600 focus:border-green-400 focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 transition-all duration-300"
            />
            <Button
              type="submit"
              disabled={isSearching}
              className="absolute right-2 top-2 h-10 px-6 bg-green-700 hover:bg-green-600 text-black font-semibold border border-green-500 transition-all duration-300"
            >
              {isSearching ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2">⚡</span>
                  Searching...
                </span>
              ) : (
                <span className="flex items-center">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </span>
              )}
            </Button>
          </div>
        </form>

        {/* Privacy Notice */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gray-900 border border-green-800 rounded-lg p-4">
            <p className="text-green-400 text-sm">
              <Shield className="w-4 h-4 inline mr-2" />
              Your search is encrypted and anonymous. We don't store your queries or track your activity.
            </p>
          </div>
        </div>

        {/* Search Results */}
        {hasSearched && (
          <SearchResults 
            results={results} 
            isSearching={isSearching} 
            query={query}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-green-800 bg-gray-900 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
            <div>
              <h3 className="text-green-300 font-semibold mb-3">Privacy First</h3>
              <ul className="space-y-2 text-green-500">
                <li>• No user tracking</li>
                <li>• No data collection</li>
                <li>• Encrypted connections</li>
                <li>• Anonymous search</li>
              </ul>
            </div>
            <div>
              <h3 className="text-green-300 font-semibold mb-3">Features</h3>
              <ul className="space-y-2 text-green-500">
                <li>• Real-time search</li>
                <li>• Secure protocols</li>
                <li>• No ads or tracking</li>
                <li>• Open source friendly</li>
              </ul>
            </div>
            <div>
              <h3 className="text-green-300 font-semibold mb-3">About</h3>
              <p className="text-green-500">
                CyberSearch is a privacy-focused search engine built with security 
                and anonymity at its core. Your privacy is our priority.
              </p>
            </div>
          </div>
          <div className="text-center mt-8 pt-8 border-t border-green-800">
            <p className="text-green-600">
              © 2025 CyberSearch • Built for Privacy • Powered by Open Source
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SearchEngine;