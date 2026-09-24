// Importing apiConnector
import apiConnector from "./apiConnector";

// Importing base_url's
import apiBaseUrls from "./api";

// Importing API Keys
const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_API_KEY;
const PEXELS_KEY = import.meta.env.VITE_PEXELS_API_KEY;
const GIPHY_KEY = import.meta.env.VITE_GIPHY_API_KEY;

// Functions to fetch
async function fetchPhotos(query, page = 1, per_page = 20) {
  return apiConnector(
    "GET",
    apiBaseUrls.UNSPLASH_BASE_URL,
    null,
    { Authorization: `Client-ID ${UNSPLASH_KEY}` },
    { query, page, per_page },
  );
}

async function fetchVideos(query, page = 1, per_page = 20) {
  return apiConnector(
    "GET",
    apiBaseUrls.PEXELS_BASE_URL,
    null,
    { Authorization: `${PEXELS_KEY}` },
    { query, page, per_page },
  );
}

async function fetchGIFs(query, offset = 0, limit = 20) {
  return apiConnector("GET", apiBaseUrls.GIPHY_GIF_BASE_URL, null, null, {
    q: query,
    offset,
    limit,
    api_key: GIPHY_KEY,
  });
}

async function fetchStickers(query, offset = 0, limit = 20) {
  return apiConnector("GET", apiBaseUrls.GIPHY_STICKER_BASE_URL, null, null, {
    q: query,
    offset,
    limit,
    api_key: GIPHY_KEY,
  });
}


// exporting
export { fetchPhotos, fetchVideos, fetchGIFs, fetchStickers };
