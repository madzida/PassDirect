import { type } from "os";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    JoinColumn,
} from "typeorm";
import { Ticket } from "./Ticket";
  
export enum UserType {
    user = "user",
    admin = "admin"
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('text')
    firstName!: string;

    @Column('text')
    lastName!: string;

    @Column('text')
    email!: string;

    @Column('text')
    password!: string;

    @Column('text')
    role!: UserType;

    @Column('timestamp')
    created_date!: Date;

    @OneToMany(type => Ticket, ticket => ticket.user)
    @JoinColumn()
    tickets!: Ticket[];
}