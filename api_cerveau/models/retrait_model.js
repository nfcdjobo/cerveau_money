const { DataTypes} = require("sequelize");

module.exports = (param_connect)=>{
    const Retrait = param_connect.define("retrait", {
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
            type: DataTypes.STRING(30),
            allowNull: false
        },
        
        portefeuil_id: {
            type: DataTypes.STRING(20),
            allowNull: false
        },

        expediteur: {
            type: DataTypes.STRING(20),
            allowNull: false
        },

        frais_id: {
            type: DataTypes.STRING(20),
            allowNull: false
        },

        beneficiaire: {
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

    return Retrait;
}
