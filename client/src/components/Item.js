import React, { useState } from "react"
import { useHistory } from "react-router-dom"
// import {Card, Button} from "react-bootstrap"
import { SERVER_URL } from "../config.json"
import Swal from "sweetalert2"
import EditItem from "./forms/EditItem"
import { DeleteOutlined, EditOutlined, ShareOutlined, CancelOutlined, AddShoppingCart } from "@material-ui/icons"
import { Card,
		 CardHeader,
		 IconButton, 
		 CardActionArea, 
		 CardActions, 
		 CardContent, 
		 CardMedia,
		 Button,
		 Typography,
		 makeStyles,
		 Grid,
		 Link,
		 TextField,
		 Modal,
		 Backdrop,
		 Grow,
		 Avatar,
		 FormControl,
		 Input } from "@material-ui/core"


const useStyles = makeStyles({
  root: {
   	minWitdh: 200
  },
  media: {
    height: 140,
  },
  bullet: {
  	display: "inline-block",
  	margin: "0 2px",
  	tansform: "scale(0.8"
  },
  pos :{
  	marginBottom: 12
  },
  marginTop: {
  	marginTop: 20
  },
});

const useStylesTwo = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const Item = ({data}) => {

    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

	const classes = useStyles();
	const classesTwo = useStylesTwo();
	const history = useHistory();

	const userData = JSON.parse(localStorage.getItem('userData'))
	const token = localStorage.getItem("token")
	const [editing, setEditing] = useState(false)
	// console.log(`${SERVER_URL}${data.image}`)
    const [cart, setCarts] = useState({
            itemId: data._id,
            quantity: ""
        })

    const onChangerHandler = (e) =>{
    	setCarts({
    		...cart,
    		[e.target.name]: e.target.value
    	})
    }
    console.log(cart)
	const addToCartHandler = () => {
	        fetch (`${SERVER_URL}carts`, {
	            method:'POST',
	            headers: {
	                "Content-Type": "application/json",
	                "x-auth-token": token
	            },
	            body: JSON.stringify(cart)
	        })
	            .then(res => res.json(Swal.fire("Success","Item added to cart", "success")))
	            .then(data => {
	                console.log(data)
	            })

	    }


	const deleteHandler = (e) => {
		Swal.fire({
		  title: 'Are you sure?',
		  text: "You won't be able to revert this!",
		  icon: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#3085D6',
		  cancelButtonColor: '#d33',
		  confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
		  if (result.isConfirmed) {
			fetch(`${SERVER_URL}items/${data._id}`, {
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

		return(
			<React.Fragment>
				<Card elevation={3} className={classes.marginTop}>
			{ editing ? <EditItem data={data}/>  : 
					<div>
					<CardHeader 
						action={
							<IconButton>
								<ShareOutlined />
							</IconButton>
						} title={<Link button onClick={() =>history.push("/singleitem")} >{data.name}</Link>} subheader={data.category}/>

					<CardContent>
						<CardMedia className={classes.media} image={`${SERVER_URL}${data.image}`}/>
						{/*<Typography variant="h6" color="textSecondary">
							{data.description}
						</Typography>*/}

						<Button size="small" variant="outlined" color="primary" onClick={handleOpen}>
						        View Detail
				      </Button>
					</CardContent>
					</div>
				} 
			
						{	
							userData !== null && userData.user.isAdmin === true ?
							<CardActions>
								<Button variant="textPrimary" onClick={() => setEditing(!editing)}>
									{editing ? <CancelOutlined /> : "Edit"}
								</Button>

								<Button color="secondary" >
									<DeleteOutlined onClick={deleteHandler}/>
								</Button>
							</CardActions>

							:null
						}
				</Card>

				<Modal  
				       aria-labelledby="transition-modal-title"
				       aria-describedby="transition-modal-description"
				       className={classesTwo.modal}
				       open={open}
				       onClose={handleClose}
				       closeAfterTransition
				       BackdropComponent={Backdrop}
				       BackdropProps={{
				         timeout: 500,
				       }}
				     >
				       <Grow in={open}>
				         <div className={classesTwo.paper}>
				           	<div>
				           	<CardHeader 
				           		action={
				           			<IconButton>
				           				<ShareOutlined />
				           			</IconButton>
				           		} title={<Link button onClick={() =>history.push("/singleitem")} >{data.name}</Link>} subheader={data.category}/>

				           	<CardContent>
				           		<CardMedia className={classes.media} image={`${SERVER_URL}${data.image}`}/>
				           		<Typography variant="h5" color="textSecondary">
				           			{data.description}
				           		</Typography>
				           		<Typography variant="h5" >
				           			RM: {data.price}
				           		</Typography>
				           		{
				           			userData !== null && userData.user.isAdmin === false?
				           			<form >
				           				<IconButton variant="contained" justify="center" onClick={addToCartHandler}>
				           					<AddShoppingCart variant="contained" justify="center" />
				           					<Typography>
				           							ADD
				           					</Typography>
				           				</IconButton>
				           					<FormControl>
				           						<Input 
				           						 onChange={onChangerHandler}
				           						 type="number" 
				           						 name="quantity" 
				           						 label="Quantity" 
				           						 value={cart.quantity}
				           						 />
				           				</FormControl>
				           			</form>	
				           			: null
				           		}
				           		<Button size="small" variant="outlined" color="secondary" type="button" onClick={handleClose}>
				           		        Close
				                 </Button>
				           	</CardContent>
				           	</div>
				         </div>
				       </Grow>
			    </Modal>
		     </React.Fragment>

		)
	}
			
export default Item