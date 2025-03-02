import { createSlice } from "@reduxjs/toolkit";

export type UserState = {
  token: string | null;
  isAuthenticated: boolean;
  user: {
    email: string;
    name: string;
    id: string;
    image: string;
    follow: Array<any>;
    followers: Array<any>;
    body: string;
    postCount: number;
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    isAuthenticated: false,
    user: {},
  } as UserState,
  reducers: {
    userLoggedIn(state, action) {
      state.token = action.payload.token;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
      state.user.id = action.payload.user?._id;
    },
  },
});

export const { userLoggedIn } = authSlice.actions;
export default authSlice.reducer;
