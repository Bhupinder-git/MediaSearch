export default function CollectionHeader({
  itemCount = 0,
  counts = {},
  onClearCollection,
}) {
  return (
    <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg pb-space-lg">
      {/* Title & Subtitle */}
      <div className="flex flex-col gap-space-xs max-w-xl">
        <div className="flex items-center gap-space-xs text-[11px] leading-3.5 tracking-wider font-semibold text-text-muted uppercase">
          <span>Private Repository</span>
          <span>/</span>
          <span>Your Media</span>
        </div>
        <h1 className="text-[40px] leading-12 tracking-[-0.02em] font-semibold text-text-primary md:text-display-xl">
          Your Collection
        </h1>
        <p className="text-[16px] leading-[24px] text-text-secondary">
          {itemCount} item{itemCount !== 1 ? "s" : ""} saved across Photos,
          Videos, GIFs, and Stickers.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-space-xs">
        <button
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-card hover:bg-destructive-subtle text-text-muted hover:text-destructive-crimson rounded-lg text-[13px] leading-[16px] font-medium transition-colors shadow-sm cursor-pointer"
          onClick={() => {
            if (
              itemCount > 0 &&
              window.confirm(
                `Are you sure you want to clear all ${itemCount} items from your collection?`,
              )
            ) {
              onClearCollection?.();
            }
          }}
        >
          <span className="material-symbols-outlined text-[16px]">
            delete_outline
          </span>
          <span>Clear Collection</span>
        </button>
      </div>
    </section>
  );
}
