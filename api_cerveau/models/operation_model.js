const {DataTypes} = require("sequelize");
// const param_connect = require("../dbconnexions/db_connexion");
const Utilisateur = require("./utilisateur_model");
const Frais = require("./frais_model");


module.exports = (param_connect)=>{
    const Operation = param_connect.define("operation",{
        id: {
            type: DataTypes.STRING(20),
            primaryKey: true,
            autoIncrement: false,
            unique: true
        },

        libelle: {
            type: DataTypes.STRING,
            allowNull: false
        },

        frais_id: {
            type: DataTypes.STRING,
            allowNull: false
        },

        utilisateur_id: {
            type: DataTypes.STRING(20),
            allowNull: false
        }
    },
    {
        timestamps: true,
        paranoid: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        deletedAt: "deleted_at"
    }
);

return Operation
} 
