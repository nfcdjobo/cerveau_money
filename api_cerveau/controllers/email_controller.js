const DataBase = require("../dbconnexions/db_connexion");
const transporteur = require("../mailling/transporteur");
const generateRandomString = require("../laboratoire/generateRandomString");
const nodemailer = require("nodemailer");
const code_auth = require("../mailling/code_auth");

// const { Connecteur, Transmetteur } = require("../laboratoire/transmettre_email");
const Utilisateur = DataBase.Utilisateur;

const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false,
    tls:{
        ciphers: "SSLv3"
    },
    auth: {
      user: 'sage.haley@ethereal.email',
      pass: 'RjVJtcx44fxzvx46qE'
    }
  });

class EmailController{
    static async sendCodeEmail(req, res){
        try {
            console.log("------------------------------body", req.body);
            Utilisateur.findOne({where: {email: req.body.email}})
            .then(user=>{
                console.log("------------------------------1 user", user);
                if(user) return res.status(200).json({error: "Ce compte est déjè utilisé."});

                console.log("------------------------------2 user", user);
                const code = generateRandomString("0123456789", 6);
                const donneEmail={
                    email:req.body.email,
                    nom:req.body.nom,
                    prenom:req.body.prenom,
                    plateforme:"Cerveau Money",
                    code:code
                };
                const connection = transporteur(nodemailer, "smtp-mail.outlook.com", 587, false, {ciphers:"SSLv3"}, { user: "devdjobo@outlook.com", pass: "nfcDJ0B0@"});
                connection.sendMail({
                    from: `"Cerveau Money" <devdjobo@outlook.com>`,
                    to: req.body.email,
                    subject:"VALIDATION DE SECURITE",
                    html: code_auth(donneEmail)
                })
                .then(email=>{
                    console.log("------------------------------email", email);
                    console.log("*******************************", {code});
                    res.status(201).json({code});
                })
                .catch(error=>{
                    console.log("------------------------------Connexion interrompue. email error", error);
                    res.status(400).json({error: "Connexion interrompue."});
                })
            })
            .catch(error=>{
                console.log("------------------------------Connexion échouée 1. email error", error);
                res.status(400).json({error: "Connexion échouée."});
            })
            
        } catch (error) {
            console.log("------------------------------Connexion échouée 2. email error", error);
            res.status(501).json({error:"Connexion échouée."});
        }
    }
}

module.exports = EmailController;