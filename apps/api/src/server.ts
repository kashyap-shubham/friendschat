import express, { type Application } from "express";
import cors from "cors";
import { env } from "./config/env";
import routes from "./routes"


const app: Application = express();



// cors
app.use(cors({
    origin: env.FRONTEND_URL,
    credentials: true,
}));


// body parser
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));


// api routes
app.use("/api/v1", routes);

const PORT = env.PORT;


app.listen(PORT, () => {
    console.log(`server started at port ${PORT}`);
});