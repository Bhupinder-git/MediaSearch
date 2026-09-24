import { useSelector, useDispatch } from "react-redux";
import { setActiveTab as setSearchActiveTab } from "../redux/slices/searchSlice";
import { setActiveTab as setCollectionActiveTab } from "../redux/slices/collectionSlice";

const TABS = [
  // { key: "all", label: "All Media" },
  { key: "photos", label: "Photos" },
  { key: "videos", label: "Videos" },
  { key: "gifs", label: "GIFs" },
  { key: "stickers", label: "Stickers" },
];

export default function MediaTabs({ variant }) {
  // creating an instance of dispatcher to dispatch action
  const dispatch = useDispatch();

  // Items based on the current page
  const sourceItems = useSelector((state) =>
    variant === "collection" ? state.collection.items : state.search.result,
  );

  // Active Tab based on the current page
  const activeTab = useSelector((state) =>
    variant === "collection"
      ? state.collection.activeTab
      : state.search.activeTab,
  );

  // Count to be displayed along tab names
  const counts = {
    all: sourceItems.length,
    photos: sourceItems.filter((item) => item.type === "photo").length,
    videos: sourceItems.filter((item) => item.type === "video").length,
    gifs: sourceItems.filter((item) => item.type === "gif").length,
    stickers: sourceItems.filter((item) => item.type === "sticker").length,
  };

  // Function to handle tab change
  const handleTabChange = (key) => {
    dispatch(
      variant === "collection"
        ? setCollectionActiveTab(key)
        : setSearchActiveTab(key),
    );
  };

  if (variant === "collection") {
    return (
      <nav
        aria-label="Media types"
        className="bg-surface-container-low p-1 rounded-xl flex items-center gap-1"
      >
        {TABS.map(({ key, label }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              type="button"
              className={`text-[13px] leading-[16px] font-medium px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                isActive
                  ? "bg-surface-card text-text-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
              onClick={() => handleTabChange(key)}
            >
              {label}
              {counts[key] !== undefined && (
                <span className="text-text-muted ml-1 font-normal">
                  {counts[key]}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    );
  }

  // Search variant
  return (
    <div className="flex items-center gap-space-sm overflow-x-auto pb-1 md:pb-0">
      {TABS.map(({ key, label }) => {
        const isActive = activeTab === key;
        return (
          <button
            key={key}
            type="button"
            className={`px-3.5 py-2 text-[14px] leading-[20px] tracking-[0.01em] font-medium rounded-lg flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              isActive
                ? "text-accent-terracotta bg-accent-terracotta-subtle"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-container"
            }`}
            onClick={() => handleTabChange(key)}
          >
            <span className={isActive ? "font-medium" : ""}>{label}</span>
            {counts[key] !== undefined && (
              <span
                className={`text-[11px] leading-3.5 tracking-wider font-semibold px-1.5 py-0.5 rounded ${
                  isActive
                    ? "bg-surface-card text-text-secondary shadow-xs"
                    : "bg-surface-container-high text-text-muted"
                }`}
              >
                {counts[key]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
