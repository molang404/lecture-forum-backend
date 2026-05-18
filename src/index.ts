import dotenv from "dotenv";
import express from "express";
import userRouter from "./routes/userRouter.ts";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// 교차 출처 리소스 공유 (CORS)를 허용하는 건 백엔드에서 증명하여 허용해야 함
// cors() 만 사용하면 모든 프론트앤드 주소에 대해 허용 증명을 하는 것
// cors({ origin : "주소" }) 를 통해 특정 주소에 대해서만 허용을 증명할 수 있음
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

// express.json() : 요청(Request)의 본문(body)에서 JSON 데이터를 객체로 파싱하여 request.body에 저장
app.use(express.json());

// express.urlencoded() : 요청(Request)의 본문(body)에서 URL-encoded 데이터를 객체로 파싱하여 request.body에 저장
app.use(express.urlencoded({ extended: true }));

// 프론트앤드가 하는 요청(Request)에 대하여 경로 Routing 등록
app.use("/user", userRouter);

app.listen(PORT, () => {
    console.log(`Server listening on : http://localhost:${PORT}`);
});
