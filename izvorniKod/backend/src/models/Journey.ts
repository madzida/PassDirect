import { group } from "console";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    JoinColumn,
    ManyToOne,
    Timestamp
} from "typeorm";
import { SensorData } from "./SensorData";
import { Station } from "./Station";
import { TrainRoute } from "./TrainRoute";

@Entity()
export class Journey {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("int", { nullable: true })
    routeId!: number;

    @ManyToOne(type => TrainRoute, TrainRoute =>TrainRoute.id)
    @JoinColumn({name : "routeId"})
    trainRoute!: TrainRoute;

    @Column("timestamp")
    departureTime!: Date;

    @Column("timestamp")
    arrivalTime!: Date;

    @Column("numeric")
    price!: number;

    @Column("string", { nullable: true })
    departureStationName!: Station;

    @ManyToOne(type => Station,Station =>Station.name)
    @JoinColumn({name : "departureStationName"})
    departureStation!: Station;


    @Column("string", { nullable: true })
    arrivalStationName!: Station;

    @ManyToOne(type => Station,Station =>Station.name)
    @JoinColumn({name : "arrivalStationName"})
    arrivalStation!: Station;

    @Column("int", { nullable: true })
    sensorDataId!: number;

    @ManyToOne(type => SensorData, {nullable: true, onDelete: "SET NULL", cascade: true})
    @JoinColumn()
    sensorData!: SensorData;
}
