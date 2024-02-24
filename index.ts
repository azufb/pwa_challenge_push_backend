import express from "express";
const app = express();
import webPush from "web-push";

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
    const payload = req.body.payload;

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
    )
})