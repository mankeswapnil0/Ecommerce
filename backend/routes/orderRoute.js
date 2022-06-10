const express = require('express');
const { newOrder, getSingleOrder, myOrder, getAllOrder, updateOrder, deleteOrder } = require('../controllers/orderController');
const { isAuthenticated, isRoleAuth } = require('../middlewares/isAuth');

const router = express.Router();

router.route("/order/new").post(isAuthenticated, newOrder);
router.route("/order/:id").get(isAuthenticated, getSingleOrder);
router.route("/orders/me").get(isAuthenticated, myOrder);

router.route("/admin/orders").get(isAuthenticated, isRoleAuth("admin"), getAllOrder);
router.route("/admin/order/:id").put(isAuthenticated, isRoleAuth("admin"), updateOrder).delete(isAuthenticated, isRoleAuth("admin"), deleteOrder);

module.exports = router