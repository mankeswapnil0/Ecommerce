import React, { Fragment, useState, useEffect } from 'react'
import './ResetPassword.css'
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import Loader from '../layout/loader/Loader';
import {useDispatch, useSelector} from "react-redux";
import {clearErrors, resetPassword} from "../../actions/userActions";
import {useAlert} from "react-alert";
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom';
import MetaData from "../layout/MetaData";

function ResetPassword() {
    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();
    const params = useParams();

    const {error, success, loading} = useSelector(state => state.forgotPassword);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const resetPasswordSubmit = (e) => { 
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("password", password);
        myForm.set("confirmPassword", confirmPassword);
        dispatch(resetPassword(params.token, myForm));
    }


    useEffect(() => {
        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }
        if(success){
            alert.success("Password Updated Successfully");
            navigate('/login');
        }
    }, [dispatch, error, alert, success, navigate]);

  return (
    <Fragment>
        {loading ? <Loader /> : 
            <Fragment>
            <MetaData title="Change Password" />
            <div className='resetPasswordContainer'>
                <div className='resetPasswordBox'>
                    <h2 className='resetPasswordHeading'>Reset Password</h2>
                    <form
                        className="resetPasswordForm"
                        onSubmit={resetPasswordSubmit}
                    >
                        <div className='loginPassword'>
                            <LockOpenIcon />
                            <input 
                                type="password"
                                placeholder="New Password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className='loginPassword'>
                            <LockIcon />
                            <input 
                                type="password"
                                placeholder="Confirm Password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <input 
                            className="resetPasswordBtn"
                            type="submit"
                            value="Update"
                        />
                    </form>
                </div>
            </div>
            </Fragment>
        }
    </Fragment>
  )
}

export default ResetPassword