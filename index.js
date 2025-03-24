const mongoose = require("mongoose");
let express=require("express");
const connectDB = require("./db");
let cookieParser = require('cookie-parser');
let cors= require('cors');
const Routes = require("./routes/routes");
const videoRouter = require("./routes/video.routes");
const subscribeRouter = require("./routes/subscription.routes");
const playlistRouter = require("./routes/playlist.routes");
const likeRouter = require("./routes/like.routes");

let app=express();
require("dotenv").config();
app.use(cors({
    origin: process.env.CORS_ORIGIN
}))
app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({extended: true, limit: '16kb'}));
app.use(express.static("public")); // used to store images etc in server
app.use(cookieParser());

app.use("/user", Routes);
app.use("/video", videoRouter);
app.use('/subscribers', subscribeRouter);
app.use("/playlist", playlistRouter);
app.use("/likes", likeRouter)

connectDB();
// require('dotenv').config();

// // (async () => {
// //     try {
// //         await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`);
// //     } catch (error) {
// //         console.log(error);
// //     }
// //     app.listen(process.env.PORT)
// // }) ();
app.listen(process.env.PORT || 6000, '0.0.0.0')
