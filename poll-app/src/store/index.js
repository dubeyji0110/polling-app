import { configureStore } from "@reduxjs/toolkit";

import counterReducer from "./slices/counter/counterSlice";
import userReducer from "./slices/user/userSlice";

export const store = configureStore({
	reducer: {
		counter: counterReducer,
		user: userReducer,
	},
});
