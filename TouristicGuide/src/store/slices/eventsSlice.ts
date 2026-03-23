import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Event {
  id: string;
  title: string;
  description: string;
  place_id?: string;
  latitude: number;
  longitude: number;
  category_id?: string;
  start_date: string;
  end_date: string;
  photo_url?: string;
  is_free: boolean;
  status: "pending" | "active" | "rejected";
  created_by: string;
  created_at: string;
}

interface EventsState {
  events: Event[];
}

const initialState: EventsState = {
  events: [],
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<Event>) => {
      state.events.push(action.payload);
    },
    removeEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter((e) => e.id !== action.payload);
    },
    clearEvents: () => initialState,
  },
});

export const { addEvent, removeEvent, clearEvents } = eventsSlice.actions;
export default eventsSlice.reducer;
