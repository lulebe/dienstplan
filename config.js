module.exports = {
  SALT_ROUNDS: 10,
  DB_USER: process.env.DB_USER || "root",
  DB_PASSWORD: process.env.DB_PASSWORD || "testpw",
  PORT: process.env.PORT || 8080,
  COOKIE_SECRET: process.env.COOKIE_SECRET || "testsecret",
  MJ_APIKEY_PUBLIC: process.env.MJ_PUB || "",
  MJ_APIKEY_PRIVATE: process.env.MJ_PRIV || "",
  production: process.env.NODE_ENV === "production"
}