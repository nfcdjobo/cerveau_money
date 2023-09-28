const { DataTypes} = require("sequelize");
module.exports = (param_connect)=>{
    const Frais = param_connect.define("frais", {
        id: {
            type: DataTypes.STRING(20),
            primaryKey: true,
            autoIncrement: false,
            unique: true
        },

        pourcentage: {
            type: DataTypes.FLOAT,
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
    })

    return Frais;
}


