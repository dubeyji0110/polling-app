const users = [];

const addUser = (userId) => {
	if (users.includes(userId)) return users;
	else users.push(userId);
	console.log(users);
	return users;
};

const removeUser = (userId) => {
	const idx = users.indexOf(userId);
	users.splice(idx, 1);
	console.log(users);
};

module.exports = {
	addUser,
	removeUser,
};
