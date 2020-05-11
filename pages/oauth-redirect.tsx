import React, { useRef } from "react";

function OAuthRedirectPage({ query }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const location = `spotify-desktop://oauth-ingest/?code=${query.code}`;

  return (
    <iframe ref={iframeRef} style={{ visibility: "hidden" }} src={location} />
  );
}

OAuthRedirectPage.getInitialProps = ({ query }) => ({ query });
export default OAuthRedirectPage;
