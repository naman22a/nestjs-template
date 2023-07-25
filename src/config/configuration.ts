export default () => ({
    node_env: process.env.NODE_ENV,
    port: parseInt(process.env.PORT) ?? 5000,
    db_user: process.env.DB_USER,
    db_password: process.env.DB_PASSWORD,
    db_name: process.env.DB_NAME,
    redis_url: process.env.REDIS_URL,
    origin: process.env.CORS_ORIGIN,
});
