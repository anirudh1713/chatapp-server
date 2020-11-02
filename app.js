require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

//ROUTE IMPORTS
const userRoute = require('./routes/userRoute.js');

const port = process.env.PORT || 4004;
const app = express();

//MIDDLEWARES
app.use(express.json());
app.use(cors());

//ROUTES MIDDLEWARES
app.use(userRoute);

//DB CONNECTION AND SERVER START
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(response => {
  app.listen(port, () => {
    console.log(`Server started on ${port}`);
  });
}).catch(err => {
  console.log(err);
});