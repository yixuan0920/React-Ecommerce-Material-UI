import React, { useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import { SERVER_URL } from "../../config.json"
import Swal from "sweetalert2"
import { useHistory } from "react-router-dom"
import { Grid, Typography, TextField, Container, Button } from '@material-ui/core';



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


const Login= ({ handleLogin }) =>{
	const history = useHistory();
	const classes = useStyles();

	const [user, setUser] = useState({
		email: "",
		password: ""
	})

	const onChangeHandler = (e) =>{
		setUser({
			...user,
			[e.target.name]: e.target.value
		})
	}
	const onSubmitHandler = (e) =>{
		e.preventDefault()
	
		fetch(`${SERVER_URL}users/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(user)
		})
		.then(res => res.json())
		.then(token =>{
			handleLogin(token)
			history.push("/")
		})
		.catch(e =>{
			Swal.fire(
				'Opps',
				e.message,
				'error'
			)
			console.log(e.message)
		})
	}

	if(localStorage.hasOwnProperty('token') && localStorage.hasOwnProperty('userData')) {
        history.push("/")
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
			label="Email"
			name="email"
			value={user.email}
			onChange={onChangeHandler}
			type="email"
			variant="outlined"
			color="primary"
			required
			justify="center"
			/>

			<TextField 
			className={classes.field}
			label="Password"
			name="password"
			value={user.password}
			onChange={onChangeHandler}
			type="password"
			variant="outlined"
			color="primary"
			required
			justify="center"
			/>
			<Button 
				type="submit"
				variant="contained" 
				color="primary"
				justify="center"
				style={{ marginBottom: "10px"}}
				> Login
			</Button>
			</Grid>
		</form>
		</Container>
	)
}

export default Login