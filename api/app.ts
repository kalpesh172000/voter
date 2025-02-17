import express from "express";
/* import cors from "cors";  // Import the cors package */
import errorHandler from "./middlewares/errorHandler.ts";
import {} from './routes/voteRoutes.ts'
import corsMiddleware from "./middlewares/corsMiddleware.js";
import voteRoutes from './routes/voteRoutes.ts'
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Enable CORS for the frontend at localhost:5173
//
app.use(corsMiddleware);

app.use(express.json());

app.use("/api/vote", voteRoutes);

app.use(errorHandler);

export default app;
