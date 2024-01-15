const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const auth = require('../utils/auth');
const cocktailRoute = require('../controllers/api/');

router.get('/', async (req, res) => {
	try {
		const posted = await Post.findAll({
			include: [{ model: User }],
		});
		const posts = posted.map((post) => post.get({ plain: true }));
		//  const con = console.log(posts)
		res.render('home', {
			posts,
			logged_in: req.session.logged_in,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
});

router.get('/login', (req, res) => {
	// If a session exists, redirect the request to the homepage
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
		console.log(err);
		res.status(500).json(err);
	}
});

module.exports = router;
