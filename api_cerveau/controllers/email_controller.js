const DataBase = require("../dbconnexions/db_connexion");
const transporteur = require("../mailling/transporteur");
const generateRandomString = require("../laboratoire/generateRandomString");
const nodemailer = require("nodemailer");
const connect_transfert_email = require("../laboratoire/transmettre_email");
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
            
            Utilisateur.findOne({where: {email: req.body.email}})
            .then(user=>{
                
                if(user) return res.status(200).json({error: "Ce compte est déjè utilisé."});
                
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
                    console.log("*******************************", {code});
                    res.status(201).json({code});
                })
                .catch(error=>{
                    console.log(error)
                    res.status(400).json({error: "Connexion interrompue."});
                })
            })
            .catch(error=>{
                res.status(400).json({error: "Connexion échouée."});
            })
            
        } catch (error) {
            res.status(501).json({error:"Connexion échouée."});
        }
    }

    

    static async emailRegister(req, res){
        
    }

    static async senderTwo(req, res){
        // try {
        //     const type = req.body.type;
        //     const conten_email = type === "code" ? format_code_html : type === "authent" ? auth_html : format_information_html;
        //     Configuration.findAll()
        //     .then( info=>{
        //         if(info.length == 1){
        //             const connection = transporteur(nodemailer, "smtp-mail.outlook.com", 587, false, {ciphers:"SSLv3"},  { user: info[0].email_1, pass: 'nfcDJ0B0@' });
        //             Email_Code.findAll()
        //             .then(async data_email=>{
        //                 if(data_email.length===1){
        //                     req.body.subject=data_email[0].suject;
        //                     req.body.salutation = data_email[0].formule_accueil;
        //                     req.body.contenue = data_email[0].contenu;
        //                     req.body.code = generateRandomString("0123456789", 6);
        //                     req.body.fin = data_email[0].formule_politexte;
        //                     req.body.plateforme_name = info[0].raison_sociale;
        //                     const respEmail = await connection.sendMail({
        //                         from: `"${info[0].raison_sociale}" <${info[0].email_1}>`,
        //                         to: req.body.email,
        //                         subject: req.body.subject,
        //                         html: conten_email(req.body)
        //                     }, (error, info)=>{
        //                         if(error){
        //                             console.log("E-mail non envoyé", error, "ERROR");
        //                             res.status(400).json({error});
        //                         }else{
        //                             console.log("E-mail envoyé"+info.response);
        //                             res.status(202).json({code: req.body.code});
        //                         }
        //                     });
        //                 }
        //             })
        //             .catch(error=>res.status(500).json({message: "Service momentanement indisponible", error:error}))
        //         }else{
        //             res.status(201).json({message: "Expéditeur non trouvé !!"})
        //         }
        //     })
        //     .catch(error => {
        //         res.status(504).json({error});
        //     });
        // }catch (error) {
        //     console.log("Erreur survenue lors de l'envoie de l'email", error.message);
        //     res.status(504).json({error});
        // }
    }
}

module.exports = EmailController;