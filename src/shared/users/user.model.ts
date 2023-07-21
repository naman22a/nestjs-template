import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'users' })
export class User {
    @PrimaryKey()
    id: number;

    @Property()
    name: string;

    @Property({ unique: true })
    email: string;

    @Property({ hidden: true })
    password: string;

    @Property({ type: 'boolean', default: false, hidden: true })
    isVerified?: boolean;

    @Property({ type: 'int', default: 0, hidden: true })
    tokenVersion?: number;

    @Property()
    createdAt = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt = new Date();
}
