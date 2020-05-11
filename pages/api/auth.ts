import { shell } from "electron";
import { IncomingMessage, ServerResponse } from "http";

export default async function openSpotifyOAuthPage(
  req: IncomingMessage,
  res: ServerResponse
) {
  if (req.method === "POST") {
    const spotifyOAuthUrl = new URL("https://accounts.spotify.com/authorize");
    const spotifyOAuthParams = new URLSearchParams({
      response_type: "code",
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: ["user-read-email", "user-read-private", "streaming"].join(" "),
      redirect_uri: "http://localhost:3000/oauth-redirect",
    });
    spotifyOAuthUrl.search = spotifyOAuthParams.toString();

    await shell.openExternal(spotifyOAuthUrl.toString());
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: true }));
  } else {
    res.statusCode = 404;
    res.end("Not found");
  }
}
