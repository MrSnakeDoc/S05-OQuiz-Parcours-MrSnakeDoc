const { Quizz, Tag } = require("../models/");

export const mainController = {
	async root(req, res) {
		try {
			const result = await Quizz.findAll({
				include: "author",
				order: [["id", "ASC"]],
			});
			res.render("index", {
				result,
			});
		} catch (err) {
			console.error(err.code);
			console.error(err.message);
			res.redirect("/");
		}
	},

	async quizzPage(req, res) {
		try {
			const result = await Quizz.findByPk(Number(req.params.id), {
				include: [
					"tags",
					"author",
					{
						association: "questions",
						include: ["level", "answers"],
					},
				],
			});
			for (const [index, element] of result.questions.entries()) {
				result.questions[index].answers = result.questions[index].answers.sort(
					() => 0.5 - Math.random()
				);
			}
			req.session.user
				? res.render("play_quizz", { result })
				: res.render("quizz", { result });
		} catch (err) {
			console.error(err.code);
			console.error(err.message);
			res.redirect("/");
		}
	},
	async tagsPage(req, res) {
		try {
			const result = await Tag.findAll();
			res.render("tags", { result });
		} catch (err) {
			console.error(err.code);
			console.error(err.message);
			res.redirect("/");
		}
	},

	async tagContentPage(req, res) {
		try {
			const result = await Tag.findByPk(Number(req.params.tag), {
				include: {
					association: "quizzes",
					include: "author",
				},
			});
			res.render("tag", {
				result,
			});
		} catch (err) {
			console.error(err.code);
			console.error(err.message);
			res.redirect("/");
		}
	},
	profil(req, res) {
		const uuser = {
			firstname: req.session.user.firstname,
			lastname: req.session.user.lastname,
			fullname: req.session.user.fullname,
			email: req.session.user.email,
		};
		res.render("profil", { uuser });
	},
	updateProfil(req, res) {
		res.render("userUpdate", {
			uuser: {
				firstname: req.session.user.firstname,
				lastname: req.session.user.lastname,
				email: req.session.user.email,
			},
		});
	},

	signMeUp(req, res) {
		res.render("signup");
	},
	logMeUp(req, res) {
		res.render("login");
	},
	errorRegister(req, res) {
		res.render("errorRegister");
	},
	async answers(req, res) {
		try {
			const result = await Quizz.findByPk(Number(req.params.id), {
				include: [
					"tags",
					"author",
					{
						association: "questions",
						include: ["level", "answers"],
					},
				],
			});
			let scores = 0;
			for (const [index, element] of result.questions.entries()) {
				if (element.answer_id === Number(req.body[index])) {
					scores++;
				}
			}
			res.render("scores", { result, scores });
		} catch (err) {
			console.error(err.code);
			console.error(err.message);
			res.redirect("/");
		}
	},
	async tagUpdate(req, res) {
		try {
			const result = await Tag.findAll({
				order: [["id", "ASC"]],
			});
			res.render("tagUpdate", { result });
		} catch (err) {
			console.log(err.message);
		}
	},
	async tagAssociation(req, res) {
		try {
			const quizz = await Quizz.findAll();
			const tags = await Tag.findAll();
			res.render("tagAssociation", { quizz, tags, error: req.query.error });
		} catch (err) {
			console.log(err.message);
			res.redirect("/");
		}
	},
	async deleteTagPage(req, res) {
		try {
			const result = await Tag.findAll({
				order: [["id", "ASC"]],
			});
			res.render("tagDelete", { result });
		} catch (err) {
			console.log(err.message);
		}
	},
	async tagDeassociationPage(req, res) {
		try {
			const quizz = await Quizz.findAll();
			const tags = await Tag.findAll();
			res.render("tagDeassociation", { quizz, tags, error: req.query.error });
		} catch (err) {
			console.error(err.code);
			console.error(err.message);
			res.redirect("/");
		}
	},
};
