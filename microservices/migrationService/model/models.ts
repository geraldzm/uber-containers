
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

const orderHistoryModel = {
    orderId: {type: String, required: true },

    created: {type:  Date, default: new Date()},
    status: {type: String, required: true },

    createdInCountry : {type:  String, required: true },
    currentCountry : {type:  String, required: true },
}

export { orderModel, orderHistoryModel };