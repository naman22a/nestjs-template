export default () => ({
    node_env: process.env.NODE_ENV,
    port: parseInt(process.env.PORT) ?? 5000,
    origin: process.env.CORS_ORIGIN,
    db_user: process.env.DB_USER,
    db_password: process.env.DB_PASSWORD,
    db_name: process.env.DB_NAME,
});
