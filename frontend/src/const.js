export const externalEndpoint =
  process.env.NODE_ENV == "development" ? "http://localhost:3000" : "";

console.log(`endpoint is [${externalEndpoint}]`);
