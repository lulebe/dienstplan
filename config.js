module.exports = {
  DB_USER: process.env.DB_USER || "root",
  DB_PASSWORD: process.env.DB_PASSWORD || "testpw",
  PORT: process.env.PORT || 8080,
  COOKIE_SECRET: process.env.COOKIE_SECRET || "testsecret"
}