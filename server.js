const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("KB Equipment Proxy Running");
});

app.post("/discord-proxy", async (req, res) => {
  const { webhook, content, username } = req.body || {};

  if (!webhook || !content) {
    return res.status(400).json({
      ok: false,
      error: "Missing webhook or content"
    });
  }

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "KB-Equipment-Proxy/1.0"
      },
      body: JSON.stringify({
        username: username || "KB Equipment Logs",
        content: content
      })
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
