const containerModel = {
    currentCountry: {type: String, required: true},
    destCountry: {type: String, required: true},
    created: {type:  Date, default: new Date()},

    shipId: {type: String, required: true},

    // total dimentions
    xDim: {type: Number, required: true},
    yDim: {type: Number, required: true},
    zDim: {type: Number, required: true},

    // --------------------------

    // avalilable dimentions
    totalVolum: {type: Number, required: true},
    avalVolum: {type: Number, required: true},

    totalKg: {type: Number, default: 1000 },
    avalKg: {type: Number, default: 1000 },
}

const orderModel = {
    userId: {type: String, required: true},
    containerId: {type: String, required: true},
    shipId: {type: String, required: true},

    orgCountry: {type: String, required: true},
    destCountry: {type: String, required: true},
    created: {type:  Date, default: new Date()},

    currentCountry: {type: String, required: true},

    xDim: {type: Number, required: true},
    yDim: {type: Number, required: true},
    zDim: {type: Number, required: true},

    volume: {type: Number, required: true},
    kg: {type: Number, required: true },

    price: {type: Number, required: true},
    arravied: {type: Boolean, default: false}

}

const orderHistoryModel = {
    orderId: {type: String, required: true },

    created: {type:  Date, default: new Date()},
    status: {type: String, required: true },

    createdInCountry : {type:  String, required: true },
    currentCountry : {type:  String, required: true },
}

export { containerModel, orderModel, orderHistoryModel };