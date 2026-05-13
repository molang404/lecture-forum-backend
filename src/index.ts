import dotenv from "dotenv";
import express from "express";
import userRouter from "./routes/userRouter.ts";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// 프론트앤드가 하는 요청(Request)에 대하여 경로
app.use("/user", userRouter);

app.listen(PORT, () => {
    console.log(`Server listening on : http://localhost:${PORT}`);
});
