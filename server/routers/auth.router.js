const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller');
const { tokenVerification, superAdminTokenVerification } = require('../middleware/auth.middleware');
const upload = require('../middleware/multer.middleware');

router.post('/register', authController.register);
router.post('/create-demouser', authController.createDemoUser);
router.post('/login', authController.login);
router.post('/forget-password', authController.forgetPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/createUser/:id', authController.registration);
router.get('/getAccount/:id', authController.getAccount);
router.get('/getCompany/:id', authController.getCompany);
router.get('/getfirm/:id',tokenVerification, authController.getfirm);
router.put('/update/:id', authController.updateAccount);
router.put('/updatePassword/:id',tokenVerification, authController.updatePassword);
router.put('/userInactive/:id',tokenVerification, authController.userInactive);
router.put('/approveClient/:id',tokenVerification, authController.approveClientAdmin);
router.post('/verify-otp', authController.verifyOtp);
router.post('/resend-otp', authController.resendOtp);
router.post('/count-company',tokenVerification, authController.countUsers);
router.get('/getCompanyFirms',tokenVerification, superAdminTokenVerification, authController.getFirmUnderClient);
router.put('/changePassword/:id', tokenVerification, authController.changePassword);


// crud for the sidebar menu permissions
router.post('/set-permissions/:id', authController.setUserPermissions);
router.get('/get-sidebar/:id',  authController.getUserSidebar);
router.put('/update-permissions/:id', authController.updateUserPermissions);
router.delete("/delete-firm/:firmId", tokenVerification , authController.deleteFirmAndAssociatedUsers);

//get data for demouser
router.post('/get-demouser' ,  authController.getDemoUser)
router.get("/get-all-demouser-logs", authController.getAllDemoUserLogs);
router.get("/get-demouser-logs/:id", authController.getDemoUserLogsById);
router.put("/demoUser-ExpiryUpdate", authController.updateDemoUserExpiry);


module.exports = router