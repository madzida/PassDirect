import { ConnectionOptions } from "typeorm";
import { Session } from "../models/Session";
import { User } from "../models/User";
import { Station } from "../models/Station";
import { TrainRoute } from "../models/TrainRoute";
import { Ticket } from "../models/Ticket";
import { SensorData } from "../models/SensorData";
import { Journey } from "../models/Journey";

require("dotenv").config();

export const devConfig: ConnectionOptions = {
  type: "postgres",
  entities: [User, Session, Station, TrainRoute, Ticket, SensorData, Journey],
  synchronize: true,
  logging: false,
  extra: {
    ssl: {
      rejectUnauthorized: false
    }
  }
};

export const prodConfig = {
  connectionString: process.env.DATABASE_URL //defined in heroku addon
}