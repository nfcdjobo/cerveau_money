const express = require("express");
const fs = require("fs")
const Router = express.Router();
const { verify_token } = require("../middelwares/auth");
const chargement = require("../middelwares/updoad");
const UtilisateurController = require("../controllers/utilisateur_controller");
const EmailController = require("../controllers/email_controller");
const LoginController = require("../controllers/login_controller");
const PortefeuilleController = require("../controllers/portefeuille_controller");
const FraisController = require("../controllers/frais_controller");
const VirementController = require("../controllers/virement_controller");

Router.get("/", (req, res)=>{
    res.send(
        "<h1 style='margin:15rem auto; width: 150px; padding:1.5rem; color:red; font-size:1.8rem; border; 2px solid blue; font-weight:bolder'>WELCOM TO CERVEAU MONEY</h1>"
    )
})

Router.post("/createUtilisateur", UtilisateurController.create);
Router.post("/sendCodeEmail", EmailController.sendCodeEmail);

Router.post("/login", LoginController.login);

Router.get("/getPortefeuil", verify_token, PortefeuilleController.getPortefeuil);
Router.get("/findCountByNumber/:numero_compte", verify_token, PortefeuilleController.findCountByNumber);

Router.get("/verifyPassword/:password", verify_token, UtilisateurController.verifyPassword);
Router.get("/verifySecretCode/:secret", verify_token, UtilisateurController.verifySecretCode);

Router.post("/createFeesOrUpdateFees", verify_token, FraisController.createFeesOrUpdateFees);
Router.get("/getAllFees", FraisController.getAllFees);

Router.post("/virement", verify_token, VirementController.create);
Router.get("/getTransaction", verify_token, VirementController.getTransaction);
Router.get("/getReception", verify_token, VirementController.getReception);


module.exports = Router;
