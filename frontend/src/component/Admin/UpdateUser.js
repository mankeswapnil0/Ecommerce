import React, { Fragment, useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { clearErrors, getUserDetails, updateUser } from "../../actions/userActions"
import { useAlert } from "react-alert"
import Button from "@mui/material/Button"
import MetaData from '../layout/MetaData'
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PersonIcon from '@mui/icons-material/Person';
import Sidebar from './Sidebar'
import { useNavigate, useParams } from 'react-router-dom'
import { UPDATE_USER_RESET } from '../../constants/userConstants'
import Loader from '../layout/loader/Loader'


function UpdateUser({ user }) {

    const dispatch = useDispatch();
    const alert = useAlert();
    const params = useParams();
    const userId = params.id;
    const navigate = useNavigate();

    const { loading, error, user: userUpdate } = useSelector((state) => state.userDetails)
    const { loading: updateLoading, error: updateError, isUpdated } = useSelector((state) => state.profile)

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");

    useEffect(() => {
        if(user.user.role!=="admin"){
            navigate("/account");
        }
        if(userUpdate===undefined || (userUpdate && userUpdate._id!==userId)){
            dispatch(getUserDetails(userId));
        }else{
            setName(userUpdate.name);
            setEmail(userUpdate.email);
            setRole(userUpdate.role);
        }
        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }
        if(updateError){
            alert.error(updateError);
            dispatch(clearErrors());
        }
        if(isUpdated){
            alert.success("User Updated Successfully");
            navigate("/admin/users");
            dispatch({ type: UPDATE_USER_RESET });
        }
    }, [user.user.role, dispatch, isUpdated, updateError, userUpdate, userId, alert, error, navigate])

    const updateUserSubmitHandler = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("name", name);
        myForm.set("email", email);
        myForm.set("role", role);
        dispatch(updateUser(userId, myForm));
    }

  return (
    <Fragment>
        <MetaData title="Update User" />
        <div className='dashboard'>
            <Sidebar />
            <div className='newProductContainer'>
                {loading ? <Loader /> : <form
                    className='createProductForm'
                    encType='multipart/form-data'
                    onSubmit={updateUserSubmitHandler}
                >
                    <h1>Update User</h1>
                    <div>
                        <PersonIcon />
                        <input 
                            type="text"
                            placeholder='Name'
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <MailOutlineIcon />
                        <input 
                            type="email"
                            placeholder='Email'
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    
                    <div>
                        <VerifiedUserIcon />
                        <select value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="">Choose Role</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select>
                    </div>
                    
                    
                    <Button
                        id="createProductBtn"
                        type="submit"
                        disabled={updateLoading ? true : false || role === "" ? true : false}
                    >
                        Update
                    </Button>
                </form>
                }
            </div>
        </div>
    </Fragment>
  )
}

export default UpdateUser