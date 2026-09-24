import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setQuery as setSearchQuery } from "../redux/slices/searchSlice";

export default function SearchBar() {
  // creating an instance of dispatcher to dispatch actions
  const dispatch = useDispatch();

  // State to keep the track of the typed query
  const [query, setQuery] = useState(
    useSelector((state) => state.search.query),
  );

  // suggestions for search
  const suggestions = [
    "Architecture",
    "Analog Photography",
    "Kinetic Typography",
    "Documentary Film",
    "Botanicals",
  ];

  // Function to handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setSearchQuery(query));
  };

  // Function to clear the search
  const handleClear = () => {
    setQuery("");
  };

  return (
    <div className="w-full max-w-2xl mt-space-xl">
      {/* Search Form */}
      <form
        className="relative flex items-center bg-surface-card rounded-lg shadow-sm p-1"
        onSubmit={handleSubmit}
      >
        <div className="pl-space-md pr-space-xs flex items-center pointer-events-none text-text-muted">
          <span className="material-symbols-outlined text-[20px]">search</span>
        </div>
        <input
          className="w-full bg-transparent py-space-sm px-space-xs text-[14px] leading-[20px] text-text-primary placeholder:text-text-muted focus:outline-none"
          id="searchInput"
          placeholder="Search anything: nature, architecture, abstract, portraits..."
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            type="button"
            className="shrink-0 p-2 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
            aria-label="Clear search"
            title="Clear search"
            onClick={handleClear}
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
        <button
          className="bg-primary hover:bg-primary-container text-on-primary text-[13px] leading-[16px] font-medium px-space-lg py-2.5 rounded-lg transition-colors duration-150 flex items-center gap-1.5 shrink-0 cursor-pointer"
          type="submit"
        >
          <span>Explore</span>
          <span className="material-symbols-outlined text-[16px]">
            arrow_forward
          </span>
        </button>
      </form>

      {/* Suggested Tags */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-space-md text-[13px] leading-4.5">
        <span className="text-text-muted mr-1 text-[11px] leading-3.5 font-semibold uppercase tracking-wider">
          Suggested:
        </span>
        {suggestions.map((tag) => (
          <button
            key={tag}
            className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-highest text-text-secondary hover:text-text-primary transition-colors text-[13px] cursor-pointer"
            type="button"
            onClick={() => {
              setQuery(tag);
              dispatch(setSearchQuery(tag));
            }}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
