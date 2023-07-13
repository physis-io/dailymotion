const express = require("express");
const axios = require("axios");

require("dotenv").config();

const app = express();
const port = 3000;

const {
  DAILYMOTION_CLIENT_ID,
  DAILYMOTION_CLIENT_SECRET,
  DAILYMOTION_API_BASE_URL,
  DAILYMOTION_API_OAUTH_TOKEN_URL,
  DAILYMOTION_API_VIDEO_URL,
} = process.env;

async function getAccessToken() {
  const data = {
    scope: "read_video_streams",
    grant_type: "client_credentials",
    client_id: DAILYMOTION_CLIENT_ID,
    client_secret: DAILYMOTION_CLIENT_SECRET,
  };
  console.log(data);

  const response = await axios({
    url: `${DAILYMOTION_API_BASE_URL}/${DAILYMOTION_API_OAUTH_TOKEN_URL}`,
    method: "post",
    data,
  });

  return response;
}

app.get("/", async (req, res) => {
  try {
    const token = await getAccessToken();
    res.status(200).json({ token });
  } catch (error) {
    res.status(502).send(error);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
