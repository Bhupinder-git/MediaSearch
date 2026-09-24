import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginApi, signupApi, logoutApi, getMeApi } from '../../services/authApi';

// ===== Async Thunks =====

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const data = await loginApi(email, password);
            return data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || 'Login failed. Please try again.'
            );
        }
    }
);

export const signupUser = createAsyncThunk(
    'auth/signupUser',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const data = await signupApi(email, password);
            return data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || 'Signup failed. Please try again.'
            );
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, { rejectWithValue }) => {
        try {
            const data = await logoutApi();
            return data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || 'Logout failed.'
            );
        }
    }
);

export const checkAuth = createAsyncThunk(
    'auth/checkAuth',
    async (_, { rejectWithValue }) => {
        try {
            const data = await getMeApi();
            return data;
        } catch (error) {
            return rejectWithValue('Not authenticated');
        }
    }
);

// ===== Slice =====

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: JSON.parse(localStorage.getItem('user')) || null,
        isAuthenticated: !!localStorage.getItem('user'),
        loading: false,
        error: null,
    },
    reducers: {
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = { email: action.meta.arg.email };
                localStorage.setItem('user', JSON.stringify({ email: action.meta.arg.email }));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Signup
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Logout
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                localStorage.removeItem('user');
            })
            .addCase(logoutUser.rejected, (state) => {
                state.loading = false;
                // Force logout locally even if server fails
                state.isAuthenticated = false;
                state.user = null;
                localStorage.removeItem('user');
            })

            // Check Auth
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.user = action.payload.user;
                localStorage.setItem('user', JSON.stringify(action.payload.user));
            })
            .addCase(checkAuth.rejected, (state) => {
                state.isAuthenticated = false;
                state.user = null;
                localStorage.removeItem('user');
            });
    }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
