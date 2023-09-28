const expressionReguliere = /^(([^<>()[]\.,;:s@]+(.[^<>()[]\.,;:s@]+)*)|(.+))@(([[0-9]{1, 3}.[0-9]{1, 3}.[0-9]{1, 3}.[0-9]{1, 3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/;
const valide_email = email_adress => expressionReguliere.test(email_adress);

