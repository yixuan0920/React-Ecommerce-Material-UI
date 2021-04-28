
import React, { useState } from "react"
import { SERVER_URL } from "../../config.json"
import Swal from "sweetalert2"
import { makeStyles, 
		 TextField, 
		 Typography, 
		 Container, 
		 Button,
		 Grid } from "@material-ui/core"


const useStyles = makeStyles((theme) =>({
	root: {
	   '& > *': {
	     margin: theme.spacing(1),
	     width: '25ch',
	    },
	},
	field: {
		marginTop:15,
		marginBottom: 15,
		// marginLeft: "auto",
		// marginRight: "auto",
		display: "block"
	},
	formCenter: {
		// marginLeft: 'auto',
		// marginRight: 'auto'
	}
}))


const Register = () =>{
	const classes = useStyles();

	const [user, setUser] = useState({
		username: "",
		email: "",
		password: "",
		password2: ""
	})

	const onChangeHandler = (e) =>{
		setUser({
			...user,
			[e.target.name]: e.target.value
		})
	}
	const onSubmitHandler = (e) =>{
		e.preventDefault()
		
		if(user.username.length < 8) return Swal.fire('Error', "Name must be greater than 8 characters", 'error')
		if(user.password.length < 8) return Swal.fire('Error', "Password must be greater than 8 characters", 'error')
		if(user.password !== user.password2) return Swal.fire('Error', "Password must be same with confirm password", 'error')
		
		fetch(`${SERVER_URL}users/register`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(user)
		})
		.then(res => res.json())
		.then(data =>{
			Swal.fire(
				'Success!',
				data.message,
				'success'
			)
			setUser({})
		})
		.catch(e =>{
			Swal.fire(
				"Error",
				e.massage,
				"error"
			)
		})
	}

	return(
		<Container className={classes.formCenter}>
			<form 
				method="POST"
				noValidate 
				autoComplete="off"
				onSubmit={onSubmitHandler}>
		
			<Grid container direction="column" alignItems="center" justify="center"> 
				<TextField 
				className={classes.field}
				label="Username"
				name="username"
				value={user.username}
				onChange={onChangeHandler}
				type="text"
				variant="outlined"
				color="secondary"
				fullWidth
				required
				/>

				<TextField 
				className={classes.field}
				label="Email"
				name="email"
				value={user.email}
				onChange={onChangeHandler}
				type="email"
				variant="outlined"
				color="secondary"
				fullWidth
				required
				/>

				<TextField 
				className={classes.field}
				label="Password"
				name="password"
				value={user.password}
				onChange={onChangeHandler}
				type="password"
				variant="outlined"
				color="secondary"
				fullWidth
				required
				/>

				<TextField 
				className={classes.field}
				label="Confirm Password"
				name="password2"
				value={user.password2}
				onChange={onChangeHandler}
				type="password"
				variant="outlined"
				color="secondary"
				fullWidth
				/>
				<Button 
					type="submit"
					variant="contained" 
					color="secondary"
					justify="center"
					style={{ marginBottom: "10px"}}
					> Register 
				</Button>
			</Grid>
			</form>
		</Container>
	)
}

export default Register