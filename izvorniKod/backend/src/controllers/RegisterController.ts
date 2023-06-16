import Controller from "../Controller";
import { Methods } from "../Controller";
import { Request, Response, NextFunction} from "express"
import { User, UserType } from "../models/User";
import { getConnection } from "typeorm";
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import { secret } from "../Server";
import { LoginController } from "./LoginController";
const nodemailer = require("./../nodemailer.config");
const saltRounds = 5;

export class RegisterController extends Controller {
    path = "/signup"
    routes = [{
            path: '/',
            method: Methods.POST,
            handler: this.handlePostRegister,
            localMiddleware: []
        }
    ];

    constructor() {
        super();
    };

    async handlePostRegister(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { firstname, lastname, email, password, confirmpassword } = req.body;    // Get credentials from client
        if (email == undefined || LoginController.validateEmail(email) == false 
            || password == undefined || password.length < 6 
            || firstname == undefined || firstname.length < 2 
            || lastname == undefined || lastname.length < 2
            || confirmpassword == undefined){
            res.status(401).send({
                err1: "Sva polja nisu ispravno popunjena"
            })
            return;
        }
        let user = new User()
        user.email = email;
        user.firstName = firstname;
        user.lastName = lastname;
        user.password = await bcrypt.hash(password, saltRounds);
        user.role = UserType.user;
        user.created_date = new Date();
        user.created_date.setHours(user.created_date.getHours()+1)
        if (password !== confirmpassword) {
            res.status(401).send({
                err2: "Lozinka nije ispravno potvrđena."
            });
            return;
        } else {
            let emailUsed: Boolean = false;
            let userRep = await getConnection().getRepository(User)
            await userRep.findOne({email: email}).then((user) => {
                if(user != undefined){
                    emailUsed = true;
                    res.status(401).send({
                        err3: "Email je već iskorišten."
                    });
                }
            });
            if(!emailUsed) {
                await userRep.save(user).then((user)=>{
                    const payload = { email };
                    const token = jwt.sign(payload, secret, {
                        expiresIn: '1h'
                    });
                    res.json({token: token});
                    return;
                }).catch((err)=>{
                    if(err != undefined){
                        res.status(401).send({
                            err: "Creating user failed."
                        });
                        return;
                    }
                })
            }
        }
        nodemailer.sendConfirmationEmail(user.firstName,user.email);
       
    };
}