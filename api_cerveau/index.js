const express = require("express");
const nodemon = require("nodemon");
const path = require("path");
const cors = require("cors");
const DataBase = require("./dbconnexions/db_connexion");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));

app.use((req, res, next)=> {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

app.use("/stockage", express.static(path.join(__dirname, "stockage")));
const port = process.env.PORT || 3010;

const Router = require("./routers/routing");

app.use(Router);
DataBase.sequelize.authenticate()
.then(()=>{
    app.listen(port, () => console.log(`Le server a bien été démarré sur le port ${port}.\nLe lien de base est: http://localhost:${port}`))
    console.log("Connexion à la Base de Données établie avec succès.");
})
.catch(error=>console.log("Connexion réfusée !", error));
    






