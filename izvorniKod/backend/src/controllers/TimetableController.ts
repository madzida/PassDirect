import Controller from "../Controller";
import { Methods } from "../Controller";
import { Request, Response, NextFunction} from "express"
import { User, UserType } from "../models/User";
import { getConnection } from "typeorm";
import { withAuth } from "../middleware/auth";
import { Journey } from "../models/Journey";
import { TrainRoute } from "../models/TrainRoute";
import { privateEncrypt } from "crypto";

export class TimetableController extends Controller {
    path = "/timetable"
    routes = [{
            path: '/',
            method: Methods.POST,
            handler: this.handleGetJourneys,
            localMiddleware: [withAuth]
        }
    ];

    constructor() {
        super();
    };

    handleGetToken(req: Request, res: Response, next: NextFunction){
        res.sendStatus(200);
    }

    async handleGetJourneys(req: Request, res: Response, next: NextFunction): Promise<void> {
        const {token, departureStation, arrivalStation, travelDate} = req.body;
        if(departureStation == arrivalStation){
            res.json({
                journeys: []
            })
            return
        }
        let journeyRep = getConnection().getRepository(Journey);
        let journeyList: any[] = []
        let succesfull = true
        await journeyRep.find({where: {departureStationName: departureStation, arrivalStationName: arrivalStation }}).then(async journeys => {
            let trainRouteRep = getConnection().getRepository(TrainRoute);
            let promises = journeys.map(async function (journey) {
                await trainRouteRep.findOne({id: journey.routeId}).then(trainRoute => {
                    if(trainRoute != undefined) {
                        trainRoute.dates.forEach(function (date) {
                            if(TimetableController.compareDates(date, new Date(travelDate))==0){
                                let currentDateTime = new Date()
                                currentDateTime.setHours(currentDateTime.getHours()+1)
                                console.log("current time: "+currentDateTime+" date: "+date)
                                console.log(TimetableController.compareDates(currentDateTime, date)==0 && TimetableController.compareTimes(currentDateTime, journey.departureTime)==2)
                                if(TimetableController.compareDates(currentDateTime, date)==2 || (TimetableController.compareDates(currentDateTime, date)==0 && TimetableController.compareTimes(currentDateTime, journey.departureTime)==2)){
                                    journeyList.push({journey: journey, trainId: trainRoute.trainId})
                                }
                            }
                        })
                    }
                }).catch(err => {
                    res.status(401).send({err1: "trainRoute not found"})
                    console.log("ovo je greska: \n\n"+err+"\n\n")
                    succesfull = false
                })
            })
            await Promise.all(promises)
            if (succesfull) {
                journeyList.sort( (a,b) => a.trainId - b.trainId )
                res.json({
                    journeys: journeyList
                })
            }
        }).catch(err => {
            res.status(401).send({err2: "journeys not found"});
        })
    }

    static compareDates(date1: Date, date2: Date) {
        //returns 1 if first is greater, return 2 if second is greater, returns 0 if they are equal
        let year1 = date1.getFullYear()
        let month1 = date1.getMonth()
        let day1 = date1.getDate()

        let year2 = date2.getFullYear()
        let month2 = date2.getMonth()
        let day2 = date2.getDate()

        if (year1 > year2){
            return 1
        } else if (year2 > year1) {
            return 2
        } else {
            if (month1 > month2) {
                return 1
            } else if (month2 > month1) {
                return 2
            } else {
                if (day1 > day2) {
                    return 1
                } else if (day2 > day1) {
                    return 2
                } else {
                    return 0
                }
            }
        }
    }

    static compareTimes(date1: Date, date2: Date) {
        //returns 1 if first is greater, return 2 if second is greater, returns 0 if they are equal
        let hours1 = date1.getHours()
        let minutes1 = date1.getMinutes()
        let seconds1 = date1.getSeconds()

        let hours2 = date2.getHours()
        let minutes2 = date2.getMinutes()
        let seconds2 = date2.getSeconds()

        if (hours1 > hours2){
            return 1
        } else if (hours2 > hours1) {
            return 2
        } else {
            if (minutes1 > minutes2) {
                return 1
            } else if (minutes2 > minutes1) {
                return 2
            } else {
                if (seconds1 > seconds2) {
                    return 1
                } else if (seconds2 > seconds1) {
                    return 2
                } else {
                    return 0
                }
            }
        }
    }
}
