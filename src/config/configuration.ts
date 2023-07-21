export default () => ({
    node_env: process.env.NODE_ENV,
    port: parseInt(process.env.PORT) ?? 5000,
    origin: process.env.CORS_ORIGIN,
});
