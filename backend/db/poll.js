const { v4 } = require("uuid");
const polls = [];

const getPoll = (pollId) => {
	return polls.find((x) => x.id === pollId);
};

const addPoll = async (poll) => {
	const newPoll = {
		...poll,
		id: v4(),
		options: poll.options.map((x) => ({
			id: v4(),
			...x,
		})),
	};
	polls.push(newPoll);
	return newPoll;
};

const createSubmission = async (submission) => {
	const poll = polls.find((x) => x.id === submission.pollId);
	const pollIdx = polls.findIndex((x) => x.id === submission.pollId);
	const newOpt = poll.options.find((x) => x.id === submission.optionId);
	const idx = poll.options.findIndex((x) => x.id === submission.optionId);
	if (newOpt["responses"]) {
		newOpt["responses"].push(submission.user);
	} else newOpt["responses"] = [submission.user];
	poll.options.splice(idx, 1, newOpt);
	if (poll.responses) poll.responses = poll.responses + 1;
	else poll.responses = 1;
	polls.splice(pollIdx, 1, poll);
	console.log(JSON.stringify(polls));
};

const removePoll = (pollId) => {
	const idx = polls.map((x) => x.id).indexOf(pollId);
	polls.splice(idx, 1);
};

module.exports = {
	addPoll,
	removePoll,
	createSubmission,
	getPoll,
};
