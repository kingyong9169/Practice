import socketIO from "socket.io";
import express from "express";
import bodyParser from "body-parser";
import multer from "multer";

import dotenv from "dotenv";
dotenv.config();

import mongoConnect from "./config/mongo";
import Message from "./models/message";
import fileUploader from "./controllers/fileUploader";

const io = socketIO(process.env.SOCKET_PORT); // 소켓 연결을 수신하기 위해 해당 포트 번호로 초기화
const app = express();

io.on("connection", (socket) => {
  console.log("Connection success");

  getMostRecentMessages()
    .then((results) => {
      socket.emit("mostRecentMessages", results.reverse()); // 채팅의 맨 아래에 있는 메시지를 볼 수 있도록함
    })
    .catch((error) => {
      socket.emit("mostRecentMessages", []);
    });

  socket.on("newChatMessage", (data) => {
    //send event to every single connected socket
    try {
      const message = new Message({
        user_name: data.user_name,
        user_image: data.user_image,
        message_text: data.message,
      });
      message
        .save()
        .then(() => {
          io.emit("newChatMessage", {
            user_name: data.user_name,
            user_image: data.user_image,
            message_text: data.message,
          });
        })
        .catch((error) => console.log("error: " + error));
    } catch (e) {
      console.log("error: " + e);
    }
  });
  socket.on("disconnect", () => {
    console.log("connection disconnected");
  });
});

/**
 * get 10 last messages
 * @returns {Promise<Model[]>}
 */
async function getMostRecentMessages() {
  // 처음 로그인할 때 마지막 메시지 10개를 볼 수 있도록 함
  return await Message.find().sort({ _id: -1 }).limit(10);
}

app.use((req, res, next) => {
  // 모든 것으로부터 접근을 허용하고, CORS를 제거한다.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.removeHeader("x-powered-by");
  // 요청받기 위해 허용된 HTTP 메소드를 설정한다.
  res.setHeader("Access-Control-Allow-Methods", "POST");
  // 헤더 클라이언트는 그들의 요청을 사용할 수 있다.
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  // 요청을 계속할 수 있도록 허용하고 라우터에 의해 핸들링할 수 있도록 허용한다.
  next();
});

app.use(bodyParser.json()); // 들어오는 HTTP 요청의 콘텐츠가 JSON으로 구문 분석되도록 설정한다.

// 파일을 업로드하려면 CDN에 업로드하기 전에 요청에 들어오는 파일을 버퍼로 메모리에 저장하도록 Multer 설정
// Cloudinary는 버퍼를 데이터 스트림으로 읽고 Multer 미들웨어의 출력을 fileUploader에 전달하고 파일 업로드 시작
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/api/upload", upload.single("image"), fileUploader);

/**
 *
 * @returns {Promise<void>}
 */
const initApp = async () => {
  try {
    await mongoConnect();
    console.log("DB connection success");
    app.listen(process.env.HTTP_PORT, () =>
      console.log(`HTTP Server listening on ${process.env.HTTP_PORT}`)
    );
  } catch (e) {
    // 오류 기록
    throw e;
  }
};

initApp().catch((err) => console.log(`error! ${err}`));
