import React, {useState} from "react"
    
let list=[];
const TrainContainerAdmin = (props) =>{

    const [values, setValues]=useState({list:[{
        trainID: props.trainID,
        departureStation: props.departureStation,
        departureTime: props.departureTime,
        arrivalStation: props.arrivalStation,
        arrivalTime: props.arrivalTime,
        track: props.track,
        delay: props.delay,
        price: props.price
    }]});

    return (
        <div id = {props.trainID}>
          <h5 className="containerTrainsAdmin">
            <span>{props.trainID}</span>
            <span>{props.departureStation}</span>
            <span>{props.departureTime}</span>
            <span>{props.arrivalStation}</span>
            <span>{props.arrivalTime}</span>
            <span>{props.track}</span>
            
            <span>{props.price}</span>
            </h5>
        </div>
    )
}

export default TrainContainerAdmin;
