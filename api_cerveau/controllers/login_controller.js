const { verify_password } = require("../laboratoire/hash");
const { sign_token } = require("../middelwares/auth");
const DataBase = require("../dbconnexions/db_connexion");
const { getMaxListeners } = require("nodemailer/lib/xoauth2");

const Utilisateur = DataBase.Utilisateur;
const Portefeuil = DataBase.Portefeuil;

class LoginController{
    static async login(req, res){
        try {
            Utilisateur.findOne({where: {email: req.body.email}})
            .then(utilisateur => {
                if(!utilisateur) return res.status(201).json({message: "Mot de passe ou email incorrect"})
                verify_password(req.body.password, utilisateur.password)
                .then(hash => {
                    if(!hash) return res.status(200).json({message: "Mot de passe ou email incorrect"});
                    verify_password(req.body.secret, utilisateur.secret)
                    .then(hash_secret=>{
                        if(!hash_secret) return res.status(200).json({message: "Mot de passe ou code de sécurité incorrect"});
                        Portefeuil.findOne({where: {utilisateur_id: utilisateur.id}})
                        .then(portefeuil=>{
                            if(portefeuil){
                                res.status(200).json({email: utilisateur.email, portefeuil: portefeuil.id, token: `token ${sign_token({id:utilisateur.id,email:utilisateur.email, portefeuil: portefeuil.id})}`});
                            }
                        })
                        
                    })
                })
            })
        } catch (error) {
            console.log(error);
            res.status(501).json({error})
        }
    }
}

module.exports = LoginController;
