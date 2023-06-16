import { Application, RequestHandler } from "express";
import http from "http"
import Controller from "./Controller";
import { createConnection } from "typeorm";
import { seedDB } from "./database/Seed";
const express = require('express');
const path = require('path');

export const secret = "secretstring";
export class Server {
    private app: Application;
    private readonly port: number;

    constructor(app: Application, port: number) {
        this.app = app;
        this.port = port;
    };

    public run(): http.Server {
        return this.app.listen(this.port, () => {
            console.log(`Up and running on port ${this.port}`)
        });
    };

    
    public loadFrontendForHeroku() {
            this.app.use(express.static(path.join(__dirname, '../../frontend/build')));

            this.app.use(express.static(path.join(__dirname, '../../frontend/public')));

            this.app.get('*', (req, res)=>{

                res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));

            });
        
    }

    public loadGlobalMiddleware(middleware: Array<RequestHandler>): void {
        // global stuff like cors, body-parser, etc
        middleware.forEach(mw => {
            this.app.use(mw);
        });
    };

    public loadControllers(controllers: Array<Controller>): void {
        controllers.forEach(controller => {
            // use setRoutes method that maps routes and returns Router object
            this.app.use("/api"+controller.path, controller.setRoutes());
        });
    };

    public async initDatabase(): Promise<void> {
        await seedDB();
    }
}