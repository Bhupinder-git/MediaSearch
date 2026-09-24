import { configureStore } from "@reduxjs/toolkit";
import collectionReducer from './slices/collectionSlice';
import searchReducer from './slices/searchSlice';
import authReducer from './slices/authSlice';

const store = configureStore({
    reducer: {
        search: searchReducer,
        collection: collectionReducer,
        auth: authReducer
    }
});

export default store;