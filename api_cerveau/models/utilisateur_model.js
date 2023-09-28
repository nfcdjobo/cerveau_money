const {DataTypes} = require("sequelize");

module.exports = (param_connect)=>{
        const Utilisateur = param_connect.define('utilisateur', {
            id: {
                type: DataTypes.STRING(20),
                primaryKey: true,
                autoIncrement: false,
                unique: true
            },
    
            nom: {
                type: DataTypes.STRING,
                allowNull: false
            },
    
            prenom: {
                type: DataTypes.STRING,
                allowNull: false
            },

            naissance: {
                type: DataTypes.DATE,
                allowNull: false
            },
            
            email: {
                type: DataTypes.TEXT,
                allowNull: false,
                unique: false
            },
    
            telephone: {
                type: DataTypes.STRING(20),
                allowNull: false
            },
    
            statut:{
                type: DataTypes.INTEGER,
                allowNull: false
            },
    
            secret: {
                type: DataTypes.STRING,
                allowNull: false
            },
    
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },

            pays: {
                type: DataTypes.STRING,
                allowNull: false
            },

            nationalite: {
                type: DataTypes.STRING,
                allowNull: false
            },
            
        },
    
        {
            timestamps: true,
            paranoid: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            deletedAt: "deleted_at"
        })
    
    return Utilisateur;
}

// module.exports =  Utilisateur;