const express = require('express')
const app = express()
const cors = require('cors')
const PORT = 4000
const mongoose = require('mongoose')
const morgan = require('morgan')


//Connect to the Database "ecommerce" in Robo3T
mongoose.connect("mongodb://localhost:27017/onlineshop", {
	useNewUrlParser: true,
	useFindAndModify: false,
	useUnifiedTopology: true,
	// historyApiFallback: true,
	useCreateIndex: true
})

//Check if we are connected to the Database
mongoose.connection.once("open", () => console.log("We are connected to the Database"))

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))


//Define the routes
app.use("/users", require('./routes/users'))
app.use("/items", require('./routes/items'))
app.use("/carts", require('./routes/carts'))
app.use("/orders", require('./routes/orders'))
app.use(express.static('public'))

app.listen(PORT, () => console.log(`App is listening to port ${PORT}! Have a nice day!`))