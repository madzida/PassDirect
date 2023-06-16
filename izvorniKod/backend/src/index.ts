import "reflect-metadata";
const express = require('express');
import { RequestHandler } from "express";
const session = require('express-session')
import { Server } from "./Server";
import Controller from "./Controller";
import { LoginController } from "./controllers/LoginController";
import { TypeormStore } from "typeorm-store";
import { getConnection } from "typeorm";
import { Session } from "./models/Session";
import { createConnection } from "typeorm";
import {devConfig, prodConfig} from "./database/Database";
import { RegisterController } from "./controllers/RegisterController";
import { HomeController } from "./controllers/HomeController";
import { env } from "process";
import { getConnectionOptions, ConnectionOptions } from "typeorm";
import { AdminController } from "./controllers/AdminController";
import { PaymentController } from "./controllers/PaymentController";
import { TimetableController } from "./controllers/TimetableController";
import { SensorController } from "./controllers/SensorController";
import { SettingsController } from "./controllers/SettingsController";
const cookieParser = require('cookie-parser');

var cors = require('cors')
var bodyParser = require("body-parser")
var PORT = Number(process.env.PORT) || 5000

const app = express();
const server = new Server(app, PORT);

//-----------------------

const getOptions = async () => {
    let connectionOptions: ConnectionOptions;
    connectionOptions = devConfig;

    if (process.env.DATABASE_URL) {
      Object.assign(connectionOptions, { url: process.env.DATABASE_URL });
    } else {
      // gets your default configuration
      // you could get a specific config by name getConnectionOptions('production')
      // or getConnectionOptions(process.env.NODE_ENV)
      connectionOptions = await getConnectionOptions(); 
    }
  
    return connectionOptions;
};
  
const connect2Database = async (): Promise<void> => {
    const typeormconfig = await getOptions();
    await createConnection(typeormconfig);
};
  

connect2Database().then(() => {
    const repository = getConnection().getRepository(Session);

    const controllers: Array<Controller> = [
        new LoginController(),
        new RegisterController(),
        new SensorController(),
        new HomeController(),
        new AdminController(),
        new PaymentController(),
        new TimetableController(),
        new SettingsController()
    ];

    const globalMiddleware: Array<RequestHandler> = [
        bodyParser.urlencoded({ extended: false }),
        bodyParser.json(),
        cors({ origin: true, credentials: true }),
        cookieParser(),
        // session({
        //     secret: 'secret',
        //     resave: false,
        //     saveUninitialized: true,
        //     store: new TypeormStore({ repository }),
        //     cookie: {maxAge: 24 * 60 * 60 * 1000}
        // })
    ];

    Promise.resolve()
        //.then(() => server.initDatabase())
        .then(() => {
            server.loadGlobalMiddleware(globalMiddleware);
            server.loadControllers(controllers);
            server.loadFrontendForHeroku();
            server.run();
        });
})
.catch((err) => {
    console.log("Unable to connect to db", err);
    process.exit(1);
});
