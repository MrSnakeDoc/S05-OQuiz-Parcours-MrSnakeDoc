module.exports = (req, res, next) => {
	if (!req.session.user) {
		req.session.user = false;
	}
	res.locals.user = req.session.user;
	next();
};
