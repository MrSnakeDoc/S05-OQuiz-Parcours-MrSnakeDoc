import { sequelize } from "../database";
import { DataTypes, Model } from "sequelize";

class Level extends Model {}

Level.init(
	{
		name: DataTypes.TEXT,
	},
	{
		sequelize,
		tableName: "level",
	}
);

module.exports = Level;
