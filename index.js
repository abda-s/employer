const express = require("express");
const cors = require("cors");
const morgan = require("morgan") // for dev logs
const mongoose = require("mongoose")
const dotenv = require("dotenv");
dotenv.config();


const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());
const dbURL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.si1mhne.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(dbURL)
    .then(res => {
        console.log("connected to db")
        app.listen(PORT)

    })
    .catch(err => {
        console.log(err.message)
    })

app.use(morgan("dev"))

const authRoutes = require("./routes/authRoutes")
app.use('/auth', authRoutes)

const jobPostingRoutes = require("./routes/jobPostingRoutes")
app.use('/job-posting', jobPostingRoutes)