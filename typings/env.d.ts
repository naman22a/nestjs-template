declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production' | 'test' | 'provision';
            PORT: string;
            DB_URL: string;
            ACCESS_TOKEN_SECRET: string;
            REFRESH_TOKEN_SECRET: string;
            REDIS_URL: string;
            CORS_ORIGIN: string;
            COOKIE_DOMAIN: string;
        }
    }
}

export {};
