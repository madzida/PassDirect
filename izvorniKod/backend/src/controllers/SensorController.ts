import Controller from "../Controller";
import { Methods } from "../Controller";
import { Request, Response, NextFunction } from "express"
import { Double, getConnection, Timestamp } from "typeorm";
import { SensorData } from "../models/SensorData";
import { Ticket, WagonPosition } from "../models/Ticket";
import { Journey } from "../models/Journey";
import { TrainRoute } from "../models/TrainRoute";
import { Station } from "../models/Station";
import { TimetableController } from "./TimetableController";
const nodemailer = require("./../nodemailer.config");



export class SensorController extends Controller {
    path = "/sensor"
    routes = [{
        path: '/',
        method: Methods.POST,
        handler: this.handleGetSensorData,
        localMiddleware: []
    },
    ];
    constructor() {
        super();
    };

    async handleGetSensorData(req: Request, res: Response, next: NextFunction): Promise<void> {
        let dateTime = new Date();
        dateTime.setHours(dateTime.getHours()+1)
        const { speed, time, measurements, routeId, stationName } = req.body.data;
        console.log(req.body.data)

        let zastavica = false;

        await getConnection()
            .createQueryBuilder()
            .delete()
            .from(SensorData)
            .where("routeId = :id1", { id1: routeId })
            .execute().catch((err) => {
                zastavica = true;
                console.log("PRINTAM ERROR1")
                console.log(err);
            });
        await getConnection()
            .createQueryBuilder()
            .insert()
            .into(SensorData)
            .values([
                {
                    speed: speed,
                    time: time, 
                    measurements: measurements,
                    routeId: routeId, 
                    stationName: stationName,
                    travelDate: dateTime
                }
            ])
            .execute().catch((err) => {
                zastavica = true;
                console.log("PRINTAM ERROR")
                console.log(err);

            });
        if (zastavica == false) {
            res.sendStatus(200)
        } else {
            res.status(400).send({
                err: "Neuspješno spremanje u bazu."
            });
        }
        await SensorController.updateJourneysAndTickets(stationName, routeId)

    };

    static async updateJourneysAndTickets(stationName: string, routeId: number) {
        let sensorDataRep = getConnection().getRepository(SensorData)
        await sensorDataRep.findOne({where: {stationName: stationName, routeId: routeId}}).then(async sensorData => {
            if (sensorData == undefined) {
                console.log("SensorData undefined")
                return
            }
            let station: Station
            let trainRouteId = sensorData.routeId
            let journeyRep = getConnection().getRepository(Journey)
            let trainRouteRep = getConnection().getRepository(TrainRoute)

            trainRouteRep.createQueryBuilder('trainRoute').leftJoinAndSelect('trainRoute.stations', 'station').where('trainRoute.id = :trainRouteId', {trainRouteId: trainRouteId}).getOne().then(async trainRoute => {
                if(trainRoute == undefined) {
                    return
                }
                let stationIndex = trainRoute.stations.map(station => {return station.name}).indexOf(sensorData.stationName) + 1
                if(stationIndex >= trainRoute.stations.length) {
                    return
                }
                station = trainRoute.stations[stationIndex]
                await journeyRep.createQueryBuilder('journey').innerJoinAndSelect('journey.trainRoute', 'trainRoute').where('journey.departureStationName = :station AND trainRoute.id = :trainRouteId',{station: station.name, trainRouteId: trainRouteId}).getMany().then(journeys => {
                    journeys.forEach(journey => {
                        getConnection()
                        .createQueryBuilder()
                        .update(Journey)
                        .set({ sensorData: sensorData })
                        .where("id = :id", { id: journey.id })
                        .execute();
                    })
                })
                var measurements = sensorData.measurements
                const delay = (ms: number | undefined) => new Promise(resolve => setTimeout(resolve, ms))
                await delay(1000)
                let ticketRep = getConnection().getRepository(Ticket)
                await ticketRep.createQueryBuilder('ticket').leftJoinAndSelect('ticket.journey', 'journey').leftJoinAndSelect('journey.sensorData', 'sensorData').where('sensorData.id = :id',{id: sensorData.id}).getMany().then(tickets => {
                    tickets.forEach(ticket => {
                        if (TimetableController.compareDates(ticket.travelDate, ticket.journey.sensorData.travelDate)==0){
                            let position = SensorController.calculatePosition(measurements)
                            measurements = position.measurements
                            getConnection()
                            .createQueryBuilder()
                            .update(Ticket)
                            .set({ wagon: position.wagon, wagonPosition: position.wagonPosition })
                            .where("id = :id", { id: ticket.id })
                            .execute();
                            let departureTime;
                            let arrivalTime;
                            let minutes1;
                            let hours1;
                            if(  ticket.journey?.departureTime.getMinutes()!=undefined && ticket.journey?.departureTime.getMinutes()<10){
                                minutes1="0"+ticket.journey?.departureTime.getMinutes();
                            }else{
                                minutes1=ticket.journey?.departureTime.getMinutes();
                            }
                            if(  ticket.journey?.departureTime.getHours()!=undefined && ticket.journey?.departureTime.getHours()<10){
                                hours1="0"+ticket.journey?.departureTime.getHours();
                            }else{
                                hours1=ticket.journey?.departureTime.getHours();
                            }
                            departureTime=hours1+":"+minutes1+":00";
                        
                            let minutes;
                            let hours;
                            if(  ticket.journey?.arrivalTime.getMinutes()!=undefined && ticket.journey?.arrivalTime.getMinutes()<10){
                                minutes="0"+ticket.journey?.arrivalTime.getMinutes();
                            }else{
                                minutes=ticket.journey?.arrivalTime.getMinutes();
                            }
                            if(  ticket.journey?.arrivalTime.getHours()!=undefined && ticket.journey?.arrivalTime.getHours()<10){
                                hours="0"+ticket.journey?.arrivalTime.getHours();
                            }else{
                                hours=ticket.journey?.arrivalTime.getHours();
                            }

                            arrivalTime=hours+":"+minutes+":00";
                            console.log(minutes);

                            nodemailer.sendConfirmationEmailForTicketWithPosition(
                                ticket.passengerName, 
                                ticket.passengerSurname, 
                                ticket.passengerEmail, 
                                ticket.journey.id,
                                ticket.id, 
                                ticket.journey.departureStationName,
                                ticket.journey.arrivalStationName,
                                ticket.journey.price,
                                departureTime,
                                arrivalTime,
                                position.wagon,
                                position.wagonPosition,
                                new Date(ticket.travelDate).getDate()+"."+ ((new Date(ticket.travelDate).getMonth()+1))+"."+  new Date(ticket.travelDate).getFullYear()+"."

                            );
                        }
                    })
                }).catch(err => {
                    console.log(err)
                    return
                })
                getConnection()
                .createQueryBuilder()
                .update(SensorData)
                .set({ measurements: measurements })
                .where("id = :id", { id: sensorData.id })
                .execute();
            }).catch(err => {
                console.log(err)
                return
            })
        }).catch(err => {
            console.log(err)
            return
        })
    }

    static calculatePosition(measurements: any): Position {
        var load = []
        var differences = []
        for(var i in measurements) {
            let frontLoad = measurements[i][0]
            let backLoad = measurements[i][1]
            load[Number(i)-1] = frontLoad + backLoad
            differences[Number(i)-1] = backLoad - frontLoad
        }
        let difPrior = false
        differences.forEach(dif => {if (Math.abs(dif) > 30) {difPrior = true}})
        let wagon
        let wagonPosition
        if (difPrior) {
            let difAbs = differences.map(a=>Math.abs(a))
            var maxDif = Math.max(...difAbs)
            var indexDif = difAbs.indexOf(maxDif)

            wagon = indexDif + 1
            if (differences[indexDif] > 0) {
                wagonPosition = WagonPosition.Front
            } else {
                wagonPosition = WagonPosition.Back
            }
        } else {
            var minLoad = Math.min(...load)
            var indexLoad = load.indexOf(minLoad)
            wagon = indexLoad + 1
            if (differences[indexLoad] > 0) {
                wagonPosition = WagonPosition.Front
            } else {
                wagonPosition = WagonPosition.Back
            }
        }
        
        measurements[String(wagon)][wagonPosition == WagonPosition.Front ? 0 : 1] += 1
        return new Position(wagon, wagonPosition, measurements)
    }
}

class Position{
    public wagon: number;
    public wagonPosition: WagonPosition;
    public measurements: any

    constructor(wagon: number, wagonPosition: WagonPosition, measurements: any) {
        this.wagon = wagon;
        this.wagonPosition = wagonPosition
        this.measurements = measurements
    }
}
