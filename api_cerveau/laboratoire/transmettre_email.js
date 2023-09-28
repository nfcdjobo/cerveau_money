
const nodemailer = require("nodemailer");

/**
 * 
 * @param {Object} auth 
 * @returns 
 */
const Connecteur = async auth =>nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false,
    tls:{
        ciphers: "SSLv3"
    },
    auth:auth
});

/**
 * 
 * @param {Object} data 
 * @param {Function} formHtml 
 * @returns 
 */
const Transmetteur =  (data, formHtml)=> Connecteur.sendMail({
    from: `"${data.raison_sociale}" <${data.email_1}>`,
    to: data.email,
    subject:data.sujet,
    html: formHtml(data)
});

const connect_transfert_email = async ( auth, data, formHtml)=>{
    console.log(auth, data, formHtml)
    const connecteur = nodemailer.createTransport({
        host: "smtp-mail.outlook.com",
        port: 587,
        secure: false,
        tls:{
            ciphers: "SSLv3"
        },
        auth:auth
    });

    console.log("######################", connecteur)

    // const Transmetteur= await Connecteur.sendMail({
    //     from: `"${data.raison_sociale}" <${data.email_1}>`,
    //     to: data.email,
    //     subject:data.sujet,
    //     html: formHtml(data)
    // });

}

module.exports = {Connecteur, Transmetteur};

module.exports = connect_transfert_email;