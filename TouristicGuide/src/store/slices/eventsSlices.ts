import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Event {
    name: string;
    time: string;
    place: string;
}

interface EventState {
    events: Event[]
}

const initialState: EventState = {
    events: []
}

const EventSlice = createSlice({
    name: "events",
    initialState,
    reducers: {
        addEvent:(state, action: PayloadAction<Event>) => {
            state.events.push(action.payload)
        },
        clearEvent:() => initialState,
    }
})

export const {clearEvent, addEvent} = EventSlice.actions;
export default EventSlice.reducer;

