import {
    Entity,
    PrimaryColumn
} from "typeorm";
  
@Entity()
export class Station {
    @PrimaryColumn("text")
    name!: string
}