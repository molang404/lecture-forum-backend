import dotenv from "dotenv";
import express from "express";

// 환경설정 파일을 불러오는 dotenv 라이브러리 호출
dotenv.config();

// 백엔드를 구성하는 express 앱 만들기
const app = express();

// 환경 변수 총 key가 PORT인 값을 가져오되, 가져올 수 없다면 8080을 PORT 변수에 할당
// 환경 변수에서 가져오는 값은 string | undefined
const PORT = process.env.PORT || "8080";

// 실제 app 구동
// app.listen(예비포트번호, 서버가 실행되면서 해야하는 함수)
app.listen(8000, () => {
    console.log(`서버 실행됨! http://localhost:${PORT}`);
});
