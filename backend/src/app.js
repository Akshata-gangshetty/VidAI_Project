import express from "express";
import cors from "cors";
import cookiePrser from "cookie-parser";
import useRouter from'./routes/user.routes.js'
import playlistRouter from './routes/playlist.routes.js'
import videoRouter from './routes/video.routes.js'
import { verifyJWt } from "./middlrwares/auth.middleware.js";
import subscriptionRouter from "./routes/subcription.routes.js";
import likeRouter from './routes/like.routes.js';
import dashboardRouter from './routes/dashboard.routes.js'
import healthcheckRouter from './routes/healthcheck.route.js'
import tweetRouter from './routes/tweet.routes.js'
import aiRouter from './routes/ai.routes.js'
import progressRouter from './routes/progress.routes.js'

 const app=express()
 app.use(express.urlencoded({extended:true}))
app.use(cors({

    origin: process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(express.static("public"))
app.use(cookiePrser())


app.use("/api/v1/user/",useRouter)
app.use("/api/v1/playlist/",playlistRouter)
app.use("/api/v1/video/",videoRouter)
app.use("/api/v1/subscription/",subscriptionRouter)
app.use("/api/v1/like/", likeRouter )
app.use("/api/v1/dashboard/", dashboardRouter )
app.use("/api/v1/healthcheck/", healthcheckRouter )
app.use("/api/v1/tweet/", tweetRouter )
app.use("/api/v1/ai/", aiRouter )
app.use("/api/v1/progress/",progressRouter)

//http://localhost:3000/api/v1/user/register
export {app}

