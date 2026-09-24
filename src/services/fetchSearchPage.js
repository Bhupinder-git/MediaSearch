import {
  fetchPhotos,
  fetchVideos,
  fetchGIFs,
  fetchStickers,
} from "../services/mediaApi";
import normalizeResults from "./normalize";

// No of items to be displayed in a page
const PAGE_SIZE = 10;

async function fetchSearchPage(query, tab, page) {
  // Boolean flags to decide which API calls to make.
  const shouldFetchPhotos = tab === "photos" || tab === "all";
  const shouldFetchVideos = tab === "videos" || tab === "all";
  const shouldFetchGifs = tab === "gifs" || tab === "all";
  const shouldFetchStickers = tab === "stickers" || tab === "all";

  // Calling all the api's in parallel
  const [photoResponse, videoResponse, gifResponse, stickerResponse] =
    await Promise.all([
      shouldFetchPhotos
        ? fetchPhotos(query, page, PAGE_SIZE)
        : Promise.resolve({ data: { results: [] } }),
      shouldFetchVideos
        ? fetchVideos(query, page, PAGE_SIZE)
        : Promise.resolve({ data: { videos: [] } }),
      shouldFetchGifs
        ? fetchGIFs(query, (page - 1) * PAGE_SIZE, PAGE_SIZE)
        : Promise.resolve({ data: { data: [] } }),
      shouldFetchStickers
        ? fetchStickers(query, (page - 1) * PAGE_SIZE, PAGE_SIZE)
        : Promise.resolve({ data: { results: [] } }),
    ]);

  // Safely extracting the result
  const photos = photoResponse?.data?.results ?? [];
  const videos = videoResponse?.data?.videos ?? [];
  const gifs = gifResponse?.data?.data ?? [];
  const stickers = stickerResponse?.data?.data ?? [];

  // Pagination Checks
  const hasMorePhotos =
    shouldFetchPhotos &&
    (typeof photoResponse?.data?.total_pages === "number"
      ? page < photoResponse.data.total_pages
      : photos.length === PAGE_SIZE);

  const hasMoreVideos =
    shouldFetchVideos &&
    (Boolean(videoResponse?.data?.next) || videos.length === PAGE_SIZE);
  const pagination = gifResponse?.data?.pagination;
  
  const hasMoreGifs =
    shouldFetchGifs && pagination
      ? pagination.offset + pagination.count < pagination.total_count
      : shouldFetchGifs && gifs.length === PAGE_SIZE;
  const stickerPagination = stickerResponse?.data?.pagination;

  const hasMoreStickers =
    shouldFetchStickers && stickerPagination
      ? stickerPagination.offset + stickerPagination.count <
        stickerPagination.total_count
      : shouldFetchStickers && stickers.length === PAGE_SIZE;

  return {
    results: normalizeResults(
      photoResponse,
      videoResponse,
      gifResponse,
      stickerResponse,
      tab,
    ),
    hasMore: hasMorePhotos || hasMoreVideos || hasMoreGifs || hasMoreStickers,
  };
}

export default fetchSearchPage;

// This function orchestrates fetching photos, videos, and GIFs in parallel, handles pagination logic for each type, normalizes the results into a consistent format, and returns both the results and a flag indicating whether more data can be loaded.
