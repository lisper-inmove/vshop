"use client";

import { Search } from "lucide-react";
import React, { useRef, useState } from "react";

const Searchbar = () => {
  const words = [
    "毛主席",
    "周总理",
    "周杰轮",
    "周树人周树人周树人周树人周树人周树人周树人周树人周树人周树人周树人",
  ];
  const [activeSearch, setActiveSearch] = useState<string[]>([]);
  const [selectedContent, setSelectedContent] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (content: string) => {
    if (content !== selectedContent) {
      setSelectedContent(content);
    }
    if (content == "") {
      setActiveSearch([]);
      return false;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    const result = words.filter((w) => w.includes(content));
    setActiveSearch(result);
    setIsSearching(true);
  };

  const handleSelect = (content: string) => {
    setSelectedContent(content);
    setActiveSearch([]);
    setIsSearching(false);
  };

  const handleHideSearchContent = () => {
    const timeout = setTimeout(() => {
      setIsSearching(false);
    }, 1000);
    timeoutRef.current = timeout;
  };

  return (
    <form className="w-full px-10 relative">
      <div className="relative">
        <input
          type="search"
          placeholder="查找"
          className="w-full p-4 rounded-full bg-gray-300 dark:bg-slate-800"
          value={selectedContent}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => handleSearch(selectedContent)}
          onBlur={() => handleHideSearchContent()}
        />
        <button className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-gray-200 dark:bg-slate-600 rounded-full">
          <Search />
        </button>
      </div>

      {activeSearch.length > 0 && isSearching && (
        <div className="absolute top-16 p-4 bg-gray-300 dark:bg-slate-800 w-[80%] rounded-xl flex flex-col gap-2">
          {activeSearch.map((s) => (
            <div
              key={s}
              className="flex flex-col items-start text-black/80 dark:text-white/80 hover:text-black/55 hover:dark:text-white/55 w-full h-full"
            >
              <p
                onClick={() => handleSelect(s)}
                className="line-clamp-1 text-ellipsis"
              >
                {s}
              </p>
              <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent h-[1px] w-full" />
            </div>
          ))}
        </div>
      )}
    </form>
  );
};

export default Searchbar;
