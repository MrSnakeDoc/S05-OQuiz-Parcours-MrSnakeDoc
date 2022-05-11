import { sequelize } from "../database";
import { DataTypes, Model } from "sequelize";

class Quizz extends Model {}

Quizz.init(
	{
		title: DataTypes.TEXT,
		description: DataTypes.TEXT,
	},
	{
		sequelize,
		tableName: "quizz",
	}
);

module.exports = Quizz;
