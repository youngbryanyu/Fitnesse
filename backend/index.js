/* Entry point for backend server */
// const mongoose = require('mongoose');
// const axios = require("axios");
const express = require('express')
const dotenv = require('dotenv')

/* Create instance of backend server */
const app = express()
app.use(express.json())

/* Load .env file */
dotenv.config()

/* test comment */