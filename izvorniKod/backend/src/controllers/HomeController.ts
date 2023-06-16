import Controller from "../Controller";
import { Methods } from "../Controller";
import { Request, Response, NextFunction } from "express"
import { User, UserType } from "../models/User";
import { Double, getConnection, Timestamp } from "typeorm";
import { Station } from "../models/Station";
import { TrainRoute } from "../models/TrainRoute";
import { withAuth } from "../middleware/auth";
import { Journey } from "../models/Journey";
import { convertToObject, parseCommandLine } from "typescript";
import { TimetableController } from "./TimetableController";
import { SensorData } from "../models/SensorData";

export class HomeController extends Controller {
    path = "/"
    routes = [{
        path: '/stations',
        method: Methods.POST,
        handler: this.handleGetStationRoutesHome,
        localMiddleware: [withAuth]
    },
    {
        path: '/',
        method: Methods.POST,
        handler: this.handleGetHome,
        localMiddleware: [withAuth]
    },
    {
        path: '/users',
        method: Methods.POST,
        handler: this.handleGetUsers,
        localMiddleware: [withAuth]
    },
    {
        path: '/checktoken',
        method: Methods.POST,
        handler: this.handleGetToken,
        localMiddleware: [withAuth]
    }
    ];

    constructor() {
        super();
    };

    handleGetToken(req: Request, res: Response, next: NextFunction) {
        res.sendStatus(200);
    }

    async handleGetStationRoutesHome(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { token, station } = req.body;
        let journeyRep = getConnection().getRepository(Journey);
        let trainRouteRep = getConnection().getRepository(TrainRoute);
        let SensorDataRep = getConnection().getRepository(SensorData);


        let dateTime = new Date();
        dateTime.setHours(dateTime.getHours()+1)
        let departureTimeStation: Date[];
        departureTimeStation = [];
        let trainIds: number[];
        trainIds = [];
        let arrivalStations: Station[];
        arrivalStations = [];
        let RouteId: number[];
        RouteId = [];
        let RouteId1: number[];
        RouteId1 = [];
        let length: number | undefined;
        let zastavica = false;
        let zastavicaId = false;
        let pocetnaVremenaRuta: Date[];
        pocetnaVremenaRuta = [];
        let zastavicaZaKasnjenje: Boolean[];
        zastavicaZaKasnjenje = [];
        let zastavicaZaPolazak=false;
        //identifikacijsku oznaku vlaka, krajnje  odredište, vrijeme dolaska na tu stanicu split
        await journeyRep.find({ departureStationName: station }).then(async (journeys) => {
            console.log("početak");
            let m = 0;
            console.log(journeys.length);
            for (let i = 0; i < journeys.length; i++) {
                let pom = TimetableController.compareTimes(journeys[i].departureTime, dateTime);
                console.log("printam pom:" + pom);
                console.log("ISPOD POMA");
                console.log("routeId:"+journeys[i].routeId);
                await SensorDataRep.findOne({where:{routeId:journeys[i].routeId}}).then((data)=>{
                    if(data==undefined||data==null || data.stationName==null){
                        console.log("nema mjerenja")
                        zastavicaZaPolazak=true;
                        //vlak jos nije krenuo
                    }else if((data.stationName !== null &&  TimetableController.compareDates(data.travelDate,dateTime)!=0)){
                        console.log("MJERENJE OD JUCER")
                        //vlak jos nije krenuo
                        zastavicaZaPolazak=true;
                   }

                        
                })
                if (journeys[i].departureTime !== undefined && (pom == 1 || zastavicaZaPolazak==true)) {
                    zastavicaZaPolazak=false;
                    RouteId[m] = journeys[i].routeId;//clear departure time at the end
                    RouteId1 = RouteId.filter((a, b) => RouteId.indexOf(a) === b); //remove duplicates from routeId
                    console.log("poslije");
                    console.log(journeys[i].departureTime)
                    console.log(dateTime)
                    console.log(RouteId);
                    console.log(RouteId1);
                    console.log(RouteId.length);
                    console.log(RouteId1.length);

                    if (RouteId1.length !== RouteId.length) {
                        RouteId = RouteId.filter((a, b) => RouteId.indexOf(a) === b); //remove duplicates from routeId

                        console.log("printam routeId u filter=");
                        console.log(RouteId)
                    } else {
                        departureTimeStation[m] = journeys[i].departureTime; //only time is correct,using date from trainRoute
                        console.log("unos vremena")
                        m++;
                    }

                }
            }
            console.log(RouteId);
            console.log(departureTimeStation);
        }

        ).catch((err) => {
            zastavica = true;
            console.log(err);
            RouteId = [];//if err then clear array,size==0

        })
        if (RouteId.length > 0) {

            for (let i = 0; i < RouteId.length; i++) {
                await trainRouteRep.createQueryBuilder('trainRoute').leftJoinAndSelect('trainRoute.stations', 'Station').
                    where('trainRoute.id = :id', { id: RouteId[i] }).getOne().then(
                        async (routes) => {
                            if (routes?.dates.length !== undefined) {
                                for (let j = 0; j < routes?.dates.length; j++) {
                                    console.log(routes.dates[j]);
                                    console.log(dateTime);
                                    // console.log(routes.stations);
                                    let pom1 = TimetableController.compareDates(routes.dates[j], dateTime);
                                    console.log("printa pom1")
                                    console.log(pom1);
                                    if (pom1 == 0) {
                                        zastavicaId = true;
                                        length = routes?.stations.length;
                                        if (routes?.trainId !== undefined && length !== undefined) {
                                            trainIds[i] = routes?.trainId;
                                            arrivalStations[i] = routes.stations[length - 1];
                                            console.log(routes.stations[length - 1]);
                                            departureTimeStation[i].setMonth(routes.dates[j].getMonth());//changed date,used date from route
                                            departureTimeStation[i].setFullYear(routes.dates[j].getFullYear());
                                            departureTimeStation[i].setDate(routes.dates[j].getDate());
                                            pocetnaVremenaRuta[i] = routes.departureTime;
                                        }
                                    }
                                }

                                if (zastavicaId == false) {
                                    RouteId[i] = 0;
                                    //after for loop,clear all routes with id 0,their trainIds and departureTimeStation
                                    console.log("unutar routeId je 0")
                                }

                            }
                        }
                    ).catch((err) => {
                        zastavica = true;
                        res.status(401).send({
                            err: "Neuspješan dohvat TrainRoute-a."
                        });
                    })
            }
            let pomArray = [];
            let j = 0;
            for (let i = 0; i < RouteId.length; i++) {
                if (RouteId[i] == 0) {
                    pomArray[j] = i;
                    j++;
                }
            }
            for (let i = 0; i < pomArray.length; i++) {
                delete RouteId[pomArray[i]];
                delete departureTimeStation[pomArray[i]];
                delete trainIds[pomArray[i]];
                delete arrivalStations[pomArray[i]];
                delete pocetnaVremenaRuta[pomArray[i]];
            }


            for (let b = 0; b < RouteId.length; b++) {
                zastavicaZaKasnjenje[b] = false;
            }
            for (let i = 0; i < RouteId.length; i++) {
                await SensorDataRep.findOne({ routeId: RouteId[i] }).then(async (sensor) => {
                    if (sensor === undefined || sensor === null || sensor.stationName == null) {
                        console.log("nema sensora,nije jos krenuo uopce vlak");
                        //provjerimo je li trebao krenuti taj vlak sa svoje prve stanice
                        console.log("vlak je trebao krenuti s prve stanice u:" + pocetnaVremenaRuta[i]);
                        let pom2 = TimetableController.compareTimes(dateTime, pocetnaVremenaRuta[i]);
                        console.log("printam pom2" + pom2);
                        //ako je prvi veci od drugog za dvije minute barem,onda postoji kasnjenje
                        if (pom2 == 1) {
                            if ((dateTime.getMinutes() - pocetnaVremenaRuta[i].getMinutes()) >= 2 || dateTime.getHours() > pocetnaVremenaRuta[i].getHours()) {
                                //kasni barem dvije minute s prvim polaskom
                                zastavicaZaKasnjenje[i] = true;
                            }
                        }

                    }else if((sensor.travelDate !== null && TimetableController.compareDates(sensor.travelDate,dateTime)!=0)){
                        console.log("MJERENJE OD JUCER");
                        console.log("sensor od jucer,nije jos krenuo uopce vlak");
                        //provjerimo je li trebao krenuti taj vlak sa svoje prve stanice
                        console.log("vlak je trebao krenuti s prve stanice u:" + pocetnaVremenaRuta[i]);
                        let pom2 = TimetableController.compareTimes(dateTime, pocetnaVremenaRuta[i]);
                        console.log("printam pom2" + pom2);
                        //ako je prvi veci od drugog za dvije minute barem,onda postoji kasnjenje
                        if (pom2 == 1) {
                            if ((dateTime.getMinutes() - pocetnaVremenaRuta[i].getMinutes()) >= 2 || dateTime.getHours() > pocetnaVremenaRuta[i].getHours()) {
                                //kasni barem dvije minute s prvim polaskom
                                zastavicaZaKasnjenje[i] = true;
                            }
                        }
                    }
                    
                    else {
                        console.log("pronašao sam ovaj sensorData:" + sensor.time);
                        await journeyRep.findOne({ where: { departureStationName: sensor.stationName, routeId: RouteId[i] } }).then((journey) => {
                            if (journey?.departureTime !== undefined) {
                                let pom2 = TimetableController.compareTimes(sensor.time, journey?.departureTime);
                                if (pom2 == 1) {
                                    if (sensor.time.getMinutes() - journey.departureTime.getMinutes() >= 2 ||
                                        sensor.time.getHours() > journey.departureTime.getHours()) {
                                        zastavicaZaKasnjenje[i] = true;
                                    }
                                }
                            }

                        })
                    }


                }

                ).catch((err) => {
                    zastavica = true;
                    console.log("nema sensorData za taj routeid");
                    console.log(err);
                    RouteId = [];//if err then clear array,size==0

                })
            }

        } else {
            zastavica = true;
            /* res.status(401).send({
                 err: "Neuspješan dohvat Journey-a." 
             });*/
            console.log("unutar else sam")
            console.log(departureTimeStation);
            trainIds = [];
            arrivalStations = [];
            departureTimeStation = [];
            zastavicaZaKasnjenje = [];
            console.log(departureTimeStation);
            res.json(
                {
                    trainids: trainIds,
                    arrivalStation: arrivalStations,
                    departureTime: departureTimeStation,
                    zastavicaZaKasnjenje: zastavicaZaKasnjenje
                }
            );
        }

        //treba neki if dodati,nisam sigurna koji
        if (zastavica == false) {
            console.log("unutar if sam")
            const indices = Array.from(trainIds.keys())
            indices.sort( (a,b) => trainIds[a] - trainIds[b] )

            trainIds = indices.map(i => trainIds[i])
            departureTimeStation = indices.map(i => departureTimeStation[i])
            arrivalStations = indices.map(i => arrivalStations[i])
            zastavicaZaKasnjenje = indices.map(i => zastavicaZaKasnjenje[i])
            res.json({
                trainids: trainIds,
                arrivalStation: arrivalStations,
                departureTime: departureTimeStation,
                zastavicaZaKasnjenje: zastavicaZaKasnjenje,
            });
        }



    };

    async handleGetHome(req: Request, res: Response, next: NextFunction): Promise<void> {
        let stationRep = getConnection().getRepository(Station);
        let userRep = getConnection().getRepository(User);
        let role: UserType | undefined;
        await userRep.findOne({ email: res.locals.email }).then(user => {
            role = user?.role
        }).catch(err => {
            role = undefined
        })
        if (role !== undefined) {
            stationRep.find().then((stations) => {
                res.json({
                    stations: stations,
                    role: role
                });
            }).catch((err) => {
                res.status(401).send({
                    err: "Neuspješan dohvat iz baze."
                });
            })
        } else {
            res.status(401).send({
                err: "Neuspješan dohvat korisnika."
            });
        }
    };

    async handleGetUsers(req: Request, res: Response, next: NextFunction): Promise<void> {

        let userRep = await getConnection().getRepository(User)
        await userRep.findOne({ email: res.locals.email }).then(user => {
            if (user?.role !== UserType.admin) {
                res.status(401).send({
                    err: "Korisnik nije administrator"
                })
            } else {
                userRep.find().then((users) => {
                    users = users.filter(user => user.role == UserType.user);
                    users.map(user => user.password = "");
                    res.json({
                        users: users
                    })
                }).catch((err) => {
                    res.status(500).send({
                        err: "Neuspješan dohvat korisnika"
                    })
                })
            }
        }).catch((err) => {
            res.status(401).send({
                err: "Korisnik ne postoji"
            })
        })

    };
}
