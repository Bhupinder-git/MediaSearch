export default function MediaCard({
  media,
  isSaved = false,
  onSave,
  onRemove,
  mode = "search",
}) {
  // check
  if (!media) return null;

  // destructuring values for easy use
  const { type, src, title, author, meta, duration, format } = media;

  // Badge config per type
  const badgeConfig = {
    photo: {
      icon: mode === "collection" ? "image" : null,
      label: "PHOTO",
      classes:
        mode === "collection"
          ? "bg-primary-container/85 backdrop-blur-sm text-surface"
          : "bg-primary/80 backdrop-blur-sm text-on-primary",
    },
    video: {
      icon: mode === "collection" ? "videocam" : "play_arrow",
      label: duration ? `VIDEO • ${duration}` : "VIDEO",
      classes:
        mode === "collection"
          ? "bg-primary-container/85 backdrop-blur-sm text-surface"
          : "bg-primary/80 backdrop-blur-sm text-on-primary",
    },
    gif: {
      icon: "gif_box",
      label: mode === "collection" ? "GIF" : "GIF LOOP",
      classes:
        mode === "collection"
          ? "bg-primary-container/85 backdrop-blur-sm text-surface"
          : "bg-accent-terracotta text-on-secondary",
    },
    sticker: {
      icon: "sticker",
      label: "STICKER",
      classes:
        mode === "collection"
          ? "bg-primary-container/85 backdrop-blur-sm text-surface"
          : "bg-accent-terracotta text-on-secondary",
    },
  };

  const badge = badgeConfig[type] || badgeConfig.photo;

  const aspectClass =
    mode === "collection"
      ? "aspect-[4/3]"
      : type === "video"
        ? "aspect-[16/10]"
        : type === "gif" || type === "sticker"
          ? "aspect-square"
          : "aspect-[3/4]";

  return (
    <article
      className={`group relative flex flex-col bg-surface-card overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${
        mode === "collection" ? "rounded-xl" : "rounded-lg"
      } hover:-translate-y-1`}
      data-media={type}
    >
      {/* Thumbnail */}
      <a
        href={`${media.type === "video" ? media.thumbnail : media.src}`}
        target="_blank"
      >
        <div
          className={`relative w-full ${aspectClass} overflow-hidden bg-surface-container cursor-pointer`}
        >
          <img
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            src={type === "video" ? media.thumbnail : src}
            alt={title}
            loading="lazy"
          />

          {/* Type Badge */}
          <div
            className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[11px] leading-3.5 tracking-wider font-semibold flex items-center gap-1 ${badge.classes}`}
          >
            {badge.icon && (
              <span
                className={`material-symbols-outlined text-[12px] ${type === "gif" && mode === "collection" ? "text-secondary-container" : ""} ${type === "video" && mode === "collection" ? "text-secondary-container" : ""}`}
              >
                {badge.icon}
              </span>
            )}
            <span>{badge.label}</span>
          </div>

          {/* Format / Duration Badge (top-right for search, bottom-right for collection video) */}
          {mode === "search" && format && (
            <div className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded bg-surface-bright/90 backdrop-blur-sm text-text-primary font-mono text-[10px]">
              {format}
            </div>
          )}

          {type === "video" && mode === "collection" && duration && (
            <div className="absolute bottom-3 right-3 bg-primary/75 backdrop-blur-sm text-surface px-2 py-0.5 rounded text-[11px] leading-3.5 tracking-wider font-semibold">
              {duration}
            </div>
          )}

          {/* GIF loop indicator (collection mode) */}
          {type === "gif" && mode === "collection" && (
            <div className="absolute bottom-3 left-3 bg-surface-card/90 text-text-primary px-2 py-0.5 rounded text-[11px] leading-3.5 tracking-wider font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-terracotta animate-pulse" />
              <span>Infinite Loop</span>
            </div>
          )}
        </div>
      </a>

      {/* Card Body */}
      <div
        className={`flex flex-col bg-surface-card ${
          mode === "collection"
            ? "p-4 flex-1 justify-between gap-3"
            : "p-space-md gap-1.5"
        }`}
      >
        {/* Title + Action Row */}
        <div
          className={
            mode === "collection"
              ? "flex flex-col"
              : "flex items-start justify-between gap-2"
          }
        >
          <div className="min-w-0">
            <h3 className="text-[14px] leading-[20px] font-medium text-text-primary truncate">
              {title}
            </h3>
            <p className="text-[13px] leading-4.5 text-text-muted mt-0.5 truncate">
              {author}
            </p>
          </div>

          {/* Save button (search mode — inline) */}
          {mode === "search" && (
            <button
              type="button"
              className={`shrink-0 p-1.5 rounded flex items-center gap-1 text-[12px] font-medium transition-colors cursor-pointer ${
                isSaved
                  ? "bg-accent-terracotta-subtle text-accent-terracotta"
                  : "hover:bg-surface-container text-text-secondary hover:text-text-primary"
              }`}
              title={isSaved ? "Already Saved" : "Save to collection"}
              onClick={(e) => {
                e.stopPropagation();
                if (isSaved) {
                  onRemove?.(media);
                } else {
                  onSave?.(media);
                }
              }}
            >
              <span
                className="material-symbols-outlined text-[16px]"
                style={isSaved ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {isSaved ? "bookmark" : "bookmark_add"}
              </span>
              <span className="hidden sm:inline">
                {isSaved ? "Saved" : "Save"}
              </span>
            </button>
          )}
        </div>

        {/* Footer Row */}
        <div
          className={`flex items-center justify-between ${
            mode === "collection"
              ? "pt-2"
              : "text-[11px] font-mono text-text-muted mt-2 pt-2 bg-surface-container-low px-2 py-1 rounded"
          }`}
        >
          {mode === "collection" ? (
            <>
              {format && (
                <span className="text-[11px] leading-3.5 tracking-wider font-semibold text-text-secondary bg-surface-container px-2 py-0.5 rounded">
                  {format}
                </span>
              )}
              <button
                type="button"
                className="flex items-center gap-1 px-2.5 py-1 text-text-muted hover:text-destructive-crimson hover:bg-destructive-subtle rounded text-[13px] leading-[16px] font-medium transition-colors cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove?.(media);
                }}
              >
                <span className="material-symbols-outlined text-[16px]">
                  close
                </span>
                <span>Remove</span>
              </button>
            </>
          ) : (
            <>
              <span>{meta || ""}</span>
              {isSaved && (
                <span className="text-accent-terracotta font-sans font-medium">
                  Archived
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </article>
  );
}
