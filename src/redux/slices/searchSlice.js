import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetchSearchPage from "../../services/fetchSearchPage";

export const searchMedia = createAsyncThunk(
  "search/fetchMedia",
  async ({ query, activeTab, page = 1 }, { rejectWithValue }) => {
    try {
      return await fetchSearchPage(query.trim(), activeTab, page);
    } catch (error) {
      return rejectWithValue(error?.message || "Unable to fetch results");
    }
  },
);
const searchSlice = createSlice({
  name: "search",
  initialState: {
    query: "",
    activeTab: "photos",
    result: [],
    error: null,
    loading: false,
    loadingMore: false,
    page: 1,
    hasMore: false,
  },
  reducers: {
    setQuery(state, action) {
      state.query = action.payload;
    },
    setActiveTab(state, action) {
      state.activeTab = action.payload;
    },
    setResult(state, action) {
      state.result = action.payload;
      state.loading = false;
      state.loadingMore = false;
      state.page = 1;
      state.hasMore = false;
      state.error = null;
    },
    appendResults(state, action) {
      state.result.push(...action.payload);
    },
    setError(state, action) {
      state.loading = false;
      state.loadingMore = false;
      state.error = action.payload;
    },
    setLoading(state) {
      state.loading = true;
      state.error = null;
    },
    clearResult(state) {
      state.result = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchMedia.pending, (state, action) => {
        if (action.meta.arg.page === 1) {
          state.loading = true;
        } else {
          state.loadingMore = true;
        }
        state.error = null;
      })
      .addCase(searchMedia.fulfilled, (state, action) => {
        const { query, activeTab, page } = action.meta.arg;

        if (
          query.trim() !== state.query.trim() ||
          activeTab !== state.activeTab
        ) {
          return;
        }

        if (page === 1) {
          state.result = action.payload.results;
        } else {
          state.result.push(...action.payload.results);
        }

        state.page = page;
        state.hasMore =
          action.payload.hasMore && action.payload.results.length > 0;
        state.loading = false;
        state.loadingMore = false;
      })
      .addCase(searchMedia.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.error = action.payload || action.error.message;
      });
  },
});

// exporting the action creators
export const {
  setQuery,
  setActiveTab,
  setResult,
  appendResults,
  setError,
  setLoading,
  clearResult,
} = searchSlice.actions;

// exporting the reducer
export default searchSlice.reducer;
