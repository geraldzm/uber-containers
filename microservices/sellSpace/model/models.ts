
const containerModel = {
    country: {type: String},
    destCountry: {type: String},
    created: {type:  Date, default: new Date()},

    // total dimentions
    xDim: {type: Number},
    yDim: {type: Number},
    zDim: {type: Number},

    // avalilable dimentions
    xADim: {type: Number},
    yADim: {type: Number},
    zADim: {type: Number}
}


export default containerModel;