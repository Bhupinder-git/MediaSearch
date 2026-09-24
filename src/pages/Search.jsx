import { useEffect } from "react";
import SearchBar from "../components/SearchBar";
import MediaTabs from "../components/MediaTabs";
import MediaGrid from "../components/MediaGrid";
import { dummyData } from "../data";
import Spinner from "../components/Spinner";
import { useSelector, useDispatch } from "react-redux";
import { searchMedia, setResult } from "../redux/slices/searchSlice";

// Dummy Data to be displayed when nothing is searched
const PLACEHOLDER_RESULTS = dummyData;

export default function Search() {
  // Creating an instance of the dispatcher to dispatch actions
  const dispatch = useDispatch();

  // Accessing searchSlice States
  const searchState = useSelector((state) => state.search ?? {});
  const query = searchState.query;
  const activeTab = searchState.activeTab;
  const loading = searchState.loading;

  // States to keep the track of the content loaded
  // Items to be displayed
  const results =
    query?.trim() && Array.isArray(searchState.result)
      ? searchState.result
      : PLACEHOLDER_RESULTS;

  const { page, hasMore, loadingMore } = searchState;

  // Array containing items id's used to track the already saved items
  const savedIds = useSelector((state) => state.collection.items).map(
    (item) => item.id,
  );

  useEffect(() => {
    const nextQuery = query ?? "";
    if (!nextQuery.trim()) {
      dispatch(setResult(PLACEHOLDER_RESULTS));
      return;
    }

    dispatch(searchMedia({ query: nextQuery, activeTab, page: 1 }));
  }, [query, activeTab, dispatch]);

  const handleLoadMore = async () => {
    // check
    if (loading || loadingMore || !hasMore || !query?.trim()) return;

    // incrementing page
    dispatch(searchMedia({ query: query.trim(), activeTab, page: page + 1 }));
  };

  // ── Filter results by active tab ──
  const filteredResults =
    activeTab === "all"
      ? results
      : results.filter((item) => {
          if (activeTab === "photos") return item.type === "photo";
          if (activeTab === "videos") return item.type === "video";
          if (activeTab === "gifs") return item.type === "gif";
          if (activeTab === "stickers") return item.type === "sticker";
          return true;
        });

  return (
    <div className="flex flex-col w-full">
      {/* ── Masthead ── */}
      <section className="w-full bg-surface-bright pt-space-xl pb-space-lg px-margin-mobile md:px-margin-tablet lg:px-margin">
        <div className="max-w-360 mx-auto flex flex-col items-center text-center">
          {/* Overline */}
          <div className="inline-flex items-center gap-space-sm mb-space-md">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-terracotta" />
            <span className="text-[11px] leading-3.5 tracking-wider font-semibold text-text-secondary uppercase">
              MEDIA ARCHIVE // 2026 COLLECTION
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-[30px] leading-9.5 md:text-[40px] md:leading-12 tracking-[-0.02em] font-semibold text-text-primary max-w-2xl">
            Discover visuals. Save what inspires you.
          </h1>
          <p className="text-[14px] leading-[20px] text-text-secondary mt-space-xs max-w-xl">
            Search photos, videos, and GIFs from across the web, then collect
            the ones worth coming back to.
          </p>

          {/* Search Bar */}
          <SearchBar />
        </div>
      </section>

      {/* ── Filter Strip ── */}
      <section className="w-full bg-surface px-margin-mobile md:px-margin-tablet lg:px-margin py-space-md">
        <div className="max-w-360 mx-auto flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <MediaTabs variant="search" />

          {/* Right-side controls */}
          <div className="flex items-center justify-between md:justify-end gap-space-md shrink-0">
            <div className="hidden lg:block leading-4.5 text-text-muted font-mono text-[12px]">
              Showing {filteredResults.length} of {results.length} plates
            </div>
          </div>
        </div>
      </section>

      {/* ── Results Grid ── */}
      <main className="w-full bg-surface px-margin-mobile md:px-margin-tablet lg:px-margin pt-space-md pb-space-2xl">
        <div className="max-w-360 mx-auto">
          {loading ? (
            <Spinner />
          ) : (
            <MediaGrid
              items={filteredResults}
              mode="search"
              savedIds={savedIds}
            />
          )}

          {/* Load More */}
          {!loading && hasMore && filteredResults.length > 0 && (
            <div className="w-full flex flex-col items-center justify-center mt-space-2xl pt-space-xl">
              <button
                type="button"
                className="bg-surface-card hover:bg-surface-container text-text-primary text-[13px] leading-[16px] font-medium px-8 py-3 rounded-lg shadow-xs transition-all duration-150 flex items-center gap-2 cursor-pointer disabled:cursor-wait disabled:opacity-60"
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-outline-variant border-t-accent-terracotta" />
                    <span>Loading more...</span>
                  </>
                ) : (
                  <>
                    <span>Load More Results</span>
                    <span className="material-symbols-outlined text-[18px]">
                      keyboard_arrow_down
                    </span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
