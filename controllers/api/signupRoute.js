const router = require('express').Router();
const { User } = require('../../models');

router.post('/', async (req, res) => {
	const findUser = await User.findOne({
		where: { user_name: req.body.user_name },
	});

	if (findUser) {
		res.status(400).json({
			message:
				'Hmm, Looks like that username is already in use or is incorrect.',
		});
		return;
	}

	// If there is no match with the username, send error message for a retry
	try {
		const user = await User.create({
			user_name: req.body.user_name,
			password: req.body.password,
		});

		req.session.save(() => {
			req.session.user_id = user.id;
			req.session.logged_in = true;
			res.status(200).json(user);
		});
	} catch (error) {
		res.status(500).json(error);
	}
});

module.exports = router;
