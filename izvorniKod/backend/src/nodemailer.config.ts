import exp from "constants";
import { WagonPosition } from "./models/Ticket";

const nodemailer = require("nodemailer");
var xoauth2 = require('xoauth2');
const user = 'passdirect11@gmail.com';
const pass = 'passdirect123456789';

var smtpConfig = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secureConnection: false,
  port: 587,
  requiresAuth: true,
  domains: ["gmail.com", "googlemail.com"],
  auth: {
  user: user,
  pass: pass
  }
  });


module.exports.sendConfirmationEmail = (name: String, email: String) => {
    console.log("Check");
    smtpConfig.sendMail({
      from: user,
      to: email,
      subject: "PassDirect-registracija",
     text:"Pozdrav!\n\n Upravo ste se uspješno registrirali na PassDirect.\n\n Vaš PassDirect tim. "
    }).catch((err: any) => console.log(err));
  };


  module.exports.sendConfirmationEmailForTicket = (firstname: any, lastname: any, email: any, journeyId: any, cardNo: any, CVV: any, expDate: any,departureStation: any,arrivalStation: any,price: any,departureTime: any,arrivalTime: any,datum :any) => {
    console.log("Check");
    smtpConfig.sendMail({
      from: user,
      to: email,
      subject: "PassDirect-registracija",
     text:"Poštovani,\n\nVaša karta se nalazi pri dnu. Hvala Vam na povjerenju i ugodno putovanje,\n Vaš PassDirect tim.\n "+ "\n"+" Ime: " +firstname+"     Prezime: "+lastname+"\n Id putovanja: "+journeyId+"   Broj karte: "+cardNo+"\n Stanica polaska: "+departureStation+"   Stanica dolaska: "+arrivalStation+"\n Datum polaska: "+datum+"\n Predviđeno vrijeme polaska: "+departureTime+"\n Predviđeno vrijeme dolaska: "+arrivalTime+ "\n Cijena:"+price+" kn",
    }).catch((err: any) => console.log(err));
  };

  module.exports.sendConfirmationEmailForTicketWithPosition = (firstname: any, lastname: any, email: any, journeyId: any, cardNo: any, departureStation: any,arrivalStation: any,price: any,departureTime: any,arrivalTime: any, wagon: number, wagonPosition: WagonPosition,datum :any) => {
    console.log("Check");
    smtpConfig.sendMail({
      from: user,
      to: email,
      subject: "PassDirect-registracija",
     text:"Poštovani,\n\nVaša karta se nalazi pri dnu. Hvala Vam na povjerenju i ugodno putovanje,\n Vaš PassDirect tim.\n "+ "\n"+" Ime: " +firstname+"     Prezime: "+lastname+"\n Id putovanja: "+journeyId+"   Broj karte: "+cardNo+"\n Stanica polaska: "+departureStation+"   Stanica dolaska: "+arrivalStation+"\n Datum polaska: "+datum+"\n Predviđeno vrijeme polaska: "+departureTime+"\n Predviđeno vrijeme dolaska: "+arrivalTime+ "\n Cijena:"+price+" kn" + "\n Broj kolosijeka: "+ 1 +"\n Broj vagona: "+wagon+"\n Broj perona: "+wagon+"\n Pozicija u vagonu: "+(wagonPosition==WagonPosition.Front ? "naprijed":"nazad"),
    }).catch((err: any) => console.log(err));
  };