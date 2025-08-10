import http from "http";

let callCount = 0;
let lastCallTime = Date.now();

// Create a simple HTTP server to monitor calls
const server = http.createServer((req, res) => {
  if (req.url === "/api/auth/me") {
    callCount++;
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime;
    lastCallTime = now;

    console.log(
      `[${new Date().toISOString()}] API call #${callCount} - Time since last call: ${timeSinceLastCall}ms`
    );

    // If calls are happening too frequently, log a warning
    if (timeSinceLastCall < 1000) {
      console.warn(
        `⚠️  WARNING: API calls happening too frequently! Only ${timeSinceLastCall}ms between calls`
      );
    }
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      message: "API call monitored",
      callCount,
      timestamp: new Date().toISOString(),
    })
  );
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`API Monitor running on port ${PORT}`);
  console.log(
    "This will track calls to /api/auth/me and warn if they happen too frequently"
  );
  console.log("Press Ctrl+C to stop monitoring");
});

// Log summary every 10 seconds
setInterval(() => {
  console.log(
    `\n📊 Summary: ${callCount} total API calls in the last 10 seconds`
  );
  callCount = 0;
}, 10000);
