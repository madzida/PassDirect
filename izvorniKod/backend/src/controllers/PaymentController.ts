import Controller from "../Controller";
import { Methods } from "../Controller";
import { Request, Response, NextFunction } from "express";
import { User, UserType } from "../models/User";
import { getConnection } from "typeorm";
import { Journey } from "../models/Journey";
import { TrainRoute } from "../models/TrainRoute";
import { withAuth } from "../middleware/auth";
import { Ticket } from "../models/Ticket";
import { LoginController } from "./LoginController";
import { Station } from "../models/Station";
import { SensorData } from "../models/SensorData";
import { SensorController } from "./SensorController";
import { TimetableController } from "./TimetableController";
const nodemailer = require("./../nodemailer.config");

// validator imports
/* 
const express = require("express");
const bodyParser = require("body-parser");
const { validationResult } = require("express-validator");
const repo = require("./repository");
const { validateCardNumber } = require("./validator");
const formTemplet = require("./form"); 
*/

/* 
Jedna ruta za automatsko popunjavanje,
Vuce podatke o trenutnome korisniku
AdminController - withAuth queryja bazu da nađe korisnika, uzima njegov info, spremljen u res.locals
Ako user nije undefined, vrati res.json(usera)

Druga ruta - kupi kartu
Šalju sve podatke potrebne o kupnji karte, čuj se s Filipom i pogledaj zadatak
Meni trebaju svi podaci o korisniku itd sve iz formulara u frontendu
Koristi Ticket.ts 
*/

export class PaymentController extends Controller {
    // FETCH AT /api/autofill OR AT /api/payment
    path = "/";
    routes = [
        {
            // handler za autofill
            path: "/autofill",
            method: Methods.POST,
            handler: this.handleAutofill,
            localMiddleware: [withAuth],
        },
        {
            // handler za podatke o placanju
            path: "/payment",
            method: Methods.POST,
            handler: this.handleTicketPurchase,
            localMiddleware: [withAuth],
        },
    ];

    constructor() {
        super();
    }

    // Posalji informacije o korisniku u .json formatu na /autofill

    async handleAutofill(req: Request, res: Response, next: NextFunction): Promise<void> {
        const {token} = req.body
        let userRep = getConnection().getRepository(User);

        userRep
            .findOne({ email: res.locals.email })
            .then((user) => {
                if (user === undefined) {
                    res.status(401).send({err: "User undefined."})
                    return;
                }
                res.json({
                    firstName: user?.firstName,
                    lastName: user?.lastName,
                    email: user?.email,
                });
            })
            .catch((err) => {
                res.status(401).send({ err: "Neuspješan dohvat korisnika." });
                return;
            });
    }

    async handleTicketPurchase(req: Request, res: Response, next: NextFunction): Promise<void> {
        // Get payment info from client
        const {token, firstname, lastname, email, journeyId, cardNo, CVV, expDate,  travelDate} = req.body;
        var failedFlag = false
        if (
            email == undefined ||
            LoginController.validateEmail(email) == false ||
            
            cardNo == undefined ||
            cardNo.replace(/[^0-9]/g,"").length != 16 ||

            CVV == undefined ||
            CVV.length != 3 ||
            
            expDate == undefined ||
            
            firstname == undefined ||
            firstname.length < 2 ||
            
            lastname == undefined ||
            lastname.length < 2 ||

            journeyId == undefined ||

            travelDate == undefined 
        ) {
            res.status(401).send({
                err1: "Ispravno popunite sva polja.",
            });
            failedFlag = true
            return;
        }

        let ticket = new Ticket();

        ticket.passengerEmail = email;
        ticket.passengerName = firstname;
        ticket.passengerSurname = lastname;
        ticket.travelDate = new Date(travelDate);

        // Spoji korisnika sa kartom
        let userRep = getConnection().getRepository(User);
        await userRep
        .findOne({ email: res.locals.email })
        .then((user) => {
            if (user === undefined) {
                res.status(401).send({err: "User undefined."});
                failedFlag = true
                return;
            }
            ticket.user = user!;
        })
        .catch((err) => {
            res.status(401).send({ err: "User data fetch unsuccessful." });
            failedFlag = true
            return;
        });
        
        if (failedFlag) {
            return
        } 

        let journeyRep = getConnection().getRepository(Journey);
        let trainIsClose = false

        await journeyRep.createQueryBuilder('journey').leftJoinAndSelect('journey.sensorData', 'sensorData').where('journey.id = :id',{id: journeyId}).getOne().then(async (journey) => {
            if (journey === undefined) {
                res.status(401).send({err: "Specified journeyID couldn't be found in the database."})
                failedFlag = true
                return;
            }
            if(journey.sensorDataId != undefined && TimetableController.compareDates(journey.sensorData.travelDate, ticket.travelDate) == 0){
                trainIsClose = true
                let position=SensorController.calculatePosition(journey.sensorData.measurements)
                ticket.wagon = position.wagon
                ticket.wagonPosition = position.wagonPosition
                getConnection()
                .createQueryBuilder()
                .update(SensorData)
                .set({ measurements: position.measurements })
                .where("id = :id", { id: journey.sensorData.id })
                .execute();
            }
            // Connect the jounrey to the ticket 
            ticket.journey = journey!;
            
            // Save the ticket in the database
            let ticketRep = await getConnection().getRepository(Ticket);
            await ticketRep.save(ticket).catch((err) => {
                if (err != undefined) {
                    res.status(401).send({ err: "Transaction unsuccessful." });
                    failedFlag = true
                    return;
                }
            });
            if (failedFlag) {
                return
            } 

            res.sendStatus(200);

            let departureStation: Station|undefined;
            let arrivalStation: Station|undefined;
            let price:number|undefined;
            let departureTime:string|undefined;
            let arrivalTime:string|undefined;
            departureStation=journey?.departureStationName;
            arrivalStation=journey?.arrivalStationName;
            price=journey?.price;
            
            let minutes1;
            let hours1;
        

            if(  journey?.departureTime.getMinutes()!=undefined && journey?.departureTime.getMinutes()<10){
                minutes1="0"+journey?.departureTime.getMinutes();
            }else{
                minutes1=journey?.departureTime.getMinutes();
            }
            if(  journey?.departureTime.getHours()!=undefined && journey?.departureTime.getHours()<10){
                hours1="0"+journey?.departureTime.getHours();
            }else{
                hours1=journey?.departureTime.getHours();
            }
            departureTime=hours1+":"+minutes1+":00";
        
            let minutes;
            let hours;
            if(  journey?.arrivalTime.getMinutes()!=undefined && journey?.arrivalTime.getMinutes()<10){
                minutes="0"+journey?.arrivalTime.getMinutes();
            }else{
                minutes=journey?.arrivalTime.getMinutes();
            }
            if(  journey?.arrivalTime.getHours()!=undefined && journey?.arrivalTime.getHours()<10){
                hours="0"+journey?.arrivalTime.getHours();
            }else{
                hours=journey?.arrivalTime.getHours();
            }
            arrivalTime=hours+":"+minutes+":00";
            console.log(minutes);
            //poziv funkcije
            if (trainIsClose){
                nodemailer.sendConfirmationEmailForTicketWithPosition(
                    firstname, 
                    lastname, 
                    email, 
                    journeyId, 
                    ticket.id, 
                    departureStation,
                    arrivalStation,
                    price,
                    departureTime,
                    arrivalTime,
                    ticket.wagon,
                    ticket.wagonPosition,
                    new Date(travelDate).getDate()+"."+ ((new Date(travelDate).getMonth()+1))+"."+  new Date(travelDate).getFullYear()+"."
                );
            } else {
                nodemailer.sendConfirmationEmailForTicket(
                    firstname, 
                    lastname, 
                    email, 
                    journeyId, 
                    ticket.id, 
                    CVV, 
                    expDate,
                    departureStation,
                    arrivalStation,
                    price,
                    departureTime,
                    arrivalTime,
                    new Date(travelDate).getDate()+"."+ ((new Date(travelDate).getMonth()+1))+"."+  new Date(travelDate).getFullYear()+"."
                    
                );
            }
        }).catch((err) => {
            res.status(401).send({ err: "Journey not found." });
            console.log(err);
            
            return;
        });
    }
}
