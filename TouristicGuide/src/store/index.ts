

import { configureStore } from "@reduxjs/toolkit";
import eventsReducer from "./slices/eventsSlice";
import { INITIAL_EVENTS } from "../data/events";

export const store = configureStore({
  reducer: {
    events: eventsReducer,
  },
  preloadedState: {
    events: { events: INITIAL_EVENTS },
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;