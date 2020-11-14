import express from "express";
import bodyParser from "body-parser";
import logger from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

const mongoose = require("mongoose");
import rootRouter from "./routes/api";
import config from "./config/config";

const app = express();

const MongoDBOption = { useUnifiedTopology: true };

mongoose
  .connect(config.MONGODB_URI, MongoDBOption)
  .then(() => console.log(`Database connected successfully`))
  .catch((err: any) => console.log(err));

mongoose.Promise = global.Promise;

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:4200", credentials: true }));
app.use(cookieParser());

app.use("/api", rootRouter);

app.use((err: any, req: any, res: any, next: any) => {
  console.log(err);
  next();
});

app.listen(config.NODE_PORT, () =>
  console.log(`app started at port ${config.NODE_PORT}!`)
);