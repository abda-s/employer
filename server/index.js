const express = require("express");
const cors = require("cors");
const morgan = require("morgan") // for dev logs
const mongoose = require("mongoose")
const dotenv = require("dotenv");
dotenv.config();


const app = express();
const port = process.env.PORT || 4000;


app.use(express.json());

app.use(cors({
    origin: ['https://employer-frontend.onrender.com', 'http://localhost:3000'], // Array of allowed origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods (if needed)
}));


const dbURL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.si1mhne.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(dbURL)
    .then(res => {
        console.log("connected to db")
        app.listen(port)

    })
    .catch(err => {
        console.log(err.message)
    })

app.use(morgan("dev"))


const authRoutes = require("./routes/authRoutes")
app.use('/auth', authRoutes)

const cvRoutes = require('./routes/cvRoutes')
app.use('/cv', cvRoutes)

const jobPostingRoutes = require("./routes/jobPostingRoutes")
app.use('/job-posting', jobPostingRoutes)


const applicationRoutes = require('./routes/applicationRoutes')
app.use('/application', applicationRoutes)

const usersRoutes = require('./routes/usersRoutes')
app.use('/users', usersRoutes)

const skillsRoutes = require('./routes/skillsRoutes')
app.use('/skills', skillsRoutes)