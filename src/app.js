const express = require('express');
const cors = require('cors');
const app = express();

const usersController = require("./controllers/usersController");
const authMiddleware = require('./middlewares/authMiddleware');
const recordsController = require('./controllers/recordsController');

app.use(cors());
app.use(express.json());

//User routes
app
  .post("/api/users/sign-up", usersController.postSignUp)
  .post("/api/users/sign-in", usersController.postSignIn)
  .post("/api/users/sign-out", authMiddleware, usersController.postSignOut)
  
//  Transactions routes
  .post('/api/records', authMiddleware, recordsController.postRecords)
  .get('/api/records', authMiddleware, recordsController.getRecords)

module.exports = app;