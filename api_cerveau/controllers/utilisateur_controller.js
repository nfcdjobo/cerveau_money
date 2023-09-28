const DataBase = require("../dbconnexions/db_connexion");
const generateRandomString = require("../laboratoire/generateRandomString");
const bcrypt = require("bcrypt");
const chaine = "0123456789azertyuiopqsdfghjklmwxcvbn";
const transporteur = require("../mailling/transporteur");
const auth_html = require("../mailling/auth_html");
const nodemailer = require("nodemailer");
const QRcode = require("qrcode");
const path = require("path");



const Utilisateur = DataBase.Utilisateur;
const Portefeuil = DataBase.Portefeuil;

class UtilisateurController{
    static async create(req, res){
        try {
            let codigo=req.body.password;
            let secret=generateRandomString("0123456789", 30);
            if(req.body.password.length < 8) return res.status(400).json({errorPass:"Mot de passe trop court"});
            Utilisateur.findOne({where:{email:req.body.email}})
            .then(user=>{
                if(user) return res.status(200).json({message: "Email déjà utilisé"});
                bcrypt.hash(req.body.password, 10)
                .then(password=>{
                    bcrypt.hash(secret, 10)
                    .then(code=>{
                        req.body.statut=1;
                        req.body.password=password;
                        req.body.secret=code;
                        req.body.id="USER"+generateRandomString(chaine, 16);
                        Utilisateur.create(req.body)
                        .then(newUser=>{
                            const data={
                                id:"PORT"+generateRandomString(chaine, 16),
                                solde:0,
                                numero_compte:generateRandomString(chaine, 30),
                                utilisateur_id:newUser.id
                            };

                            Portefeuil.create(data)
                            .then(portefeuil=>{
                                const dataQRcode={
                                    id:newUser.id,
                                    nom: newUser.nom,
                                    prenom: newUser.prenom,
                                    email:newUser.email,
                                    secret: newUser.secret,
                                    password: newUser.password,
                                    numero_compte:portefeuil.numero_compte
                                };

                                const imag_QRcode= "stockage/QRcode/"+generateRandomString(chaine, 100)+".png";
                                const img_code_qr = req.protocol+"://"+req.get("host")+"/"+imag_QRcode;
                                QRcode.toFile(imag_QRcode, JSON.stringify(dataQRcode))
                                .then(createQRcode=>{
                                    if(!createQRcode){
                                        Portefeuil.update({img_code_qr}, {where:{id:portefeuil.id}})
                                        .then(newPortefeuil=>{
                                            const donneEmail={
                                                email:newUser.email,
                                                nom:newUser.nom,
                                                prenom:newUser.prenom,
                                                password:codigo,
                                                codeSecurite:secret,
                                                numeroCompte:portefeuil.numero_compte,
                                                soldeActu:portefeuil.solde,
                                                plateforme:"Cerveau Money"
                                            };
                                            const connection = transporteur(nodemailer, "smtp-mail.outlook.com", 587, false, {ciphers:"SSLv3"}, { user: "devdjobo@outlook.com", pass: "nfcDJ0B0@"});
                                            connection.sendMail({
                                                from: `"Cerveau Money" <devdjobo@outlook.com>`,
                                                to: newUser.email,
                                                subject:"VALIDATION DE SECURITE",
                                                html: auth_html(donneEmail)
                                            })
                                            .then(async rapport=>{
                                                res.status(201).json({rapport, utilisateur:{nom:newUser.nom, prenom: newUser.prenom, email: newUser.email}});
                                            })
                                            .catch(error=>{
                                                console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr",error);
                                                res.status(400).json({error: "Connexion intérrompue."});
                                            })
                                        })
                                        .catch(error=>{
                                            console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",error);
                                            res.status(400).json({error: "Connexion intérrompue."});
                                        })
                                    }
                                })
                                .catch(error=>{
                                    console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz",error)
                                    res.status(400).json({error: "Connexion intérrompue."});
                                })
                            })
                            .catch(error=>{
                                console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaa",error);
                                res.status(400).json({error: "Connexion intérrompue."});
                            })
                            
                        })
                        .catch(error=>{
                            console.log("oooooooooooooooooooooooooooooooooooo",error);
                            res.status(400).json({error: "Service momentanement intérrompu, veuillez réessayer plus tard !"});
                        })
                    })
                    .catch(error=>{
                        console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj",error);
                        res.status(400).json({error: "Service momentanement intérrompu, veuillez réessayer plus tard !"});
                    })
                })
                .catch(error=>{
                    console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",error);
                    res.status(400).json({error: "Service momentanement intérrompu, veuillez réessayer plus tard !"});
                })
            })
            .catch(error=>{
                console.log("qqqqqqqqqqqqqqqqqqqqqqqqqqqq",error);
                res.status(400).json({error: "Service momentanement intérrompu, veuillez réessayer plus tard !"});
            })
        } catch (error) {
            console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",error);
            res.status(501).json({error: "Service momentanement intérrompu, veuillez réessayer plus tard !"});
        } 
    }


    static async verifyPassword(req, res){
        try {
            Utilisateur.findOne({where:{id: req.auth.id, email: req.auth.email}})
            .then(utilisateur=>{
                if(!utilisateur) return res.status(201).json({message: "Mot de passe ou email incorrect !"});
                bcrypt.compare(req.params.password, utilisateur.password)
                .then(result=>{
                    if(!result) return res.status(201).json({message: "Votre mot de passe est incorrect !"});
                    console.log("............................................................")
                    res.status(201).json({utilisateur});
                })
                .catch(error=>{
                    console.log("...............................0", error)
                    res.status(400).json({message: "Service momentanement intérrompu, veuillez réessayer plus tard !"});
                })
            })
            .catch((error)=>{
                console.log("...............................1", error)
                res.status(400).json({message: "Service momentanement intérrompu, veuillez réessayer plus tard !"});
            })
        } catch (error) {
            console.log("...............................2", error)
            res.status(501).json({message: "Service momentanement intérrompu, veuillez réessayer plus tard !"});
        }
    }


    static async verifySecretCode(req, res){
        try {
            Utilisateur.findOne({where:{id: req.auth.id, email: req.auth.email}})
            .then(utilisateur=>{
                if(!utilisateur) return res.status(201).json({message: "Mot de passe ou email incorrect !"});
                bcrypt.compare(req.params.secret, utilisateur.secret)
                .then(result=>{
                    if(!result) return res.status(201).json({message: "Votre code sécret de sécurité est incorrect !"});
                    res.status(201).json({utilisateur});
                })
                .catch(error=>{
                    console.log("...............................0", error)
                    res.status(400).json({message: "Service momentanement intérrompu, veuillez réessayer plus tard !"});
                })
            })
            .catch((error)=>{
                console.log("...............................1", error)
                res.status(400).json({message: "Service momentanement intérrompu, veuillez réessayer plus tard !"});
            })
        } catch (error) {
            console.log("...............................2", error)
            res.status(501).json({message: "Service momentanement intérrompu, veuillez réessayer plus tard !"});
        }
    }
}

module.exports = UtilisateurController;