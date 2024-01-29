const router = require('express').Router();
const { User, Post, Comment } = require('../models');

router.get('/', async (req, res) => {
	try {
		const posted = await Post.findAll({
			include: [{ model: User }],
		});
		const posts = posted.map((post) => post.get({ plain: true }));
		res.render('home', {
			posts,
			logged_in: req.session.logged_in,
		});
	} catch (err) {
		res.status(500).json(err);
	}
});

router.get('/login', (req, res) => {
	// If a session exists, redirect to the homepage
	if (req.session.logged_in) {
		res.redirect('/');
		return;
	}
	res.render('login');
});

router.get('/signup', (req, res) => {
	try {
		res.render('signUp');
	} catch (err) {
		res.status(500).json(err);
	}
});

// get single post
router.get('/post/:id', async (req, res) => {
	try {
		const post = await Post.findByPk(req.params.id, {
			include: [
				{
					model: User,
					model: Comment,
					include: [
						{
							model: User,
							attributes: ['user_name'],
						},
					],
				},
			],
		});
		const singlePost = post.get({ plain: true });
		const user = await User.findByPk(singlePost.user_id);
		const author = user.get({ plain: true });

		res.render('post', {
			singlePost,
			author,
			logged_in: req.session.logged_in,
		});
	} catch (err) {
		console.error(err);
		res.status(400).json({ error: err, message: 'Something went wrong.' });
	}
});

module.exports = router;
