import React from "react";
import { ExternalLink, Clock, Globe } from "lucide-react";

const SearchResults = ({ results, isSearching, query }) => {
  if (isSearching) {
    return (
      <div className="text-center py-12">
        <div className="inline-block">
          <div className="text-green-400 text-lg mb-4">
            <span className="animate-pulse">⚡</span> Scanning secure networks...
          </div>
          <div className="flex justify-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-8 bg-green-600 animate-pulse rounded"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-green-500 text-lg">
          No results found for "{query}". Try different keywords.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-green-800 pb-4">
        <h3 className="text-green-300 text-lg font-semibold">
          Search Results ({results.length} found)
        </h3>
        <div className="text-green-600 text-sm flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          Search completed anonymously
        </div>
      </div>

      {results.map((result, index) => (
        <div
          key={index}
          className="bg-gray-900 border border-green-800 rounded-lg p-4 hover:border-green-600 transition-all duration-300 hover:bg-gray-800"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-300 hover:text-green-200 transition-colors duration-200"
              >
                <h4 className="text-lg font-semibold mb-1 flex items-center">
                  {result.title}
                  <ExternalLink className="w-4 h-4 ml-2 opacity-70" />
                </h4>
              </a>
              <div className="flex items-center text-green-600 text-sm mb-2">
                <Globe className="w-3 h-3 mr-1" />
                {result.url}
              </div>
              <p className="text-green-400 text-sm leading-relaxed">
                {result.snippet}
              </p>
            </div>
          </div>
          
          {result.tags && (
            <div className="flex flex-wrap gap-2 mt-3">
              {result.tags.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="inline-block bg-green-900 text-green-300 text-xs px-2 py-1 rounded border border-green-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className="text-center py-8">
        <div className="inline-block bg-gray-900 border border-green-800 rounded-lg p-4">
          <p className="text-green-500 text-sm">
            End of results • Search performed anonymously • No data logged
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;