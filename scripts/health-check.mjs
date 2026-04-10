const targets = [
  "http://127.0.0.1:4000/health",
  "http://127.0.0.1:3000/auth",
];

const check = async (url) => {
  const started = Date.now();
  const response = await fetch(url);
  const elapsed = Date.now() - started;

  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}`);
  }

  console.log(`ok ${url} (${elapsed}ms)`);
};

const main = async () => {
  for (const target of targets) {
    await check(target);
  }
};

main().catch((error) => {
  console.error("health check failed", error);
  process.exit(1);
});
