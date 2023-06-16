import React from "react"
import { Link } from "react-router-dom";
import Transactions from "../Transactions/Transactions"; 

const ContainerT = (props) =>{
    
    return (
        <div id={props.ticketId}>
          <h5 className="containerT">
            <span style={{fontSize:20}}>{props.firstName}  {props.lastName}</span>
            <span style={{fontSize:20}}>{props.ticketId}</span>
            <span style={{fontSize:20}}>{props.departureStation} - {props.arrivalStation}</span>
            <span style={{fontSize:20}}>{props.price} HRK</span>
            <span style={{fontSize:20}}>{props.travelDate}</span>
            </h5>
        </div>
    )
}

export default ContainerT;
