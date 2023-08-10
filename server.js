require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { logger } = require('./middleware/logs')
const corsOptions = require('./config/corsOptions')
const errorHandler = require('./middleware/errorHandler')
const connectDB = require('./config/DBConnec')
const mongoose = require('mongoose')
const {logEvents } = require('./middleware/logs')

// App Config
connectDB()
app.use(logger)
app.use(cookieParser())
app.use(express.json())
app.use(cors(corsOptions))
const PORT = process.env.PORT || 4005

app.use('/', express.static(path.join(__dirname, '/public')))
app.use('/', require('./routes/routes'))
app.use('/users',require('./routes/userRoutes'))
app.all('*', (req, res) => {
    res.status(404) 
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 not found' })
    } else {
        res.type('txt').send('404 not found')
    }
})


// Database Config

// Api Endpoints 

// Server 

app.use(errorHandler)

mongoose.connection.once('open',()=> {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => {
        console.log(`server is started at Port: ${PORT}`)
    })
})

mongoose.connection.on('error',error => {
    console.log(error)
    logEvents(error.no + ' : ' + error.code + '\t' + error.syscall + '\t' + error.hostname, 'mongoErrorLog.log')
})
 