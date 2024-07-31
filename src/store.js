import { configureStore, createSlice } from "@reduxjs/toolkit";

const oldie = createSlice({
    name: 'oldie',
    initialState: false,
    reducers: {
        setIsOldie: (state, action) => action.payload
    }
});

const rootReducer = {
    oldie: oldie.reducer
};

const store = configureStore({
    reducer: rootReducer
});

export const { setIsOldie } = oldie.actions;
export default store;
