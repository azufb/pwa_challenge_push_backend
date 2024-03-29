import express from "express";
import webPush from "web-push";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req: any, res: any) => {
    try {
      res.send({ name: "hoge" });
    } catch (error) {
      res.sendStatus(500);
    }
});

// VAPID の生成
const vapid = webPush.generateVAPIDKeys();

// VAPID の設定
webPush.setVapidDetails(
    "https://github.com/azufb/pwa_challenge",
    vapid.publicKey,
    vapid.privateKey
)

app.get("/vapidPublicKey", (req, res) => {
    res.send(vapid.publicKey);
});

app.post("/register", (req, res) => {
    res.sendStatus(201);
})

// Push通知を送るエンドポイントを用意する
app.post("/pushNotification", (req, res) => {
    // Push通知送信処理
    const subscription = req.body.subscription;

    const payload = "こんにちは！";

    const options = {
        vapidDetails: {
            subject: "https://github.com/azufb/pwa_challenge",
            publicKey: vapid.publicKey,
            privateKey: vapid.privateKey
        }
    }

    webPush.sendNotification(
        subscription,
        payload,
        options
    ).then(() => {
        res.sendStatus(201);
    }).catch((error) => {
        console.log("error", error);
        res.sendStatus(500);
    })
})

app.listen({ port: 3000 }, () => {
    console.log(`Server ready at http://localhost:3000`);
});

export default app;