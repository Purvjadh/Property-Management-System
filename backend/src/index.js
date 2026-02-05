import dotenv from 'dotenv'
import connectDb from "./db/index.js";
import {app} from './app.js'

dotenv.config({ path: './.env' })

//console.log("PORT",process.env.PORT)
connectDb()
.then(() => {
    app.on("error",(error) => {
        console.log(`EXPRESS ERROR :: ERROR :: ${error}`)
    })

    app.listen(process.env.PORT ||8000,() => {
        console.log(`Server is listening at port ${process.env.PORT} sucessfully !!!!`)
    })
})
.catch(() => {
    console.log(`MONGODB CONNECTION FAILED :: ERROR :: ${error}`)
})