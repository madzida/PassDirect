import { NextFunction, Request, Response } from "express"
import { getConnection } from "typeorm"
import Controller, { Methods } from "../Controller"
import { withAuth } from "../middleware/auth"
import { User } from "../models/User"

export class SettingsController extends Controller {
    path = "/settings"
    routes = [{
            path: '/',
            method: Methods.POST,
            handler: this.handleGetUserData,
            localMiddleware: [withAuth]
        },
        {
            path: "/delete",
            method: Methods.POST,
            handler: this.handleDeleteUser,
            localMiddleware: [withAuth]
        }]
    constructor(){
        super()
    }

    async handleGetUserData(req: Request, res: Response, next: NextFunction){
        let email = res.locals.email
        let userRep = getConnection().getRepository(User)
        await userRep.findOne({email: email}).then(user => {
            if(user == undefined){
                res.status(401).send({
                    err: "User not found"
                })
            } else {
                user.password = ""
                res.json({
                    user: user
                })
            }
        }).catch(err => {
            res.status(401).send({
                err: "Error fetching user data"
            })
        })
    }

    async handleDeleteUser(req: Request, res: Response, next: NextFunction) {
        let email = res.locals.email
        let userRep = getConnection().getRepository(User);

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
            console.log(err)
        });
    }
}