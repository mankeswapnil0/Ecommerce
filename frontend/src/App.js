import './App.css';
import Header from './component/layout/Header/Header.js';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Footer from './component/layout/Footer/Footer.js'
import Home from './component/Home/Home.js'
import ProductDetails from './component/Product/ProductDetails.js'
import Products from './component/Product/Products.js'
import Search from './component/Product/Search.js'
import LoginSignUp from './component/User/LoginSignUp';
import Profile from "./component/User/Profile";
import ProtectedRoute from "./component/Route/ProtectedRoute";
import store from "./store";
import {loadUser} from "./actions/userActions";
import { useEffect, useState } from 'react';
import UserOptions from "./component/layout/Header/UserOptions.js"
import UpdateProfile from "./component/User/UpdateProfile.js";
import UpdatePassword from "./component/User/UpdatePassword.js";
import ForgotPassword from "./component/User/ForgotPassword.js";
import ResetPassword from "./component/User/ResetPassword.js";
import Cart from "./component/Cart/Cart.js";
import { useSelector } from 'react-redux';
import Shipping from './component/Cart/Shipping';
import OrderSuccess from './component/Cart/OrderSuccess';
import ConfirmOrder from './component/Cart/ConfirmOrder';
import StripePayment from './component/Cart/StripePayment';
import MyOrders from './component/Order/MyOrders';
import OrderDetails from './component/Order/OrderDetails';
import Dashboard from './component/Admin/Dashboard'
import ProductList from './component/Admin/ProductList'
import axios from 'axios';
import NewProduct from './component/Admin/NewProduct';
import UpdateProduct from './component/Admin/UpdateProduct';
import OrderList from './component/Admin/OrderList';
import ProcessOrder from './component/Admin/ProcessOrder';
import UsersList from './component/Admin/UsersList';
import UpdateUser from './component/Admin/UpdateUser';
import ProductReviews from './component/Admin/ProductReviews';
import About from './component/layout/About/About';
import Contact from './component/layout/Contact/Contact';
import NotFound from './component/layout/Not Found/NotFound';


function App() {

  const {isAuthenticated, user} = useSelector(state => state.user);
  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey(){
    const {data} = await axios.get("/api/v1/stripeapikey");
    setStripeApiKey(data.stripeApiKey);
  }

  useEffect(() => {
    store.dispatch(loadUser());
    getStripeApiKey();
  }, [])

  // window.addEventListener("contextmenu", (e) => e.preventDefault());

  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}
      <Routes>
        <Route element={<ProtectedRoute/>}>
          <Route exact path="/account" element={<Profile />} />
          <Route exact path="/me/update" element={<UpdateProfile />} />
          <Route exact path="/password/update" element={<UpdatePassword />} />
          <Route exact path="/shipping" element={<Shipping />} />
          <Route exact path="/Cart" element={< Cart/>} />
          <Route exact path="/order/confirm" element={< ConfirmOrder/>} />
          <Route exact path="/process/payment" element={< StripePayment apiKey={stripeApiKey}/>} />
          <Route exact path="/success" element={< OrderSuccess/>} />
          <Route exact path="/orders" element={< MyOrders/>} />
          <Route exact path="/order/:id" element={< OrderDetails/>} />
          <Route exact path="/admin/dashboard" element={< Dashboard user={user} />} />
          <Route exact path="/admin/products" element={< ProductList user={user} />} />
          <Route exact path="/admin/product" element={< NewProduct user={user} />} />
          <Route exact path="/admin/product/:id" element={< UpdateProduct user={user} />} />
          <Route exact path="/admin/orders" element={< OrderList user={user} />} />
          <Route exact path="/admin/order/:id" element={< ProcessOrder user={user} />} />
          <Route exact path="/admin/users" element={< UsersList user={user} />} />
          <Route exact path="/admin/user/:id" element={< UpdateUser user={user} />} />
          <Route exact path="/admin/reviews" element={< ProductReviews user={user} />} />
        </Route>
        <Route exact path="/password/forgot" element={<ForgotPassword />} />
        <Route exact path="/password/reset/:token" element={<ResetPassword />} />
        <Route exact path="/" element={<Home/>} />
        <Route exact path="/product/:id" element={<ProductDetails/>} />
        <Route exact path="/products" element={<Products/>} />
        <Route path="/products/:keyword" element={<Products/>} />
        <Route exact path="/search" element={<Search/>} />
        <Route exact path="/login" element={< LoginSignUp/>} />
        <Route exact path="/about" element={< About/>} />
        <Route exact path="/contact" element={< Contact/>} />
        <Route exact path="/*" element={< NotFound/>} />
      </Routes>
      <Footer />
    </Router>
  );
}
export default App;
