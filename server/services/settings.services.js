const Settings = require('../schemas/settings.schema');
const User = require('../schemas/user.schema');

let settingsServices = {};

settingsServices.createSettings = async (data) => {
    try {
        const newSetting = await Settings.create(data);
        return newSetting;
    } catch (error) {
        throw new Error("Error creating settings");
    }
};

settingsServices.updateSettings = async (id, data) => {
    try {
         // Mutual exclusivity for payment gateways
        if (data.paymentGateways) {
            const { razorpay = {}, stripe = {} } = data.paymentGateways;

            // If Razorpay is true, Stripe becomes false
            if (razorpay.status === true) {
                data.paymentGateways.stripe = { ...stripe, status: false };
            }

            // If Stripe is true, Razorpay becomes false
            if (stripe.status === true) {
                data.paymentGateways.razorpay = { ...razorpay, status: false };
            }
        }
        const updatedSetting = await Settings.findByIdAndUpdate(id, data, { new: true });
        return updatedSetting;
    } catch (error) {
        throw new Error("Error updating settings");
    }
};

settingsServices.getSettings = async () => {
    try {
        const settings = await Settings.find();
        return settings;
    } catch (error) {
        throw new Error("Error fetching settings");
    }
};

module.exports = settingsServices;
