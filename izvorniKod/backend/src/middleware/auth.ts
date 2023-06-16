const jwt = require('jsonwebtoken');
import { privateEncrypt } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { secret } from '../Server';

export const withAuth = function(req: Request, res: Response, next: NextFunction) {
  const {token} = req.body //req.cookies.token;
  if (!token) {
    res.status(401).send('Unauthorized: No token provided');
  } else {
    jwt.verify(token, secret, function(err: any, decoded: { email: string; }) {
      if (err) {
        res.status(401).send('Unauthorized: Invalid token');
      } else {
        res.locals.email = decoded.email;
        next();
      }
    });
  }
}