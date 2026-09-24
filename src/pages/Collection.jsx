import CollectionHeader from "../components/CollectionHeader";
import MediaTabs from "../components/MediaTabs";
import MediaGrid from "../components/MediaGrid";
import EmptyCollection from "../components/EmptyCollection";

import { useSelector, useDispatch } from "react-redux";
import {
  clearCollectionFromBackend,
  fetchCollection,
  selectFilteredCollectionItems,
} from "../redux/slices/collectionSlice";
import { useEffect } from "react";

export default function Collection() {
  // creating an instance of the dispatcher to dispatch events
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCollection());
  }, [dispatch]);

  // Accessing all the items
  const items = useSelector((state) => state.collection.items);

  // Getting the items based on the active tab
  const filteredItems = useSelector(selectFilteredCollectionItems);

  const counts = {
    all: items.length,
    photos: items.filter((i) => i.type === "photo").length,
    videos: items.filter((i) => i.type === "video").length,
    gifs: items.filter((i) => i.type === "gif").length,
    stickers: items.filter((i) => i.type === "sticker").length,
  };

  const handleClearCollection = () => {
    dispatch(clearCollectionFromBackend());
  };

  return (
    <div className="flex flex-col w-full">
      <div className="max-w-360 w-full mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin py-space-xl flex flex-col gap-space-xl">
        {/* ── Header ── */}
        <CollectionHeader
          itemCount={items.length}
          counts={counts}
          onClearCollection={handleClearCollection}
        />

        {/* ── Stats Ribbon ── */}
        <div className="hidden md:block">
          {items.length > 0 && (
            <section className="bg-surface-container-low rounded-xl p-space-md grid grid-cols-2 md:grid-cols-5 gap-space-md">
              <div className="flex flex-col">
                <span className="text-[11px] leading-3.5 tracking-wider font-semibold text-text-muted uppercase">
                  Total Items
                </span>
                <span className="text-[20px] leading-7 tracking-[-0.01em] font-medium text-text-primary mt-0.5">
                  {items.length}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] leading-3.5 tracking-wider font-semibold text-text-muted uppercase">
                  Photos
                </span>
                <span className="text-[20px] leading-7 tracking-[-0.01em] font-medium text-text-primary mt-0.5">
                  {counts.photos}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] leading-3.5 tracking-wider font-semibold text-text-muted uppercase">
                  Videos
                </span>
                <span className="text-[20px] leading-7 tracking-[-0.01em] font-medium text-text-primary mt-0.5">
                  {counts.videos}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] leading-3.5 tracking-wider font-semibold text-text-muted uppercase">
                  GIFs
                </span>
                <span className="text-[20px] leading-7 tracking-[-0.01em] font-medium text-text-primary mt-0.5">
                  {counts.gifs}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] leading-3.5 tracking-wider font-semibold text-text-muted uppercase">
                  Stickers
                </span>
                <span className="text-[20px] leading-7 tracking-[-0.01em] font-medium text-text-primary mt-0.5">
                  {counts.stickers}
                </span>
              </div>
            </section>
          )}
        </div>

        {/* ── Filter Tabs ── */}
        {items.length > 0 && (
          <div className="flex flex-wrap items-center gap-space-md">
            <MediaTabs variant="collection" />
          </div>
        )}

        {/* ── Grid or Empty State ── */}
        {items.length === 0 ? (
          <EmptyCollection />
        ) : (
          <MediaGrid items={filteredItems} mode="collection" />
        )}

        {/* ── Footer Ribbon ── */}
        {items.length > 0 && (
          <section className="mt-space-lg pt-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-md text-text-muted text-[13px] leading-4.5">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-accent-terracotta" />
              <span>Synced with offline storage cache</span>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
