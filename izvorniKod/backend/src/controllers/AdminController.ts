import Controller from "../Controller";
import { Methods } from "../Controller";
import { Request, Response, NextFunction} from "express"
import { User, UserType } from "../models/User";
import { getConnection } from "typeorm";
import { Station } from "../models/Station";
import { TrainRoute } from "../models/TrainRoute";
import { withAuth } from "../middleware/auth";

export class AdminController extends Controller {
    path = "/admin"
    routes = [{
            path: '/delete',
            method: Methods.POST,
            handler: this.handleDeleteUser,
            localMiddleware: [withAuth]
        },
        {
            path: '/tickets',
            method: Methods.POST,
            handler: this.handleGetTransactions,
            localMiddleware: [withAuth]
        }
    ];

    constructor() {
        super();
    };

    handleGetToken(req: Request, res: Response, next: NextFunction){
        res.sendStatus(200);
    }

    async handleGetTransactions(req: Request, res: Response, next: NextFunction): Promise<void> {
        const {token, email} = req.body;
        let userRep = getConnection().getRepository(User);
        let role: UserType | undefined;
        await userRep.findOne({email: res.locals.email}).then(user => {
            role = user?.role
        }).catch(err => {
            role = undefined
        })
        if(role == UserType.admin){
            await userRep.createQueryBuilder('user').leftJoinAndSelect('user.tickets', 'ticket').leftJoinAndSelect('ticket.journey', 'journey').where('user.email = :email',{email: email}).getOne().then(user => {
                if(user != undefined) {
                    res.json({
                        tickets: user.tickets
                    })
                } else {
                    res.status(401).send({err1: "User not found"})
                }
            }).catch(err => {
                res.status(401).send({err1: "Error while getting tickets"})
            })
        } else {
            res.status(401).send({err1: "User is not admin"})
        }
    }

    async handleDeleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        const {token, email} = req.body;
        let userRep = getConnection().getRepository(User);
        let role: UserType | undefined;
        await userRep.findOne({email: res.locals.email}).then(user => {
            role = user?.role
        }).catch(err => {
            role = undefined
        })
        if(role == UserType.admin){
            await userRep.delete({email: email}).then(result => {
                if(result.affected!>0){
                    res.sendStatus(200);
                } else {
                    res.status(500).json({
                        err: "Brisanje neuspješno"
                    })
                }
            }).catch(err=>{
                res.status(500).json({
                    err: "Brisanje neuspješno"
                })
            });
        } else {
            res.status(401).json({
                err: "Korisnik nije administrator"
            })
        }
    }
}
