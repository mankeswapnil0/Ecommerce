import React, { Fragment, useEffect } from 'react'
import { DataGrid } from "@mui/x-data-grid"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import { useAlert } from "react-alert"
import { Button } from '@mui/material'
import MetaData from "../layout/MetaData"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import Sidebar from './Sidebar'
import './productList.css'
import { getAllUsers, clearErrors, deleteUser } from '../../actions/userActions'
import { DELETE_USER_RESET } from '../../constants/userConstants'

function UsersList({ user }) {

    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();

    const { error, users } = useSelector((state) => state.allUsers);
    const { error:deleteError, isDeleted, message } = useSelector(state => state.profile);

    const columns = [
        { field: "id", headerName: "User ID", minWidth: 180, flex: 0.8 },
        {
            field: "email",
            headerName: "Email",
            minWidth: 200,
            flex: 1,
        },
        {
            field: "name",
            headerName: "Name",
            minWidth: 150,
            flex: 0.5,
        },
        {
            field: "role",
            headerName: "Role",
            minWidth: 150,
            flex: 0.3,
            cellClassName: (params) => {
                return params.getValue(params.id,"role") === "admin"
                ? "greenColor"
                : "redColor";
            }
        },
        {
            field: "actions",
            headerName: "Actions",
            type: "number",
            minWidth: 150,
            flex: 0.3,
            sortable: false,
            renderCell: (params) => {
                return(
                    <Fragment>
                        <Link to={`/admin/user/${params.getValue(params.id, "id")}`}>
                            <EditIcon />
                        </Link>
                        <Button onClick={() => deleteUserHandler(params.getValue(params.id, "id"))}>
                            <DeleteIcon />
                        </Button>
                    </Fragment>
                )
            }
        },
    ];  

    const rows = [];
    users && users.forEach((item) => {
        rows.push({
            id: item._id,
            role: item.role,
            email: item.email,
            name: item.name,
        })
    })

    const deleteUserHandler = (id) => {
        dispatch(deleteUser(id));
    }

    useEffect(() => {
        if(user.user.role!=="admin"){
          navigate("/account");
        }
        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }
        if(deleteError){
            alert.error(deleteError);
            dispatch(clearErrors());
        }
        if(isDeleted){
            alert.success(message);
            navigate("/admin/users");
            dispatch({type: DELETE_USER_RESET});
        }
        dispatch(getAllUsers());
      }, [user.user.role, navigate, alert, dispatch, error, deleteError, isDeleted, message])

  return (
    <Fragment>
        <MetaData title={`ALL USERS - Admin`} />
        <div className='dashboard'>
            <Sidebar />
            <div className='productListContainer'>
                <h1 id='productListHeading'>ALL Users</h1>
                <DataGrid 
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    disableSelectionOnClick
                    className='productListTable'
                    autoHeight
                />
            </div>
        </div>
    </Fragment>
  )
}

export default UsersList