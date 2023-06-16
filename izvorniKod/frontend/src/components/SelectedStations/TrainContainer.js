import React, {useState} from "react"
import {Link,withRouter,useNavigate} from 'react-router-dom';
let list=[];
const TrainContainer = (props) =>{

    const navigate = useNavigate();
    const handleTicketSelection=(id,routeId,price,travelDate) =>{

        navigate('/payment',{
            state:{
                IdJourney: id,
                IdTrainRoute: routeId,
		        price:price,
                travelDate:travelDate
            }
        });
    }
    return (
        <div id = {props.trainID}>
          <h5 className="containerTrains">
            <span>{props.trainID}</span>
            <span>{props.departureStation}</span>
            <span>{props.departureTime}</span>
            <span>{props.arrivalStation}</span>
            <span>{props.arrivalTime}</span>
            <span>{props.track}</span>
            {/* <span>{props.delay}</span> */}
            <span>{props.price}</span>
            {!props.msg && <span><button className="button2" onClick={()=>handleTicketSelection(props.id,props.routeId,props.price,props.travelDate)}>Kupi kartu</button></span>}
            </h5>
        </div>
    )
}

export default TrainContainer;
