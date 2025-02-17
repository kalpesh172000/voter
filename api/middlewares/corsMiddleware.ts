import cors from "cors";

const allowedOrigins = [
    //"http://localhost:5173",
    //"http://127.0.0.1:5173"
    //  // Development Frontend
    // Add Production Frontend url when ready
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true // Allow cookies if needed
};

export default cors(corsOptions);
