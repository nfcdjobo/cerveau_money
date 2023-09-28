const find_element = (model, data) => {
    try {
        return model.findOne({where: data });
    }catch (error) {
        console.log("Erreur au niveau la fonction find_element()", error.message);
    }
}

module.exports = find_element;