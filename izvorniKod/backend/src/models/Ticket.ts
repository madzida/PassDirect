import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Journey } from "./Journey";
import { User } from "./User";

@Entity()
export class Ticket {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("text")
    passengerName!: string;

    @Column("text")
    passengerSurname!: string;

    @Column("text")
    passengerEmail!: string;

    @Column("timestamp")
    travelDate!: Date;

    @Column("int", {nullable: true})
    wagon!: number

    @Column("int", {nullable: true})
    wagonPosition!: WagonPosition

    @ManyToOne((type) => User, (user) => user.tickets, {onDelete: "CASCADE", cascade: true})
    @JoinColumn()
    user!: User;

    @ManyToOne((type) => Journey)
    @JoinColumn()
    journey!: Journey;
}

export enum WagonPosition {
    Front = 0,
    Back = 1
}
