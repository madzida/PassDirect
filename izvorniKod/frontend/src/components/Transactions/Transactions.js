import React, { useEffect, useState } from 'react';
//import DatePicker from 'react-datepicker';
import Header from "../Header/Header";
import 'react-datepicker/dist/react-datepicker.css'
//import { useNavigate,useLocation } from 'react-router';
import ContainerT from './ContainerT';
import { useLocation } from 'react-router-dom';
import Header2 from '../Header/Header2';
/* eslint-disable react-hooks/exhaustive-deps */

let list=[];



const Transactions=()=>{

  const location= useLocation();
  // var trans= location.state;
  /* var msg=localStorage.getItem("msg")
  var items=localStorage.getItem("transactions") */
 /*  console.log(msg)
  console.log(items) */
  const [transactions, setTransactions]=useState({list:[{
    firstName:"",
    lastName:"",
    ticketId:"",
    travelDate:"",
    departureStation:"",
    arrivalstation:"",
    price:""
}]});

//var transakcije= location.state;


/* useEffect(async()=>{
  setTransactions({
    list:transakcije
  })
}) */




  return (
    <div>
    <div><Header2/></div>
        <div >
            
                <h1 className="title">Popis transakcija</h1>
                <h5 className="containerT"><span>Ime i prezime</span><span>Oznaka karte</span><span>Polazno stajalište-Dolazno stajalište</span><span>Cijena</span><span>Datum putovanja</span></h5>
                <hr />
                      {location.state.map(t=>ContainerT(t))} 
            </div>
            </div>
  )
}
export default Transactions;