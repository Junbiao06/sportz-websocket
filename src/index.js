import express from "express";
import { matchRouter } from "./routes/matches.js";
import http from "http";
import { attachWebSocketServer } from "./ws/server.js";

const app = express();
const port = process.env.PORT;
const host = process.env.HOST;

app.use(express.json());

const server = http.createServer(app);

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use("/matches", matchRouter);

const { broadcastMatchCreated } = attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;

app.listen(port, host, () => {
  const baseUrl =
    host === "0.0.0.0" ? `http://localhost${port}` : `http://${host}:${port}`;

  console.log(`Server started at ${baseUrl}`);
  console.log(
    `WebSocket Server is running on ${baseUrl.replace("http", "ws")}/ws`,
  );
});
