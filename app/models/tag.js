import { sequelize } from "../database";
import { DataTypes, Model } from "sequelize";

class Tag extends Model {}

Tag.init(
	{
		name: DataTypes.TEXT,
		color: DataTypes.TEXT,
	},
	{
		sequelize,
		tableName: "tag",
	}
);

module.exports = Tag;
