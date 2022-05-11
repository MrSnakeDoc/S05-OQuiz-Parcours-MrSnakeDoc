import { sequelize } from "../database";
import { DataTypes, Model } from "sequelize";

class Answer extends Model {}

Answer.init(
	{
		description: DataTypes.TEXT,
	},
	{
		sequelize,
		tableName: "answer",
	}
);
module.exports = Answer;
