import { 
    Column, 
    Entity, 
    JoinColumn, 
    ManyToOne, 
    PrimaryGeneratedColumn 
} from "typeorm";
import { Station } from "./Station";
import { TrainRoute } from "./TrainRoute";

@Entity()
export class SensorData {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("numeric")
    speed!: number;

    @Column("timestamp")
    time!: Date;

    @Column("json")
    measurements!: any;  

    @Column("int", { nullable: true })
    routeId!: number;

    @ManyToOne(type => TrainRoute, TrainRoute =>TrainRoute.id)
    @JoinColumn({name : "routeId"})
    trainRoute!: TrainRoute;

    @Column("string", { nullable: true })
    stationName!: string;

    @ManyToOne(type => Station,Station =>Station.name)
    @JoinColumn({name : "stationName"})
    Station!: Station;

    @Column("timestamp")
    travelDate!: Date;
}
