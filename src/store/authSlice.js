import {createSlice} from '@reduxjs/toolkit';

// Helper function để safely parse localStorage
const getStorageItem = (key) => {
    try {
        const item = localStorage.getItem(key);
        if (!item || item === 'undefined' || item === 'null') {
            return null;
        }
        return JSON.parse(item);
    } catch (error) {
        console.error(`Error parsing ${key} from localStorage:`, error);
        return null;
    }
};

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: getStorageItem('user'),
        token: localStorage.getItem('token') || null,
    },
    reducers: {
        loginSuccess: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;

            // Safely store to localStorage
            try {
                localStorage.setItem('user', JSON.stringify(action.payload.user));
                localStorage.setItem('accessToken', action.payload.token);
            } catch (error) {
                console.error('Error saving to localStorage:', error);
            }
        },
        logout: (state) => {
            state.user = null;
            state.token = null;

            // Clear localStorage
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
        },
    },
});

export const {loginSuccess, logout} = authSlice.actions;
export default authSlice.reducer;
