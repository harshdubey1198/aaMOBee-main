const express = require('express');
const router = express.Router();
const { tokenVerification } = require('../middleware/auth.middleware');
const roleController = require('../controllers/role.controller')

router.post('/create-role',tokenVerification, roleController.createRole);
router.get('/get-roles', roleController.getAllRoles);
router.get('/get-role/:id', roleController.getRoleById);
router.put('/update-role/:id',tokenVerification, roleController.updateRole);
// router.delete('/delete-role/:id', tokenVerification, roleController.deleteRole);
router.get('/getData/:id', roleController.getDataFSuper);

module.exports = router;
