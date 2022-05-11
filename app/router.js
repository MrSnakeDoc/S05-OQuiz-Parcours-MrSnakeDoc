import express from "express";
import { mainController } from "./controllers/mainController";
import { sessionController } from "./controllers/sessionController";
import { adminController } from "./controllers/adminController";
import connectedMW from "./middlewares/connectedMW";
import adminMW from "./middlewares/adminMW";

export const router = express.Router();

router
	.use(express.static("./app/public"))
	.use("/favicon.ico", function (req, res) {
		res.status(204);
		res.end();
	});

router
	.get("/", mainController.root)
	.get("/signup", mainController.signMeUp)
	.get("/login", mainController.logMeUp)
	.get("/quizz/:id", mainController.quizzPage)
	.get("/tags", mainController.tagsPage)
	.get("/tag/:tag", mainController.tagContentPage)
	.get("/error/register", mainController.errorRegister)
	.get("/logout", sessionController.disconnect)
	.get("/admin", adminMW, adminController.showInterface)
	.get("/admin/addTag", adminMW, adminController.addTag)
	.get("/profil", connectedMW, mainController.profil)
	.get("/profil/update", connectedMW, mainController.updateProfil)
	.get("/admin/tagUpdate", adminMW, mainController.tagUpdate)
	.get("/admin/tagAssociation", adminMW, mainController.tagAssociation)
	.get("/admin/tagDelete", adminMW, mainController.deleteTagPage)
	.get("/admin/tagDeassociation", adminMW, mainController.tagDeassociationPage);

router
	.post("/signup", sessionController.signUp)
	.post("/login", sessionController.logIn)
	.post("/delete", connectedMW, sessionController.delete)
	.post("/answers/:id", connectedMW, mainController.answers)
	.post("/profil/update", connectedMW, sessionController.update)
	.post("/admin/addTag", adminMW, adminController.addTagPost)
	.post("/admin/tagUpdate", adminMW, adminController.tagUpdate)
	.post("/admin/tagAssociation", adminMW, adminController.tagAssociation)
	.post("/admin/tagDelete", adminMW, adminController.deleteTag)
	.post("/admin/tagDeassociation", adminMW, adminController.tagDeassociation);
