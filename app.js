const express = require("express");
const axios = require("axios");
const qs = require("qs");
const requestIP = require("request-ip");
const IP = require("ip");

require("dotenv").config();

const app = express();
const port = 3000;

const {
  DAILYMOTION_CLIENT_ID,
  DAILYMOTION_CLIENT_SECRET,
  DAILYMOTION_API_BASE_URL,
  DAILYMOTION_API_OAUTH_TOKEN_URL,
  DAILYMOTION_API_VIDEO_URL,
  LIVE_98_ID,
} = process.env;

async function getAccessToken() {
  try {
    const data = qs.stringify({
      scope: "read_video_streams",
      grant_type: "client_credentials",
      client_id: DAILYMOTION_CLIENT_ID,
      client_secret: DAILYMOTION_CLIENT_SECRET,
    });

    const response = await axios.request({
      method: "post",
      maxBodyLength: Infinity,
      url: `${DAILYMOTION_API_BASE_URL}/${DAILYMOTION_API_OAUTH_TOKEN_URL}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    });
    return { response, error: false };
  } catch (error) {
    return { error: true, message: error.toString() };
  }
}

async function getStrealURLs(ip) {
  const { response, error } = await getAccessToken();

  if (!error) {
    const { access_token } = response.data;
    try {
      const response = await axios.request({
        method: "get",
        url: `${DAILYMOTION_API_BASE_URL}/${DAILYMOTION_API_VIDEO_URL}/${LIVE_98_ID}`,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        params: {
          fields: "stream_live_hls_url",
          // client_ip: ip,
        },
      });
      return { response, error: false };
    } catch (error) {
      return { error: true, message: error.toString() };
    }
  }

  return { error: true, message: error.toString() };
}

app.get("/", async (req, res) => {
  try {
    const ipAddress1 = requestIP.getClientIp(req);
    const ipAddress2 = IP.address();
    console.log(ipAddress1, ipAddress2);
    const { response, error } = await getStrealURLs("186.194.175.216");
    if (!error) {
      const { data } = response;
      return res.status(200).json({ data });
    }
    return res.status(502).json({ error });
  } catch (error) {
    res.status(502).send(error);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
