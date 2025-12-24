// const PlansServices = require('../services/plans.services');
const settingServices = require('../services/settings.services');
const { createResult } = require('../utils/utills');

const settingsController = {}
// CREATE SETTINGS

settingsController.createSettings = async (req, res) => {
    try {
        const newSetting = await settingServices.createSettings(req.body)
        return res.status(200).json(createResult("Settings created Successfully", newSetting))
    } catch (error) {
        console.log("error creating settings", error.message)
        return res.status(500).json(createResult(null, null, error.message));
    }
};
    settingsController.updateSettings = async (req, res) => {
    try {
        const updatedSetting = await settingServices.updateSettings(req.params.id, req.body)
        return res.status(200).json(createResult("Settings updated Successfully", updatedSetting))
    } catch (error) {
        console.log("error updating settings", error.message)
        return res.status(500).json(createResult(null, null, error.message));
    }
};
settingsController.getSettings = async (req, res) => {
    try {
        const settings = await settingServices.getSettings();
        return res.status(200).json(createResult("Settings fetched Successfully", settings))
    } catch (error) {
        console.log("error fetching settings", error.message)
        return res.status(500).json(createResult(null, null, error.message));
    }
};

module.exports = settingsController;