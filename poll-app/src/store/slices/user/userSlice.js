import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	userId: null,
	userType: null,
	name: "",
};

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUserType: (state, action) => {
			state.userType = action.payload || null;
		},
		setUserId: (state, action) => {
			state.userId = action.payload || null;
		},
		setUserName: (state, action) => {
			state.name = action.payload || "";
		},
	},
});

export const { setUserType, setUserId, setUserName } = userSlice.actions;

export default userSlice.reducer;
