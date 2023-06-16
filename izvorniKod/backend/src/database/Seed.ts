import { ConnectionOptions, createConnection } from "typeorm";
import { Session } from "../models/Session";
import { User, UserType } from "../models/User";
import { Station } from "../models/Station";
import { TrainRoute } from "../models/TrainRoute";
import { Ticket } from "../models/Ticket";
import { SensorData } from "../models/SensorData";
import { Journey } from "../models/Journey";
import {getConnection} from "typeorm";

export async function seedDB(){
    await createConnection().then(async connection => {
    
        await connection.createQueryBuilder()
                        .insert()
                        .into(User)
                        .values([
                            { firstName: "Tomislav",
                            lastName: "Pavkovic",
                            email:"gospodar.backenda@fer.hr",
                            password: "josboljasifra321",
                            role: UserType.admin
                            },
                            
                            { firstName: "Ante",
                            lastName: "Vinkulja",
                            email:"vinkulja@fer.hr",
                            password: "vrlodobrasifra123",
                            role: UserType.user
                            }, 
                            
                            { firstName: "Martina",
                            lastName: "Galic",
                            email:"martina@fer.hr",
                            password: "oksifra123",
                            role: UserType.user
                            },

                            { firstName: "Kresimir",
                            lastName: "Pavlovic",
                            email:"kreso@fer.hr",
                            password: "cudnovatasifra132",
                            role: UserType.user
                            },

                            { firstName: "Mirta",
                            lastName: "Vucinic",
                            email:"martina@fer.hr",
                            password: "veomadugasifra321",
                            role: UserType.user
                            },

                            { firstName: "Ivan",
                            lastName: "Hajpek",
                            email:"ivan@fer.hr",
                            password: "321arfis",
                            role: UserType.user
                            },

                            { firstName: "Filip",
                            lastName: "Cindric",
                            email:"fico@fer.hr",
                            password: "1234567890",
                            role: UserType.user
                            },
                        ])
                        .execute();
    }).catch(error => console.log(error));
}
//seedDB();