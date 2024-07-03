const express = require("express");
const userRouter = require("./routes/user.routes");
const connectDB = require("./config/database");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

const port = process.env.PORT || 8000;

if(process.env.NODE_ENV = "development") {
    app.use(morgan("dev"));
}

const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    optionsSuccessStatus: 200,
  }

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("*", async(req, res, next) => {
    if(req.get("origin") === process.env.CORS_ORIGIN) {
        return next();
    }
    return res
    .status(401)
    .json({
        message: "Permission is not allowed!"
    })
});

app.get("/", (req, res) => {
    res.send("Hello from server")
})

app.use("/api/v1/user", userRouter);

connectDB()
    .then((data) => {
        app.listen(port, () => {
            console.log(`Server is running at port : ${port}`);
        });
    })
    .catch(err => {
        console.log("MONGO db connection failed !!! ", err);
    })

    module.exports = app;
