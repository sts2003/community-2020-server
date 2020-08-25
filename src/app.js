import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
dotenv.config();
import firestore from "./firebase";

const PORT = process.env.PORT || 5000;
const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(helmet());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.post("/api/getFreeBoardData", async (req, res) => {
  try {
    let sendData = [];

    await firestore
      .collection("board")
      .where("type", "==", "free")
      .where("isDelete", "==", false)
      .get()
      .then((response) =>
        response.forEach((doc) => {
          sendData.push({
            refKey: doc.id,
            title: doc.data().title,
            author: doc.data().author,
            regDate: doc.data().regDate,
            hit: doc.data().hit,
          });
        })
      );

    return res.json(sendData);
  } catch (e) {
    console.log(e);
    return [];
  }
});

app.post("/api/getDocsBoardData", async (req, res) => {
  try {
    let sendData = [];

    await firestore
      .collection("board")
      .where("type", "==", "docs")
      .where("isDelete", "==", false)
      .get()
      .then((response) =>
        response.forEach((doc) => {
          sendData.push({
            refKey: doc.id,
            title: doc.data().title,
            author: doc.data().author,
            regDate: doc.data().regDate,
            hit: doc.data().hit,
          });
        })
      );

    return res.json(sendData);
  } catch (e) {
    console.log(e);
    return [];
  }
});

app.listen(PORT, () => {
  console.log(`Server Start http://localhost:${PORT}`);
});
