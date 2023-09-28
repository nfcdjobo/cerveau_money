const { DataTypes} = require("sequelize");

module.exports = (param_connect)=>{
    const Virement = param_connect.define("virement", {
        id: {
            type: DataTypes.STRING(20),
            primaryKey: true,
            autoIncrement: false,
            unique: true
        },

        montant: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        reference: {
            type: DataTypes.STRING(35),
            allowNull: false
        },

        expediteur: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        expediteurNumber: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        expediteurPortefeuil: {
            type: DataTypes.STRING(20),
            allowNull: false
        },

        beneficiaire: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        beneficiaireNumber: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        beneficiairePortefeuil: {
            type: DataTypes.STRING(20),
            allowNull: false
        },

        frais_id: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
    },
    {
        timestamps: true,
        paranoid: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        deletedAt: "deleted_at"
    });

    return Virement;
}

