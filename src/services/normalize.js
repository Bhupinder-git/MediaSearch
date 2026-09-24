// Function to normalize results
function normalizeResults(
  photoResponse,
  videoResponse,
  gifResponse,
  stickerResponse,
  tab,
) {
  // Constants decide whether to process photos, videos, or gifs
  const shouldFetchPhotos = tab === "photos" || tab === "all";
  const shouldFetchVideos = tab === "videos" || tab === "all";
  const shouldFetchGifs = tab === "gifs" || tab === "all";
  const shouldFetchStickers = tab === "stickers" || tab === "all";

  // Array to store the normalized result objects
  const normalizedResults = [];

  if (shouldFetchPhotos) {
    const photos = photoResponse?.data?.results ?? [];
    photos.forEach((item) => {
      normalizedResults.push({
        id: String(item.id),
        type: "photo",
        src: item.urls?.regular || item.urls?.small,
        title: item.alt_description || "Untitled photo",
        author: item.user?.name || "Unknown author",
        meta: `${item.width || 0} × ${item.height || 0}`,
        format: item.color || "Photo",
      });
    });
  }

  if (shouldFetchVideos) {
    const videos = videoResponse?.data?.videos ?? [];
    videos.forEach((item) => {
      normalizedResults.push({
        id: String(item.id),
        type: "video",
        src: item.url || item.image,
        thumbnail: item.image,
        title: item.user?.name ? `${item.user.name} clip` : "Untitled video",
        author: item.user?.name || "Unknown author",
        meta: `${item.width || 0} × ${item.height || 0}`,
        duration: item.duration
          ? `${Math.floor(item.duration / 60)}:${String(item.duration % 60).padStart(2, "0")}`
          : "0:00",
        format: "Video",
      });
    });
  }

  if (shouldFetchGifs) {
    const gifs = gifResponse?.data?.data ?? [];
    gifs.forEach((item) => {
      normalizedResults.push({
        id: item.id
          ? String(item.id)
          : `${item.title || "gif"}-${Math.random()}`,
        type: "gif",
        src: item.images?.original?.url || item.images?.downsized?.url,
        title: item.title || "Untitled gif",
        author: item.user?.display_name || item.username || "Unknown author",
        meta: item.images?.original?.frames
          ? `${item.images.original.frames} frames`
          : "GIF",
        format: "GIF",
      });
    });
  }

  if (shouldFetchStickers) {
    const stickers = stickerResponse?.data?.data ?? [];
    stickers.forEach((item) => {
      normalizedResults.push({
        id: item.id
          ? String(item.id)
          : `${item.title || "sticker"}-${Math.random()}`,
        type: "sticker",
        src: item.images?.original?.url || item.images?.downsized?.url,
        title: item.title || "Untitled sticker",
        author: item.user?.display_name || item.username || "Unknown author",
        meta: "Sticker",
        format: "Sticker",
      });
    });
  }

  return normalizedResults;
}

export default normalizeResults;
