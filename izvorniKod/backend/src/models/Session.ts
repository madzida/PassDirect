import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { SessionEntity } from 'typeorm-store';
import { User } from './User';

@Entity()
export class Session extends BaseEntity implements SessionEntity {
    @PrimaryColumn('text')
    id!: string;

    @Column('int')
    expiresAt!: number;

    @Column('text')
    data!: string;
}