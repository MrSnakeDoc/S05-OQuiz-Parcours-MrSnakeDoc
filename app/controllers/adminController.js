const { Tag, Quizz } = require("../models/");
export const adminController = {
	showInterface(req, res) {
		res.render("admin");
	},
	addTag(req, res) {
		res.render("addTag");
	},
	async addTagPost(req, res) {
		const [tag, created] = await Tag.findOrCreate({
			where: { name: req.body.addTag },
			defaults: {
				name: req.body.addTag,
				color: adminController.getRandomColor(),
			},
		});
		!created
			? res.render("addTag", { error: "Ce tag existe déjà" })
			: res.redirect("/tags");
	},

	getRandomColor() {
		const letters = "0123456789ABCDEF";
		let color = "#";
		for (const i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	},
	async tagUpdate(req, res) {
		try {
			await Tag.update(
				{ name: req.body.tag },
				{
					where: {
						name: req.body.tags,
					},
				}
			);
			res.redirect("/tags");
		} catch (err) {
			console.log(err.message);
			res.redirect("/");
		}
	},
	async tagAssociation(req, res) {
		try {
			const quizz = await Quizz.findByPk(+req.body.quizz, {
				include: "tags",
			});
			quizz.tags.find((tag) => tag.id === +req.body.tag)
				? res.redirect(
						"/admin/tagAssociation?error=Cette association existe déjà"
				  )
				: null;
			const tag = await Tag.findByPk(req.body.tag);
			await quizz.addTag(tag);
			res.redirect("/tags");
		} catch (err) {
			console.log(err.message);
			res.redirect("/");
		}
	},
	async deleteTag(req, res) {
		try {
			await Tag.destroy({
				where: {
					name: req.body.tags,
				},
			});
			res.redirect("/tags");
		} catch (err) {
			console.log(err.message);
			res.redirect("/");
		}
	},
	async tagDeassociation(req, res) {
		try {
			const quizz = await Quizz.findByPk(+req.body.quizz, {
				include: "tags",
			});
			if (quizz.tags.find((tag) => tag.id === +req.body.tag)) {
				const tag = await Tag.findByPk(req.body.tag);
				await quizz.removeTag(tag);
				res.redirect("/tags");
			} else {
				res.redirect(
					"/admin/tagAssociation?error=Cette association existe déjà"
				);
			}
		} catch (err) {
			console.log(err.message);
			res.redirect("/");
		}
	},
};
