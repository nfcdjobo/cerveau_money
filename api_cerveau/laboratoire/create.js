const param_connect = require("../dbconnexions/db_connexion");
const {hash_password} = require("./hash");
const generateRandomString = require("./generateRandomString");
const string = "azertyuiopqsdfghjklmwxcvbn0123456789";
const bcrypt = require("bcrypt");


const add_user = (user_model,data_model, request, response) => {
    try {
        user_model.findOne({where: request.auth})
            .then(user => {
                if(!user) return response.status(200).json({message: "Veuillez-vous authentifier."});
                if(request.body.email){
                    user_model.findOne({where: {email:request.body.email }})
                    .then(isUser => {
                        if(isUser) return response.status(200).json({message: "Ce utilisateur est déjà ajouté."});
                        const password = generateRandomString(string, 10)
                        hash_password(password)
                        .then(hash => {
                            request.body.password = hash;
                            request.body.id = "GB"+generateRandomString(string, 18);
                            data_model.create(request.body)
                            .then(new_user => {
                                console.log(new_user)
                            })
                        })
                    })
                }
                data_model.create()
            })
    } catch (error) {
    }
}

const create_element = (model,request, response, ...args) => {
    if(args.length === 0){
        model.findOne({where: {email:request.body.email }})
        .then(isUser => {
            if(isUser) return response.status(200).json({message: "Ce utilisateur est déjà ajouté."});
            bcrypt.hash(request.body.password, 10)
            .then(hash => {
                request.body.password = hash;
                request.body.id = "ONGFG"+generateRandomString(string, 15);
                if(request.body.naissance){request.body.naissance = new Date(request.body.naissance)}
                model.create(request.body)
                .then(new_user => {
                    response.status(201).json({data: new_user})
                })
            })
        });
    }else{
        args.findOne({where: {id: request.auth.id,email: request.auth.email}})
        .then(admin => {
            if(!admin) return response.status(201).json({message: "Veuillez-vous authentifier !"});
            model.findOne({where: {email:request.body.email }})
            .then(isUser => {
                if(isUser) return response.status(200).json({message: "Ce utilisateur est déjà ajouté."});
                bcrypt.hash("2023", 10)
                .then(hash => {
                    request.body.password = hash;
                    request.body.id = "GB"+generateRandomString(string, 18);
                    if(request.body.naissance){request.body.naissance = new Date(request.body.naissance)}
                    model.create(request.body)
                    .then(new_user => {
                        response.status(201).json({data: new_user})
                    })
                })
            });
        })
    }
}

module.exports =  {create_element, add_user};

