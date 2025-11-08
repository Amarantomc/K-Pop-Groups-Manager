var getAgePlugin = require('get-age')

const getAge = (birthdate: Date) => {
    if(!birthdate) return null;

    return getAgePlugin(birthdate);
};

export {getAge}