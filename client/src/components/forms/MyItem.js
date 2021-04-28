import React, { useState } from "react"
import { SERVER_URL } from "../../config.json"
import Swal from "sweetalert2"
import { makeStyles, 
		 Input,
		 InputLabel,
		 InputAdornment,
		 FormControl,
		 TextField,
		 Grid,
		 Button,
		 Typography,
		 Card } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import axios from "axios"
// import "../../App.css"

const useStyles = makeStyles({
	field: {
		marginTop: 15,
		marginBottom: 15,
		display: "block"
	},
	bottom: {
		marginBottom: 25
	},
})


const MyItem = ({ getItems }) =>{
	const classes = useStyles();
    const userData = JSON.parse(localStorage.getItem('userData'))
    const token = localStorage.getItem('token')
    const [item, setItem] = useState({
        name: "",
        description: "",
        category: "",
        price: "",
        image: ""    
    })

    const onChangeHandler = (e) => {
        setItem({
            ...item,
            [e.target.name]: e.target.value
        })
    }

   const onSubmitHandler = (e) => {
           e.preventDefault()
           const formData = new FormData();
           formData.append('image', item.image);
           formData.append('description', item.description);
           formData.append('category', item.category);
           formData.append('price', item.price);
           formData.append('name', item.name);
           axios({
               method: 'POST',
               url:` ${SERVER_URL}items`,
               data: formData,
               headers: {
                   "Content-Type": "multipart/form-data",
                   "x-auth-token": token
               }
           })
           .then(res => Swal.fire("Success", res.data.msg, "success"))
           .catch(res => console.error(res))


       }

       const handleImage = (e) => {
           setItem({...item, image: e.target.files[0]});
        }


	return(

	<div>
	{
		userData !== null && userData.user.isAdmin === true ?
		<form noValidate autoComplete="off" onSubmit={onSubmitHandler} method="POST" encType="multipart/form-data" className={classes.bottom}>
		<Card elevation={3}>
			<Grid container direction="column" alignItems="center" justify="center">
				<Typography variant="h5" color="primary">
					Products
				</Typography>

				<TextField
					className={classes.field}
					variant="outlined"
					label="Name"
					name="name"
					color="primary"
					type="text"
					value={item.name}
					onChange={onChangeHandler}
				/>

				<TextField
					className={classes.field}
					variant="outlined"
					label="Description"
					name="description"
					type="text"
					color="primary"
					value={item.description}
					onChange={onChangeHandler}
				/>

				<TextField
					className={classes.field}
					variant="outlined"
					label="Category"
					name="category"
					type="text"
					color="primary"
					value={item.category}
					onChange={onChangeHandler}
				/>

				<TextField
					className={classes.field}
					variant="outlined"
					label="Price"
					name="price"
					type="number"
					min='1'
					color="primary"
					value={item.price}
					onChange={onChangeHandler}
				/>

				<TextField
					className={classes.field}
					label="Image"
					name="image"
					type="file"
					color="primary"
					onChange={handleImage}
				/>

				<Button 
				type="submit"
				color="secondary"
				justify="inherit"
				variant="outlined"
				className={classes.bottom}>
					Add
				</Button>
			</Grid>
		</Card>
		</form> 

		: null
		}
		</div>
	)

}

export default MyItem