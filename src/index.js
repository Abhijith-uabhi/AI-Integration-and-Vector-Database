import express from "express"
import dotenv from "dotenv"
import vectorRoutes from "./routes/vectorDbroutes.js"
import agentRoutes from "./routes/agentRoutes.js"

dotenv.config()
const port = process.env.PORT

const app = express()

//routes
app.use("/vectordb", vectorRoutes)
app.use("/agents",agentRoutes)

app.listen(port, () => { console.log("App listen on port 3000") })

