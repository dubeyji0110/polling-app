const cors = require("cors");
const { addPoll, createSubmission, getPoll } = require("./db/poll");
const { addUser, removeUser } = require("./db/users");
const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
});

const PORT = process.env.PORT || 5000;

app.use(cors());

io.on("connection", (socket) => {
	console.log(`Socket Connected!!`);
	socket.on("join", () => {
		addUser(socket.id);
		socket.emit("setUserId", { userId: socket.id });
	});
	socket.on("startPoll", async ({ poll }) => {
		const savedPoll = await addPoll(poll);
		io.emit("newPoll", { poll: savedPoll, delay: "30000" });
		setTimeout(() => {
			const result = getPoll(savedPoll.id);
			io.emit("showResult", { result });
		}, 30000);
	});
	socket.on("submission", (submission) => {
		createSubmission(submission);
	});
	socket.on("disconnect", () => {
		removeUser(socket.id);
		console.log("Socket Disconnected!");
	});
});

server.listen(PORT, (err) => {
	if (err) throw err;
	console.log(`Server Started on port ${PORT}`);
});
