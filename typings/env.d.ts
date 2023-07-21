declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production' | 'test' | 'provision';
            PORT: string;
            CORS_ORIGIN: string;
            DB_USER: string;
            DB_PASSWORD: string;
            DB_NAME: string;
        }
    }
}

export {};
