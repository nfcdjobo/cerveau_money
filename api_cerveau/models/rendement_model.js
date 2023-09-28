const { DataTypes} = require("sequelize");
module.exports = (param_connect)=>{
    const Rendement = param_connect.define("rendement", {
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

        portefeuil_id:{
            type:DataTypes.STRING(20),
            allowNull: false
        },

        operation_id:{
            type:DataTypes.STRING(20),
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

    return Rendement;
}
