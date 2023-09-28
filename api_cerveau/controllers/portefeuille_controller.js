const DataBase = require("../dbconnexions/db_connexion");
const Portefeuil = DataBase.Portefeuil;
const Utilisateur = DataBase.Utilisateur;
const { Op } = require("sequelize");

class PortefeuilleController{
    static async getPortefeuil(req, res){
        try {
            Portefeuil.findOne({where:{id:req.auth.portefeuil}, include: DataBase.Utilisateur})
            .then(portefeuil => {
                if(!portefeuil) return res.status(201).json({message: "Ce utilisateur n'existe pas."});
                res.status(202).json({portefeuil})
            })
            .catch(error=> res.status(400).json({message: "Ce utilisateur n'existe pas."}))
        } catch (error) {
            res.status(502).json({error: "Ce utilisateur n'existe pas."});
        }
        
    }


    static async findCountByNumber(req, res){
        try {
            Utilisateur.findOne({where: {email: req.auth.email, id: req.auth.id}})
            .then(utilisateur=>{
                
                if(!utilisateur) return res.status(203).json({message:"Mot de passe ou email incorrect"});
                Portefeuil.findOne({
                    where: {
                        numero_compte:{ [Op.eq]: req.params.numero_compte }
                    },
                    include: Utilisateur
                })
                .then(portefeuil=>{
                    if(!portefeuil) return res.status(201).json({message: "Numéro de compte incorrect !"});
                    res.status(202).json({portefeuil});
                })
                .catch(()=>res.status(401).json({message: "Compte introuvable !"}));
            })
            .catch(()=>res.status(401).json({message: "Compte introuvable !"}))
        } catch (error) {
            res.status(502).json({message: "Ce utilisateur n'existe pas."});
        }
    }
}

module.exports = PortefeuilleController;