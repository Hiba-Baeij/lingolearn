import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
interface AppState {
    isLoading: boolean
    isDark: boolean

}

// Define the initial state using that type
const initialState: AppState = {
    isLoading: false,
    isDark: false,

}

export const appSlice = createSlice({
    name: 'app',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setLoading: (state: AppState, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        },
        setDarkMode: (state: AppState, action: PayloadAction<boolean>) => {
            state.isDark = action.payload
            console.log(state.isDark);

        },
    },
})

export const { setLoading, setDarkMode } = appSlice.actions

export default appSlice.reducer