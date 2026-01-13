export function buildOauthPopupHtml(params: {
  frontendOrigin: string;
  payload: unknown;
}) {
  const { frontendOrigin, payload } = params;

  const payloadJson = JSON.stringify(payload);

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Signing in...</title>
  </head>
  <body>
    <script>
      (function () {
        try {
          const data = ${payloadJson};
          if (window.opener && !window.opener.closed) {
            window.opener.postMessage(
              { type: "oauth:google", data },
              "${frontendOrigin}"
            );
          }
        } finally {
          window.close();
        }
      })();
    </script>
  </body>
</html>`;
}
