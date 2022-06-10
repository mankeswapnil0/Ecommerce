const express = require('express');
const router = express.Router();
const { isAuthenticated, isRoleAuth } = require('../middlewares/isAuth');
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUser, getSingleUser, updateRole, deleteUser } = require('../controllers/userController');

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword); 
router.route("/logout").get(logout);

router.route("/me").get(isAuthenticated, getUserDetails);
router.route("/password/update").put(isAuthenticated, updatePassword);
router.route("/me/update").put(isAuthenticated, updateProfile);
router.route("/admin/users").get(isAuthenticated, isRoleAuth("admin"), getAllUser);

router.route("/admin/user/:id").get(isAuthenticated, isRoleAuth("admin"), getSingleUser)
    .put(isAuthenticated, isRoleAuth("admin"), updateRole)
    .delete(isAuthenticated, isRoleAuth("admin"), deleteUser);

module.exports = router