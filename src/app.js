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

app.post("/api/getDetail", async (req, res) => {
  const {
    body: {
      params: { inputData },
    },
  } = req;

  let sendData = {};

  try {
    await firestore
      .collection("board")
      .doc(inputData.id)
      .get()
      .then(
        (response) =>
          (sendData = {
            title: response.data().title,
            author: response.data().author,
            description: response.data().desc,
          })
      );
  } catch (e) {
    console.log(e);
  }

  return res.json(sendData);
});

app.post("/api/writeBoard", async (req, res) => {
  const {
    body: {
      params: { inputData },
    },
  } = req;

  const D = new Date();

  let year = D.getFullYear();
  let month = D.getMonth() + 1;
  let date = D.getDate();

  month = month < 10 ? "0" + month : month;
  date = date < 10 ? "0" + date : date;

  console.log(year);
  console.log(month);
  console.log(date);

  const resultDate = year + "." + month + "." + date;

  let resultCode = 0;
  try {
    const fsRef = await firestore.collection("board");

    await fsRef.add({
      author: inputData.author,
      desc: inputData.description,
      hit: parseInt(0),
      isDelete: Boolean(false),
      registDate: resultDate,
      title: inputData.title,
      type: inputData.type,
    });

    resultCode = 1;
  } catch (e) {
    console.log(e);
  }

  return res.json(resultCode);
});

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
