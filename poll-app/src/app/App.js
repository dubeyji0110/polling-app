import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreatePoll from "../pages/CreatePoll";

import Home from "../pages/Home";
import Polls from "../pages/Polls";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/create-poll' element={<CreatePoll />} />
				<Route path='/poll' element={<Polls />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
