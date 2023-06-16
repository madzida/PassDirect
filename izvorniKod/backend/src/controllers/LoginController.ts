import Controller from "../Controller";
import { Methods } from "../Controller";
import { Request, Response, NextFunction} from "express"
import { User } from "../models/User";
import { getConnection } from "typeorm";
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import { secret } from "../Server";

export class LoginController extends Controller {
    path = "/login"
    routes = [{
            path: '/',
            method: Methods.POST,
            handler: this.handlePostLogin,
            localMiddleware: []
        }
    ];

    constructor() {
        super();
    };

    static validateEmail(email: string) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    async handlePostLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { email, password } = req.body;    // Get credentials from client
        if (email == undefined || password == undefined || LoginController.validateEmail(email) == false || password.length < 6){
            res.status(401).send({
                err1: "Podaci nisu ispravno uneseni."
            });
            return;
        }
        let userRep = await getConnection().getRepository(User)
        await userRep.findOne({email: email}).then(async (user) => {
            if (user === undefined) {
                res.status(401).send({
                    err2: "Ne postoji korisnik s navedenim emailom."
                });
                return;
            } else {
                let passwordCorrect = await bcrypt.compare(password, user?.password);
                if (!passwordCorrect) {
                    res.status(401).send({
                        err3: "Neispravna lozinka"
                    });
                    return;
                }
                const payload = { email };
                const token = jwt.sign(payload, secret, {
                    expiresIn: '1h'
                });
                res.json({token: token, role: user.role});
            }
        })
    };
}