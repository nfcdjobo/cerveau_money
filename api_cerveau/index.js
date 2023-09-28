const express = require("express");
const nodemon = require("nodemon");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));

app.use((req, res, next)=> {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

app.use("/stockage", express.static(path.join(__dirname, "stockage")));
const port = process.env.PORT || 3001;

const Router = require("./routers/routing");
const DataBase = require("./dbconnexions/db_connexion");
33

app.use(Router);
try {
    app.listen(port, () => console.log(`Le server a bien été démarré sur le port ${port}.\nLe lien de base est: http://localhost:${port}`))
    DataBase.sequelize.authenticate()
    .then(()=> console.log("Connexion à la Base de Données établie avec succès."))
    .then(()=>{
        console.log("Connexion à la Base de Données établie avec succès.");
        // app.listen(port, () => console.log(`Le server a bien été démarré sur le port ${port}.\nLe lien de base est: http://localhost:${port}`))
    })
}catch (error) {
    console.log("Erreur survenue lors de la connexion à la Base de Données",error)
}






