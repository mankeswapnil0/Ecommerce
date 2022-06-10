const express = require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews, deleteReview, getAdminProducts } = require('../controllers/productController');
const { isAuthenticated, isRoleAuth } = require('../middlewares/isAuth');

const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/admin/products").get(isAuthenticated, isRoleAuth("admin"), getAdminProducts)
router.route("/admin/product/new").post(isAuthenticated, isRoleAuth("admin"),  createProduct);
router.route("/admin/product/:id").put(isAuthenticated, isRoleAuth("admin"),  updateProduct).delete(isAuthenticated, isRoleAuth("admin"),  deleteProduct);
router.route("/product/:id").get(getProductDetails);
router.route("/review").put(isAuthenticated, createProductReview);
router.route("/reviews").get(getProductReviews).delete(isAuthenticated, deleteReview);

module.exports = router