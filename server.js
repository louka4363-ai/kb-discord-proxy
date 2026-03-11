const express = require("express");
const fetch = require("node-fetch");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("KB Equipment Proxy Running");
});

app.post("/discord-proxy", async (req, res) => {
  const webhook = req.body.webhook;
  const content = req.body.content || "";
  const username = req.body.username || "KB Equipment Logs";

  let embeds = undefined;

  if (req.body.embeds_json) {
    try {
      embeds = JSON.parse(req.body.embeds_json);
    } catch (e) {
      return res.status(400).json({
        ok: false,
        error: "Invalid embeds_json"
      });
    }
  }

  if (!webhook) {
    return res.status(400).json({
      ok: false,
      error: "Missing webhook"
    });
  }

  const payload = {
    username,
    content
  };

  if (embeds && Array.isArray(embeds) && embeds.length > 0) {
    payload.embeds = embeds;
  }

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "KB-Equipment-Proxy/1.0"
      },
      body: JSON.stringify(payload)
    });

    const text = await response.text();

    return res.status(response.status).send(text || "OK");
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`KB Equipment Proxy running on port ${PORT}`);
});
