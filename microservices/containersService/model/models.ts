
const containerModel = {
    country: {type: String, required: true},
    destCountry: {type: String, required: true},
    created: {type:  Date, default: new Date()},

    shipId: {type: String, required: true},

    // total dimentions
    xDim: {type: Number, required: true},
    yDim: {type: Number, required: true},
    zDim: {type: Number, required: true},

    // --------------------------

    // avalilable dimentions
    totalBoxes: {type: Number, required: true},
    avalBoxes: {type: Number, required: true},

    xBoxDim: {type: Number, required: true},
    yBoxDim: {type: Number, required: true},
    zBoxDim: {type: Number, required: true},
}

const orderModel = {
    userId: {type: String, required: true},
    containerId: {type: String, required: true},
    shipId: {type: String, required: true},

    orgCountry: {type: String, required: true},
    destCountry: {type: String, required: true},
    created: {type:  Date, default: new Date()},

    status: {type: String, default:'waiting for departure'},
    currentCountry: {type: String, required: true},

    xDim: {type: Number, required: true},
    yDim: {type: Number, required: true},
    zDim: {type: Number, required: true},

    price: {type: Number, required: true}
}


export { containerModel, orderModel };