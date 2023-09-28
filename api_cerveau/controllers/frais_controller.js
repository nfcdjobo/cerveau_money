const { Op } = require("sequelize");
const DataBase = require("../dbconnexions/db_connexion");
const generateRandomString = require("../laboratoire/generateRandomString");
const chaine = "0123456789azertyuiopqsdfghjklmwxcvbn";
const Frais = DataBase.Frais;
const Utilisateur = DataBase.Utilisateur;
generateRandomString

class FraisController {
    static async createFeesOrUpdateFees(req, res) {
        try {
            Utilisateur.findOne({
                where: {
                    [Op.and]: [
                        { id: req.auth.id },
                        { email: req.auth.email }
                    ]
                }
            })
                .then(utilisateur => {
                    if (!utilisateur) return res.status(201).json({ message: "Mot de passe ou email incorrect !" });
                    Frais.findAll()
                        .then(allFrais => {
                            if (!allFrais.length) {
                                req.body.id = "CERVE" + generateRandomString(chaine, 15);
                                req.body.pourcentage = Number(req.body.pourcentage);
                                req.body.utilisateur_id = utilisateur.id;
                                Frais.create(req.body)
                                    .then(frais => {
                                        res.status(202).json({ frais });
                                    })
                                    .catch(error => {
                                        console.log("...............................1", error);
                                        res.status(400).json({ message: "Service momentanement intérrompu, veuillez réessayer plus tard !" });
                                    })
                            } else {
                                const fr = allFrais[0];
                                req.body.pourcentage = Number(req.body.pourcentage);
                                req.body.utilisateur_id = utilisateur.id;
                                Frais.update({ pourcentage: req.body.pourcentage, utilisateur_id: req.auth.id }, { where: { id: fr.id } })
                                    .then(newFees => {
                                        Frais.findOne({ where: { id: fr.id }, include: DataBase.Utilisateur })
                                        .then(frais => res.status(201).json({ frais }))
                                    })
                                    .catch(error => {
                                        console.log("...............................2", error);
                                        res.status(400).json({ message: "Service momentanement intérrompu, veuillez réessayer plus tard !" });
                                    })
                            }
                        })
                        .catch(error => {
                            console.log("...............................3", error);
                            res.status(400).json({ message: "Service momentanement intérrompu, veuillez réessayer plus tard !" });
                        })
                })
        } catch (error) {
            console.log("...............................4", error);
            res.status(501).json({ message: "Service momentanement intérrompu, veuillez réessayer plus tard !" });
        }
    }


    static async getAllFees(req, res){
        Frais.findAll({include: DataBase.Utilisateur})
        .then(allFrais=>{
            const frais = allFrais[0]
            if(frais) return res.status(200).json({frais})
            res.status(202).json({message: "Aucun frais"});
        })
        .catch(error => {
            console.log("...............................3", error);
            res.status(400).json({ message: "Service momentanement intérrompu, veuillez réessayer plus tard !" });
        })
    }
}

module.exports = FraisController;