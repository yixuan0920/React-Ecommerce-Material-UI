import React, { useState,useEffect } from 'react';
import { SERVER_URL } from "./config.json"
import { Route, Switch, Link, useHistory, useLocation } from "react-router-dom"
import clsx from 'clsx';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import jwt_decode from "jwt-decode"
import Login from "./components/forms/Login"
import Register from "./components/forms/Register"
import MyItem from "./components/forms/MyItem"
import SingleItem from "./components/forms/SingleItem"
import Item from "./components/Item"
// import ItemCard from "./components/ItemCard"
import MyCart from "./components/forms/MyCart"
import { SubjectOutlined, LockOpenOutlined, ExitToAppOutlined, GroupAddOutlined, ShoppingCartOutlined, WifiOutlined } from "@material-ui/icons"
import { makeStyles, 
         useTheme, 
         Drawer, 
         CssBaseline, 
         AppBar, 
         Toolbar, 
         List, 
         Typography, 
         Divider, 
         IconButton, 
         ListItem, 
         ListItemIcon, 
         ListItemText,
         Grid,
         Container,
         Card,
         Button } from '@material-ui/core';
import Swal from "sweetalert2"

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  active: {
      background: "#f4f4f4"
  }
}));

const Sidebar = () =>{
  const [token, setToken] = useState("")
  const [userData, setUserData] = useState({})
  const [isLogin, setIsLogin] = useState(false)
  const [items, setItems] = useState([])
  const [myItems, setMyItems] = useState([])
  const [myCarts, setMyCarts] = useState([])
  const [cart, setCart] = useState([])

  const userDataOne = JSON.parse(localStorage.getItem('userData'))

  const getItems = () =>{
    fetch(`${SERVER_URL}items`)
    .then(res => res.json())
    .then(data => setItems(data))
  }

  const getMyItems = () =>{
    fetch(`${SERVER_URL}items`,{
      method: "GET",
      headers: {
        "x-auth-token": localStorage.getItem('token')
      }
    })
    .then(res => res.json())
    .then(data => setMyItems(data))
  }

  const getCart = () =>{
  fetch(`${SERVER_URL}carts`,{
    method: "GET",
    headers: {
      "x-auth-token": localStorage.getItem("token")
    }
  })
  .then(res => res.json())
  .then(data => setMyCarts(data.items))
  }

  useEffect(() =>{
    getItems()
    getMyItems()
    getCart()
  }, [])

  const deleteHandler = () => {

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
              console.log(`${SERVER_URL}carts/empty/`)
              fetch(`${SERVER_URL}carts/empty/`, {
                  method: "DELETE",
                  headers: {
                      "x-auth-token": localStorage.getItem("token")
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

  const handleLogin = (user) =>{
    let decoded = jwt_decode(user.token)
    setToken(user.token)
    setUserData(decoded)
    localStorage.setItem('userData', JSON.stringify(decoded))
    localStorage.setItem('token', user.token)
    setIsLogin(true)
  }

  const handleLogout = () =>{
    setToken()
    setUserData({})
    localStorage.removeItem('userData')
    localStorage.removeItem('token')
    history.push('/login')
  }

	const classes = useStyles();
	const theme = useTheme();
	const [ open, setOpen ] = React.useState(false);

	const handleDrawerOpen = () =>{
		setOpen(true);
	}

	const handleDrawerClose = () =>{
		setOpen(false);
	}

  const history = useHistory()

  const location = useLocation()

  const menuLogout = [
    {
      text: "Register",
      icon: <GroupAddOutlined color="secondary" />,
      path: "/register"
    },
    {
      text: "Login",
      icon: <LockOpenOutlined color="secondary" />,
      path: "/login"
    }
  ]

  const menuLogin = [
    {
      text: "Home",
      icon: <SubjectOutlined color="primary" />,
      path: "/"
    }
  ]

  const displayLoginMenu = 
  menuLogin.map(item =>(
      <ListItem 
          key={item.text} 
          button 
          onClick={() => history.push(item.path)}
          className={location.pathname === item.path ? classes.active : null}>
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={item.text} />
      </ListItem>
    ))

  // const showItems = items.map(item => <Item key={item._id} data={item}/>)

	return(
		<div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            <WifiOutlined />
            Online Shopping
          </Typography>
        </Toolbar>
      </AppBar>


      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>


          <List>
              { "userData" in localStorage?
              <React.Fragment>
              {displayLoginMenu}
                { userDataOne !== null && userDataOne.user.isAdmin === false ?
                <ListItem
                  button
                  onClick={() => history.push("/mycart")}> 
                  <ListItemIcon><ShoppingCartOutlined color="primary"/></ListItemIcon>
                  <ListItemText primary="My Cart"/>
                </ListItem> : null
              }
                
              <ListItem
                button
                onClick={() => handleLogout()}> 
                <ListItemIcon><ExitToAppOutlined color="primary"/></ListItemIcon>
                <ListItemText primary="Logout"/>
              </ListItem>
              </React.Fragment>
              :
              menuLogout.map(item =>(
               <ListItem 
                    key={item.text} 
                    button 
                    onClick={() => history.push(item.path)}
                    className={location.pathname === item.path ? classes.active : null}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
          </List>

      </Drawer>


        {/* Below is for Switch NavBar */}

      
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
  
        <Switch>
            <Route path="/login">
            <Grid 
              container 
              justify="center" 
              alignItems="center" 
              direction="column"
              style={{ minHeight: "80vh" }}
              spacing={5}>

              <Grid item>
                <Typography variant="h3" color="primary">
                  Login
                </Typography>
              </Grid>
              <Card elevation={3} style={{ borderRadius: "15px" }}>
              <Grid item>
                <Login handleLogin={handleLogin} />
              </Grid>
              </Card>
            </Grid>
            </Route>

            <Route path="/register">
              <Grid 
                container 
                justify="center" 
                alignItems="center" 
                direction="column"
                style={{ minHeight: "80vh" }}
                spacing={5}>

                <Grid item>
                  <Typography variant="h3" color="secondary">
                    Register
                  </Typography>
                </Grid>
                <Card elevation={3} style={{ borderRadius: "15px"}}>
                <Grid item >
                  <Register />
                </Grid>
                </Card>
              </Grid>
              </Route>

            <Route path="/mycart">
            <Typography variant="h3" color="primary" align="center">
              My Cart
            </Typography>
            {
              myCarts?.length ?
              myCarts.map(cart =><MyCart key={cart._id} data={cart} />)
              
              :
              <Typography align="center" variant="h2" color="primary"> Your cart is empty ! </Typography>

            }

            {
            <Button variant="outlined" color="secondary" onClick={() => deleteHandler(myCarts)}>
              emptyCart
            </Button>

            }
            <Button variant="outlined" color="primary">
              CheckOut
            </Button>
            </Route>

            {/*<Route path="/singleitem">
              <SingleItem />
            </Route>*/}

            <Route path="/">
              <MyItem />
              
              <Container>
                <Grid container spacing={3}>
                  {items.map(item => (
                    <Grid item key={item._id} xs={12} md={6} lg={3} >
                      <Item data={item}/>
                    </Grid>
                  ))}
                </Grid>
              </Container>
            </Route>

        </Switch>

      </main>
    </div>
  );
}

export default Sidebar