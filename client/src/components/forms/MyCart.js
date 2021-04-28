import React from 'react';
import { SERVER_URL } from "../../config.json"
import { withStyles, Avatar, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@material-ui/core';
import Swal from "sweetalert2"
import { DeleteOutlined, EditOutlined, ShareOutlined, CancelOutlined, AddShoppingCart } from "@material-ui/icons"
import {useHistory} from 'react-router-dom';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

const useStylesTwo = makeStyles((theme) =>({
	root: {
		display: 'flex',
		'& > *': {
		      margin: theme.spacing(1),
		   },
	 },
   marginBottom:{
    marginBottom: "20px",
   },
   marginButton: {
    margin: "5px"
   }
}));

const MyCart = ({data}) =>{
  const history = useHistory()

  const userData = JSON.parse(localStorage.getItem('userData'))
  const token = localStorage.getItem('token')

  const deleteHandler = (data) => {
  
          Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.isConfirmed) {
              fetch(`${SERVER_URL}carts/${data.itemId}`, {
                  method: "DELETE",
                  headers: {
                      "x-auth-token": token
                  }
              })
              .then(res => res.json())
              .then(data => {

                  Swal.fire(
                      'Deleted',
                      data.msg,
                      'success'
                  )
              })
            }
          })
      }

  const classes = useStyles();
  const classesTwo = useStylesTwo();

  return (
    <TableContainer className={classesTwo.marginBottom} component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Image</StyledTableCell>
            <StyledTableCell >Name</StyledTableCell>
            <StyledTableCell >RM</StyledTableCell>
            <StyledTableCell >Quantity</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            <StyledTableRow>
              <StyledTableCell className={classesTwo.root} component="th" scope="row">
                <Avatar alt="image" src={`${SERVER_URL}${data.image}`} />
              </StyledTableCell>
              <StyledTableCell>{data.name}</StyledTableCell>
              <StyledTableCell>{data.price}</StyledTableCell>
              <StyledTableCell>{data.quantity}</StyledTableCell>
            </StyledTableRow>
        </TableBody>
        {
            userData !== null && userData.user.isAdmin === false ?
            <Button><DeleteOutlined className={classesTwo.marginButton} size="large" color="secondary" variant="outlined" onClick={() => deleteHandler(data)}/></Button>
            : null
        }
        <StyledTableCell align="right">Subtotal: {data.subtotal}</StyledTableCell>
      </Table>
    </TableContainer>
  );
}

export default MyCart