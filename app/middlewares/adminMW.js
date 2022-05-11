module.exports = (req, res, next) => {
	if (!req.session.user) {
		res.redirect("/login");
	} else {
		if (req.session.user.role === "admin") {
			next();
		} else {
			res.render("401");
		}
	}
};
