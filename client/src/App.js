import React,{ useState, useEffect } from "react"
import MyCart from "./components/forms/MyCart"
import Sidebar from "./Navbar"
import { 
	BrowserRouter as Router,
	Switch,
	Route
} from "react-router-dom"
import SingleItem from "./components/forms/SingleItem"
// import Login from "./components/forms/Login"
// import Register from "./components/forms/Register"
import { createMuiTheme, ThemeProvider, Typography, Grid } from "@material-ui/core"
import "./App.css"
import jwt_decode from "jwt-decode"

const theme = createMuiTheme({
	palette: {
		primary: {
			main: "#fefefe"
		}
	}
})

function App() {
	const [userData, setUserData] = useState({})

	const handleLogin = (user) =>{
		let decoded = jwt_decode(user.token)
		setUserData(decoded)
	}

  return (
	<Router>
		{/*<Route>*/}
		<Sidebar userData={userData} />
		{/*</Route>*/}
    </Router>
  );
}

export default App;