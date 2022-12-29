const baseUrl =
	process.env.NODE_ENV !== "production"
		? `http://localhost:5000`
		: `https://poll-app-backend.onrender.com`;
export default baseUrl;
