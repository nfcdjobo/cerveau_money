const DataBase = require("../dbconnexions/db_connexion");
const Operation = DataBase.Operation;
const Utilisateur = DataBase.Utilisateur;
const Portefeuil = DataBase.Portefeuil;
const Frais = DataBase.Frais;
const bcrypt = require("bcrypt");
const generateRandomString = require("../laboratoire/generateRandomString");
const Virement = DataBase.Virement;
const chaine = "azertyuiopqsdfghjklmwxcvbn0123456789";
const nodemailer = require("nodemailer");
const transporteur = require("../mailling/transporteur");
const rapport_transation = require("../mailling/rapport_transation");
const rapport_reception = require("../mailling/rapport_reception");
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

class VirementController {
    static async create(req, res) {
        try {
            Utilisateur.findOne({ where: { id: req.auth.id, email: req.auth.email } })
            .then(utilisateur => {
                if (!utilisateur) return res.status(201).json({ message: "Votre n'est pas authorisé(e) à effectuer cette demande !" });
                bcrypt.compare(req.body.password, utilisateur.password)
                    .then(isPass => {
                        if (!isPass) return res.status(201).json({ message: "Votre mot de passe n'est pas correct !" });
                        bcrypt.compare(req.body.secret, utilisateur.secret)
                            .then(isSecretCode => {
                                if (!isSecretCode) return res.status(201).json({ message: "Votre code sécret de sécurité n'est pas correct !" });
                                Portefeuil.findOne({ where: { utilisateur_id: utilisateur.id }, include: Utilisateur })
                                    .then(portefeuilExpediteur => {
                                        if (!portefeuilExpediteur) return res.status(201).json({ message: "Service momentanement interrompu, veuillez réessayer plus tard !" });
                                        Portefeuil.findOne({ where: { numero_compte: req.body.numero_compte }, include: Utilisateur })
                                            .then(portefeuilBeneficiaire => {
                                                if (!portefeuilBeneficiaire) return res.status(201).json({ message: "Service momentanement interrompu, veuillez réessayer plus tard !" });
                                                Frais.findAll()
                                                    .then(frais => {
                                                        if (frais[0]) {
                                                            const soldeExpediteir = Number(portefeuilExpediteur.solde);
                                                            const soldeBeneficiaire = Number(portefeuilBeneficiaire.solde);
                                                            const fraisTransaction = Number(frais[0].pourcentage);
                                                            let soldeActuelBeneficiaire = null;
                                                            let soldeActuExpeduteur = null;
                                                            let interet = null;

                                                            if (soldeExpediteir >= (Number(req.body.montant) + Number(req.body.montant) * fraisTransaction / 100)) {
                                                                soldeActuExpeduteur = soldeExpediteir - (Number(req.body.montant) + Number(req.body.montant) * fraisTransaction / 100);
                                                                soldeActuelBeneficiaire = soldeBeneficiaire + Number(req.body.montant);
                                                                interet = Number(req.body.montant) * fraisTransaction / 100;

                                                                Portefeuil.update({ solde: soldeActuExpeduteur }, { where: { utilisateur_id: utilisateur.id } })
                                                                    .then(debite => {
                                                                        if (debite[0]) {
                                                                            Portefeuil.update({ solde: soldeActuelBeneficiaire }, { where: { numero_compte: req.body.numero_compte } })
                                                                                .then(credite => {
                                                                                    if (credite[0]) {
                                                                                        const dataVirement = {
                                                                                            id: "CERVE" + generateRandomString(chaine, 15),
                                                                                            montant: Number(req.body.montant),
                                                                                            expediteur: utilisateur.id,
                                                                                            expediteurNumber: portefeuilExpediteur.numero_compte,
                                                                                            expediteurPortefeuil: portefeuilExpediteur.id,
                                                                                            beneficiaire: portefeuilBeneficiaire.utilisateur.id,
                                                                                            beneficiaireNumber: portefeuilBeneficiaire.numero_compte,
                                                                                            beneficiairePortefeuil: portefeuilBeneficiaire.id,
                                                                                            frais_id: frais[0].id,
                                                                                            reference: "REF" + generateRandomString("0123456789", 32)
                                                                                        }

                                                                                        Virement.create(dataVirement)
                                                                                            .then(virement => {
                                                                                                const dataOperation = {
                                                                                                    id: "CERVE" + generateRandomString(chaine, 15),
                                                                                                    libelle: "TRANSACTION",
                                                                                                    frais_id: frais[0].id,
                                                                                                    utilisateur_id: utilisateur.id,
                                                                                                }
                                                                                                Operation.create(dataOperation)
                                                                                                    .then(operation => {
                                                                                                        const donneEmail = {
                                                                                                            nomExpediteur: portefeuilExpediteur.utilisateur.nom,
                                                                                                            prenomExpediteur: portefeuilExpediteur.utilisateur.prenom,
                                                                                                            montant: dataVirement.montant,
                                                                                                            beneficiaire: portefeuilBeneficiaire.numero_compte,
                                                                                                            nomBeneficiaire: portefeuilBeneficiaire.utilisateur.nom,
                                                                                                            prenomBeneficiaire: portefeuilBeneficiaire.utilisateur.prenom,
                                                                                                            dateVirement: new Date().toLocaleString('fr-FR', { timeZone: 'UTC' }),
                                                                                                            reference: virement.reference,
                                                                                                            nouveauSolde: soldeActuExpeduteur,
                                                                                                            plateforme: "CERVEAU NMONEY"
                                                                                                        }

                                                                                                        const connection = transporteur(nodemailer, "smtp-mail.outlook.com", 587, false, { ciphers: "SSLv3" }, { user: "devdjobo@outlook.com", pass: "nfcDJ0B0@" });
                                                                                                        connection.sendMail({
                                                                                                            from: `"Cerveau Money" <devdjobo@outlook.com>`,
                                                                                                            to: portefeuilExpediteur.utilisateur.email,
                                                                                                            subject: "RAPPORT DE TRANSACTION",
                                                                                                            html: rapport_transation(donneEmail)
                                                                                                        })
                                                                                                            .then(() => {
                                                                                                                const donneEmails = {
                                                                                                                    nomBene: portefeuilBeneficiaire.utilisateur.nom,
                                                                                                                    prenomBene: portefeuilBeneficiaire.utilisateur.prenom,
                                                                                                                    montant: dataVirement.montant,
                                                                                                                    expediteur: portefeuilExpediteur.numero_compte,
                                                                                                                    nomExpediteur: portefeuilExpediteur.utilisateur.nom,
                                                                                                                    prenomExpediteur: portefeuilExpediteur.utilisateur.prenom,
                                                                                                                    dateVirement: new Date().toLocaleString('fr-FR', { timeZone: 'UTC' }),
                                                                                                                    reference: virement.reference,
                                                                                                                    nouveauSolde: soldeActuelBeneficiaire,
                                                                                                                    plateforme: "CERVEAU NMONEY"
                                                                                                                }
                                                                                                                connection.sendMail({
                                                                                                                    from: `"Cerveau Money" <devdjobo@outlook.com>`,
                                                                                                                    to: portefeuilBeneficiaire.utilisateur.email,
                                                                                                                    subject: "RAPPORT DE RECEPTION",
                                                                                                                    html: rapport_reception(donneEmails)
                                                                                                                })
                                                                                                                    .then((em) => {
                                                                                                                        const result = {
                                                                                                                            montant: dataVirement.montant,
                                                                                                                            numero_compteBeneficiaire: portefeuilBeneficiaire.numero_compte,
                                                                                                                            nomPrenomBeneficiaire: portefeuilBeneficiaire.utilisateur.nom + " " + portefeuilBeneficiaire.utilisateur.prenom,
                                                                                                                            nouveauSolde: soldeActuExpeduteur,
                                                                                                                            dateVirement: donneEmail.dateVirement,
                                                                                                                            reference: donneEmail.reference

                                                                                                                        }
                                                                                                                        res.status(202).json({ result })

                                                                                                                    })
                                                                                                                    .catch(error => {
                                                                                                                        console.log(error)
                                                                                                                        res.status(400).json({ error: "Connexion interrompue." });
                                                                                                                    })
                                                                                                            })
                                                                                                            .catch(error => {
                                                                                                                console.log(error)
                                                                                                                res.status(400).json({ error: "Connexion interrompue." });
                                                                                                            })
                                                                                                    })
                                                                                                    .catch(error => {
                                                                                                        console.log(error)
                                                                                                        res.status(400).json({ error: "Connexion interrompue." });
                                                                                                    })
                                                                                            })
                                                                                            .catch(error => {
                                                                                                console.log(error)
                                                                                                res.status(400).json({ error: "Connexion interrompue." });
                                                                                            })
                                                                                    }
                                                                                })
                                                                                .catch(error => {
                                                                                    console.log(error)
                                                                                    res.status(400).json({ error: "Connexion interrompue." });
                                                                                })
                                                                        }
                                                                    })
                                                                    .catch(error => {
                                                                        console.log(error)
                                                                        res.status(400).json({ error: "Connexion interrompue." });
                                                                    })

                                                            }
                                                        }
                                                    })
                                                    .catch(error => {
                                                        console.log(error)
                                                        res.status(400).json({ error: "Connexion interrompue." });
                                                    })
                                            })
                                            .catch(error => {
                                                console.log(error)
                                                res.status(400).json({ error: "Connexion interrompue." });
                                            })
                                    })
                                    .catch(error => {
                                        console.log(error)
                                        res.status(400).json({ error: "Connexion interrompue." });
                                    })

                            })
                            .catch(error => {
                                console.log(error)
                                res.status(400).json({ error: "Connexion interrompue." });
                            })
                    })
                    .catch(error => {
                        console.log(error)
                        res.status(400).json({ error: "Connexion interrompue." });
                    })
            })
            .catch(error => {
                console.log(error)
                res.status(400).json({ error: "Connexion interrompue." });
            })
        } catch (error) {
            console.log(error)
            res.status(400).json({ error: "Connexion interrompue." });
        }
    }


    static async getTransaction(req, res){
        try {
            Utilisateur.findOne({where:{id:req.auth.id, email:req.auth.email}})
            .then(utilisateur=>{
                if(!utilisateur) return res.json({message: "Vous n'avez authorisation"});
                Virement.findAll({where:{expediteur:req.auth.id}, include:DataBase.Utilisateur})
                // Virement.findAll({where:{expediteur:req.auth.id}, include:'expediteur'})
                .then(virement=>{
                    res.status(202).json({virement})
                })
                .catch(error => {
                    console.log(error)
                    res.status(400).json({ error: "Connexion interrompue." });
                })
            })
            .catch(error => {
                console.log(error)
                res.status(400).json({ error: "Connexion interrompue." });
            })
        } catch (error) {
            res.status(501).json({error})
        }
    }

    static async getReception(req, res){
        try {
           
            Utilisateur.findOne({where:{id:req.auth.id, email:req.auth.email}})
            .then(utilisateur=>{
                
                if(!utilisateur) return res.json({message: "Vous n'avez authorisation"});
                Virement.findAll({where:{beneficiaire:req.auth.id}, include:DataBase.Utilisateur})
                .then(virement=>{
                    res.status(202).json({virement})
                })
                .catch(error => {
                    console.log(error)
                    res.status(400).json({ error: "Connexion interrompue." });
                })
            })
            .catch(error => {
                console.log(error)
                res.status(400).json({ error: "Connexion interrompue." });
            })
        } catch (error) {
            res.status(501).json({error})
        }
    }
}

module.exports = VirementController;