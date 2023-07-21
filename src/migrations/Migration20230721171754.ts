import { Migration } from '@mikro-orm/migrations';

export class Migration20230721171754 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table "users" ("id" serial primary key, "name" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "is_verified" boolean null default false, "token_version" int null default 0, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);',
        );
        this.addSql(
            'alter table "users" add constraint "users_email_unique" unique ("email");',
        );
    }
}
