const {Sequelize} = require("sequelize");

// let param_connect = new Sequelize(
//     "sql10649590",
//     "root" ,
//     "",
//     {
//         host: "localhost",
//         port: 3306,
//         dialect: "mariadb",
//         dialectOptions: {
//             timeZone: "Etc/GMT-2"
//         },
//         logging: false
//     }
// );



let param_connect = new Sequelize(
    "cerveaubd_1",
    "cerveaubd",
    "nfcDJ0B0@",
    {
        host: "mysql-cerveaubd.alwaysdata.net",
        port: 3306,
        dialect: "mariadb",
        dialectOptions: {
            timeZone: "Etc/GMT-2"
        },
        logging: false
    }
);

/**mISE EN PLACE DES RELATIONS ***/
const DataBase = {};
DataBase.sequelize = param_connect;
DataBase.Utilisateur = require("../models/utilisateur_model")(param_connect);
DataBase.Frais = require("../models/frais_model")(param_connect);
DataBase.Operation = require("../models/operation_model")(param_connect);
DataBase.Portefeuil = require("../models/portefeuil_model")(param_connect);
DataBase.Rendement = require("../models/rendement_model")(param_connect);
DataBase.Virement = require("../models/virement_model")(param_connect);

DataBase.Retrait = require("../models/retrait_model")(param_connect);


/**Relation One-To-Many de utilisateur et Frais (utilisateur_id)**/
DataBase.Utilisateur.hasMany(DataBase.Frais, {
    foreignKey: {
        name: "utilisateur_id",
        allowNull: false
    }
});
DataBase.Frais.belongsTo(DataBase.Utilisateur,{
    foreignKey: {
        name: "utilisateur_id",
        allowNull: false
    }
});

/**Relation One-To-One de Utilisateur et Portefeuil (utilisateur_id)**/
DataBase.Utilisateur.hasOne(DataBase.Portefeuil, {
    foreignKey: {
        name: "utilisateur_id",
        allowNull: false
    }
});
DataBase.Portefeuil.belongsTo(DataBase.Utilisateur, {
    foreignKey: {
        name: "utilisateur_id",
        allowNull: false
    }
});

/**Relation One-To-One de Utilisateur et Operation (utilisateur_id)**/
DataBase.Utilisateur.hasMany(DataBase.Operation, {
    foreignKey: {
        name: "utilisateur_id",
        allowNull: false
    }
});
DataBase.Operation.belongsTo(DataBase.Utilisateur, {
    foreignKey: {
        name: "utilisateur_id",
        allowNull: false
    }
});

/**Relation One-To-Many de Utilisateur et Virement (expediteur)**/
DataBase.Utilisateur.hasMany(DataBase.Virement, {
    foreignKey: {
        name: "expediteur",
        allowNull: false
    }
});
DataBase.Virement.belongsTo(DataBase.Utilisateur, {
    foreignKey: {
        name: "expediteur",
        allowNull: false
    }
});

/**Relation One-To-Many de Utilisateur et Retrait (expediteur)**/
DataBase.Utilisateur.hasMany(DataBase.Retrait, {
    foreignKey: {
        name: "expediteur",
        allowNull: false
    }
});
DataBase.Retrait.belongsTo(DataBase.Utilisateur, {
    foreignKey: {
        name: "expediteur",
        allowNull: false
    }
});

/**Relation One-To-Many de Utilisateur et Retrait (expediteur)**/
DataBase.Utilisateur.hasMany(DataBase.Retrait, {
    foreignKey: {
        name: "expediteur",
        allowNull: false
    }
});
DataBase.Retrait.belongsTo(DataBase.Utilisateur, {
    foreignKey: {
        name: "expediteur",
        allowNull: false
    }
});

/**Relation One-To-Many de Utilisateur et Retrait (beneficiaire)**/
DataBase.Utilisateur.hasMany(DataBase.Retrait, {
    foreignKey: {
        name: "beneficiaire_id",
        allowNull: false
    }
});
DataBase.Retrait.belongsTo(DataBase.Utilisateur, {
    foreignKey: {
        name: "beneficiaire_id",
        allowNull: false
    }
});

/**Relation One-To-Many de Utilisateur et Virement (beneficiaire)**/
DataBase.Utilisateur.hasMany(DataBase.Virement, {
    foreignKey: {
        name: "beneficiaire",
        allowNull: false
    }
});
DataBase.Virement.belongsTo(DataBase.Utilisateur, {
    foreignKey: {
        name: "beneficiaire",
        allowNull: false
    }
});

/**Relation One-To-Many de Frais et Operation (fraiId)**/
DataBase.Frais.hasMany(DataBase.Operation, {
    foreignKey: {
        name: "frais_id",
        allowNull: false
    }
});
DataBase.Operation.belongsTo(DataBase.Frais, {
    foreignKey: {
        name: "frais_id",
        allowNull: false
    }
});

/**Relation One-To-Many de Frais et Retrait (fraiId)**/
DataBase.Frais.hasMany(DataBase.Retrait, {
    foreignKey: {
        name: "frais_id",
        allowNull: false
    }
});
DataBase.Retrait.belongsTo(DataBase.Frais, {
    foreignKey: {
        name: "frais_id",
        allowNull: false
    }
});

/**Relation One-To-Many de Frais et Virement (fraiId)**/
DataBase.Frais.hasMany(DataBase.Virement, {
    foreignKey: {
        name: "frais_id",
        allowNull: false
    }
});
DataBase.Virement.belongsTo(DataBase.Frais, {
    foreignKey: {
        name: "frais_id",
        allowNull: false
    }
});

/**Relation One-To-Many de Portefeuil et Retrait (portefeuilId)**/
DataBase.Portefeuil.hasMany(DataBase.Retrait, {
    foreignKey: {
        name: "portefeuil_id",
        allowNull: false
    }
});
DataBase.Retrait.belongsTo(DataBase.Portefeuil, {
    foreignKey: {
        name: "portefeuil_id",
        allowNull: false
    }
});

/**Relation One-To-One de Utilisateur et Portefeuil (utilisateur_id)**/
DataBase.Portefeuil.hasOne(DataBase.Rendement, {
    foreignKey: {
        name: "portefeuil_id",
        allowNull: false
    }
});
DataBase.Rendement.belongsTo(DataBase.Portefeuil, {
    foreignKey: {
        name: "portefeuil_id",
        allowNull: false
    }
});

/**Relation One-To-Many de Utilisateur et Virement (beneficiaire)**/
DataBase.Portefeuil.hasMany(DataBase.Virement, {
    foreignKey: {
        name: "expediteurPortefeuil",
        allowNull: false
    }
});
DataBase.Virement.belongsTo(DataBase.Portefeuil, {
    foreignKey: {
        name: "expediteurPortefeuil",
        allowNull: false
    }
});

/**Relation One-To-Many de Utilisateur et Virement (beneficiaire)**/
DataBase.Portefeuil.hasMany(DataBase.Virement, {
    foreignKey: {
        name: "beneficiairePortefeuil",
        allowNull: false
    }
});
DataBase.Virement.belongsTo(DataBase.Portefeuil, {
    foreignKey: {
        name: "beneficiairePortefeuil",
        allowNull: false
    }
});


/**Relation One-To-One de Utilisateur et Portefeuil (utilisateur_id)**/
DataBase.Operation.hasOne(DataBase.Rendement, {
    foreignKey: {
        name: "operation_id",
        allowNull: false
    }
});
DataBase.Rendement.belongsTo(DataBase.Operation, {
    foreignKey: {
        name: "operation_id",
        allowNull: false
    }
});


// param_connect.sync(error=>{console.log("Erreur de synchronisation de la base de données")})

DataBase.sequelize.sync({alter:true})


module.exports = DataBase;
