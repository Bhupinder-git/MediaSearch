import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addToCollectionApi,
  clearCollectionApi,
  getCollectionApi,
  removeFromCollectionApi,
} from "../../services/authApi";

export const fetchCollection = createAsyncThunk(
  "collection/fetchCollection",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCollectionApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Unable to load collection.",
      );
    }
  },
);

export const addItemToCollection = createAsyncThunk(
  "collection/addItemToCollection",
  async (item, { rejectWithValue }) => {
    try {
      const response = await addToCollectionApi(item);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Unable to save item.",
      );
    }
  },
);

export const removeItemFromCollection = createAsyncThunk(
  "collection/removeItemFromCollection",
  async (itemId, { rejectWithValue }) => {
    try {
      await removeFromCollectionApi(itemId);
      return itemId;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Unable to remove item.",
      );
    }
  },
);

export const clearCollectionFromBackend = createAsyncThunk(
  "collection/clearCollectionFromBackend",
  async (_, { rejectWithValue }) => {
    try {
      await clearCollectionApi();
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Unable to clear collection.",
      );
    }
  },
);

const collectionSlice = createSlice({
  name: "collection",
  initialState: {
    items: JSON.parse(localStorage.getItem("collection")) || [],
    activeTab: "photos",
  },
  reducers: {
    setActiveTab(state, action) {
      state.activeTab = action.payload;
    },
    setCollectionItems(state, action) {
      state.items = action.payload;
      localStorage.setItem("collection", JSON.stringify(state.items));
    },
    clearCollection(state) {
      // simply clear the state and localStorage
      state.items = [];
      localStorage.removeItem("collection");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollection.fulfilled, (state, action) => {
        state.items = action.payload;
        localStorage.setItem("collection", JSON.stringify(state.items));
      })
      .addCase(addItemToCollection.fulfilled, (state, action) => {
        if (!state.items.find((item) => item.id === action.payload.id)) {
          state.items.push(action.payload);
          localStorage.setItem("collection", JSON.stringify(state.items));
        }
      })
      .addCase(removeItemFromCollection.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        localStorage.setItem("collection", JSON.stringify(state.items));
      })
      .addCase(clearCollectionFromBackend.fulfilled, (state) => {
        state.items = [];
        localStorage.removeItem("collection");
      });
  },
});

// exporting the action creators
export const { setActiveTab, setCollectionItems, clearCollection } =
  collectionSlice.actions;

// Redux selector that reads the complete results and returns only the results matching the currently active tab
export const selectFilteredCollectionItems = (state) => {
  const items = state.collection.items;
  const activeTab = state.collection.activeTab;

  if (activeTab === "all") return items;

  return items.filter((item) => {
    if (activeTab === "photos") return item.type === "photo";
    if (activeTab === "videos") return item.type === "video";
    if (activeTab === "gifs") return item.type === "gif";
    if (activeTab === "stickers") return item.type === "sticker";
    return true;
  });
};

// exporting the reducer
export default collectionSlice.reducer;
