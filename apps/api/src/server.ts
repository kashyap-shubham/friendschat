import express, { type Application } from "express";
import cors from "cors";
import session from "express-session";
import passport from "@/auth/passport";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";

import routes from "./routes";
import { env } from "./config/env";
import { errorHandler } from "./errors/errorHandler";
import { httpLogger } from "@repo/logger";

const app: Application = express();

/* Trust Proxy
| Required when deploying behind reverse proxy (nginx, vercel, railway, etc.)
| Ensures secure cookies work correctly in production
*/
app.set("trust proxy", 1);

/* Security Headers
| Adds HTTP security headers to protect against:
| XSS, clickjacking, MIME sniffing, etc.
*/
app.use(helmet());

/* CORS Configuration
| Allows frontend to communicate with backend
| credentials:true required for cookies (session auth)
*/
const allowedOrigins =
  env.NODE_ENV === "production"
    ? ["https://friendschat.space"]
    : ["http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }

    },

    credentials: true,
  }),
);

/* Compression
| Compresses HTTP responses (gzip) to improve performance
*/
app.use(compression());

/* Request Logging
| Logs incoming requests (method, url, status)
| Useful for debugging and monitoring
*/
app.use(httpLogger);  // Todo: right now is printed on the screen but in production change the strategy to file or cloud

/* Body Parsers
| Parses incoming request body
| Limit size to prevent large payload abuse
*/
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));


/* Rate Limiting
| Prevents abuse (bruteforce, spam, DDOS small scale)
| Limits number of requests per IP
*/
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max requests per IP
  message: "Too many requests from this IP, please try again later.",
});

if (env.NODE_ENV === "production") {

  app.use(limiter);         // Todo : (optional) we may use individual rate limiter of each api

}

/* Session Configuration
| Required for Passport Google OAuth
| Stores user session securely in cookies
*/
app.use(
  session({
    name: "connect.sid",

    secret: env.SESSION_SECRET!,

    resave: false,
    saveUninitialized: false,

    rolling: true,

    proxy: env.NODE_ENV === "production",

    cookie: {
      domain:
        env.NODE_ENV === "production"
          ? ".musiconnect.space"
          : undefined,

      httpOnly: true,

      secure: env.NODE_ENV === "production",

      sameSite:
        env.NODE_ENV === "production"
          ? "none"
          : "lax",

      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }),
);

/* Passport Authentication
| Initializes passport and connects it with session
*/
app.use(passport.initialize());
app.use(passport.session());

/* API Routes
| All application routes prefixed with /api
*/
app.use("/api", routes);

/* Global Error Handler
| Handles all thrown errors in one place
*/
app.use(errorHandler);


const PORT = env.PORT;

async function startServer() {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();