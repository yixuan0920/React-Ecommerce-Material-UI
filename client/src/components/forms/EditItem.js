import React, { useState } from "react"
// import { Form, Button} from "react-bootstrap"
import { SERVER_URL } from "../../config.json"
import Swal from "sweetalert2"
import axios from "axios"
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
		 TextField } from "@material-ui/core"

const useStyles = makeStyles({
	field: {
		marginTop: 15,
		marginBottom: 15,
		display: "block"
	}
})

const EditItem = ({data}) =>{
	const classes = useStyles();
	const userData = JSON.parse(localStorage.getItem('userData'))
	const [updatedItem, setUpdatedItem] = useState({
		name: data.name,
		description: data.description,
		category: data.category,
		price: data.price
	})

	const onChangeHandler = (e) =>{
		setUpdatedItem({
			...updatedItem,
			[e.target.name]: e.target.value
		})
	}

	const token = localStorage.getItem('token')


   const onSubmitHandler = (e) => {
           e.preventDefault()
           const formData = new FormData();
           formData.append('image', updatedItem.image);
           formData.append('description', updatedItem.description);
           formData.append('category', updatedItem.category);
           formData.append('price', updatedItem.price);
           formData.append('name', updatedItem.name);
           axios({
               method: 'PUT',
               url:` ${SERVER_URL}items/${data._id}`,
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
           setUpdatedItem({...updatedItem, image: e.target.files[0]});
        }


	return(

		<form noValidate autoComplete="off" onSubmit={onSubmitHandler} method="POST" encType="multipart/form-data">
			 {/*<Grid container direction="column" alignItems="center" justify="center">*/}
			<Card elevation={3}>
				<CardHeader>
					<Typography variant="h6" color="secondary">
						Edit
					</Typography>
				</CardHeader>

				<CardContent>
					<TextField
						className={classes.field}
						variant="outlined"
						label="Name"
						name="name"
						color="primary"
						type="text"
						value={updatedItem.name}
						onChange={onChangeHandler}
					/>

					<TextField
						className={classes.field}
						variant="outlined"
						label="Description"
						name="description"
						type="text"
						color="primary"
						value={updatedItem.description}
						onChange={onChangeHandler}
					/>

					<TextField
						className={classes.field}
						variant="outlined"
						label="Category"
						name="category"
						type="text"
						color="primary"
						value={updatedItem.category}
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
						value={updatedItem.price}
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
					variant="outlined">
						Update
					</Button>
					</CardContent>
			</Card>
			{/*</Grid>*/}
		</form>
	)
}

export default EditItem