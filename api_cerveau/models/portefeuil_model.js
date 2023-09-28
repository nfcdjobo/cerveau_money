const { DataTypes} = require("sequelize");

module.exports = (param_connect)=>{
    const Portefeuil = param_connect.define("portefeuil", {
        id: {
            type: DataTypes.STRING(20),
            primaryKey: true,
            autoIncrement: false,
            unique: true
        },

        solde: {
            type: DataTypes.FLOAT,
            allowNull: false
        },

        numero_compte: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        
        utilisateur_id: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        img_code_qr: {
            type: DataTypes.STRING
        }
    },
    {
        timestamps: true,
        paranoid: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        deletedAt: "deleted_at"
    });

    return Portefeuil;
}


