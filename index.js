const express = require('express');
const { PORT, MONGODB_CONNECTION_STRING } = require('./Config/configuration');
const UserRouter = require('./Routes/userRouter');
// const ChatRouter = require('./Routes/chatRouter');
const errorHandler = require('./Middleware/errorHandler');
const cors = require("cors");
// const cookieParser = require('cookie-parser');

const corsOptions={
    credentials:true,
    origin:['http://localhost:5000'],

}

const app = express();
// app.use(cookieParser());

const mongoose = require('mongoose');

app.use(express.json({limit:'50mb'}));
app.use(cors(corsOptions));

app.use('/api/user', UserRouter);
// app.use('/api/chat', ChatRouter);

app.use('/storage',express.static('storage'));  
app.use(errorHandler);

mongoose.connect(MONGODB_CONNECTION_STRING).then(() => {

    app.listen(PORT, () => {
        console.log(`server running on port ${PORT} & db connected sucssesfully `);

    });
})
