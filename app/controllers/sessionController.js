import bcrypt from "bcrypt";
import config from "../config";
const { User } = require("../models/");

export const sessionController = {
	async signUp(req, res) {
		try {
			if (req.body.password !== req.body.passwordConfirm) {
				return res.render("signup", { error: "Mot de passe différents" });
			}
			const [user, created] = await User.findOrCreate({
				where: { email: req.body.email },
				defaults: {
					email: req.body.email,
					password: await bcrypt.hash(
						req.body.password,
						Number(config.pwd_saltrounds)
					),
					firstname: req.body.firstname === "" ? null : req.body.firstname,
					lastname: req.body.lastname === "" ? null : req.body.lastname,
				},
			});
			!created
				? res.render("errorRegister", { email: req.body.email })
				: res.redirect("/login");
		} catch (err) {
			console.error(err.code);
			console.error(err.message);
			res.redirect("/");
		}
	},

	async logIn(req, res) {
		try {
			const result = await User.findOne({
				where: {
					email: req.body.email,
				},
			});
			if (!result) {
				return res.render("login", { error: "Vérifiez vos informations" });
			}
			const isValid = await bcrypt.compare(req.body.password, result.password);
			if (!isValid) {
				return res.render("login", { error: "Mot de passe erroné" });
			}
			req.session.user = {
				firstname: result.firstname,
				lastname: result.lastname,
				fullname: result.fullname,
				email: result.email,
				role: result.role,
			};
			if (req.body.remember) {
				req.session.cookie.maxAge = 60 * 60 * 1000;
			}
			res.redirect("/");
		} catch (err) {
			console.error(err.code);
			console.error(err.message);
			res.redirect("/");
		}
	},
	async delete(req, res) {
		try {
			await User.destroy({
				where: {
					email: req.session.user.email,
				},
			});
			req.session.user = false;
			res.redirect("/");
		} catch (err) {
			console.log(err.message);
		}
	},

	async update(req, res) {
		if (req.body.password !== req.body.passwordConfirm) {
			return res.render("userUpdate", {
				uuser: {
					firstname: req.session.user.firstname,
					lastname: req.session.user.lastname,
					email: req.session.user.email,
				},
				error: "Les mots de passe doivent être identiques",
			});
		}
		try {
			let user = req.body;
			delete user.passwordConfirm;
			for (const element in user) {
				if (user[element] === "") {
					delete user[element];
				}
			}
			if (user.password)
				user.password = await bcrypt.hash(req.body.password, 10);
			await User.update(user, {
				where: {
					email: req.session.user.email,
				},
			});
			const userDb = await User.findOne({
				where: {
					email: user.email,
				},
			});
			req.session.user = {
				firstname: userDb.firstname,
				lastname: userDb.lastname,
				fullname: userDb.fullname,
				email: userDb.email,
				role: userDb.role,
			};
			res.redirect("/");
		} catch (error) {
			console.log(error.message);
			response.status(500).send(error.message);
		}
	},

	disconnect(req, res) {
		req.session.user = false;
		res.redirect("/");
	},
};
