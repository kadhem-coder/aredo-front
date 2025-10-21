"use client";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { api } from "@/services/api";

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
});

export default configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type IRootState = ReturnType<typeof rootReducer>;
