const express = require('express');
const route = express.Router();
const {register,login,updatePassword} = require('../Contrroller/authController');
const { getUsers } = require('../Contrroller/testController');
const auth = require('../Middleware/auth')


// register
route.post('/register', register);

// test route 
route.get('/test',auth, getUsers);


// login
route.post('/login', login);


route.patch('/updatePassword',updatePassword);

// logout
// route.post('/logout', auth, logout);

// refresh
// route.get('/refresh', authController.refresh);

// route.get('/', (req, res) => { })
// route.get('/:id', (req, res) => { })
// route.post('/', auth, authController.register)
// route.put('/:id', (req, res) => { })
// route.delete('/:id', (req, res) => { })

module.exports = route;