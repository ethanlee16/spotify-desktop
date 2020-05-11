import React, { useEffect, useState } from "react";
import fetch from "unfetch";

import LoginStyles from "../styles/Login.module.css";

export default function IndexPage({ query }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (query.code) {
      const formData = new URLSearchParams();
      formData.set("grant_type", "authorization_code");
      formData.set("code", query.code);
      formData.set("redirect_uri", "http://localhost:3000/oauth-redirect");

      fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          )}`,
        },
        body: formData,
      })
        .then((response: Response) => response.json())
        .then((responseData) => {
          setToken(responseData.access_token);
        });
    }
  }, [query.code]);

  useEffect(() => {
    if (token) {
      fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response: Response) => response.json())
        .then((responseData) => {
          setUser(responseData);
        });
    }
  }, [token]);

  async function onClickLogin(): Promise<void> {
    try {
      await fetch("/api/auth", { method: "POST" });
    } catch (err) {}
  }

  return (
    <div className={LoginStyles.container}>
      <h1>Spotify for Desktop</h1>
      {!user && (
        <button onClick={onClickLogin} className={LoginStyles.button}>
          Login with Spotify
        </button>
      )}
      {user && (
        <div>
          <p className={LoginStyles.notifyText}>Currently logged in as</p>
          <div className={LoginStyles.userContainer}>
            <img
              src={user.images[0].url}
              className={LoginStyles.profilePicture}
            />
            <div>
              <h2>{user.display_name}</h2>
              <p>{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

IndexPage.getInitialProps = ({ query }) => ({ query });
