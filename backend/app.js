require('dotenv').config();
const express = require('express');
const helmet = require('helmet')
const connectToDB = require('./config/connectToDB');
const { errorHandler, notFound } = require('./middlewares/error');
const cors = require('cors');
const xss = require('xss-clean')

//connected To Database
connectToDB();

//initial app
const app = express();


//middlewares
app.use(express.json());

//xss clean
app.use(xss())
//helmet
app.use(helmet())
app.use(cors({
    origin:'http://localhost:3000'
}));

//api Routes

app.use('/api/auth',require("./routes/authRoute"))
app.use('/api/users',require("./routes/userRoute"))
app.use('/api/posts',require("./routes/postRoute"))
app.use('/api/comments',require("./routes/commentRoute"))
app.use('/api/category',require("./routes/categoryRoute"))

//middlewares
app.use(notFound)
app.use(errorHandler)

// run server on port
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`server is running on port ${PORT}`))