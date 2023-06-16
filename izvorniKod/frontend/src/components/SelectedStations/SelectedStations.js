import React, {useState, useEffect} from 'react';

import {Link,withRouter,useLocation,useNavigate} from 'react-router-dom';
import Header from "../Header/Header";
import Header3 from '../Header/Header3';
import TrainContainer from './TrainContainer';

let list=[];

function SelectedStations(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const TrainContainer = (props) =>{

       
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
    
    console.log(location.state)
    const [journey, setJourney]=useState({list:[{
        trainID: -1,
        departureStation:"",
        departureTime:new Date(),
        arrivalStation:"",
        arrivalTime:new Date(),
        track: 1,
        delay: -1,
        price: 0.00
    }]});
    let list=[]
 
    console.log("asgvasvzv")
    return (
        <div>
            <div><Header/></div>
            <div>
            {(() => {
                if (location.state[0].msg) {
                    return <h2>{location.state[0].msg}</h2>;
                } else {
                    return <div>
                     <h1 className="title">Vozni red</h1>
                    <h5 className="containerTrains"><span>ID vlaka</span>
                        <span>Mjesto polaska</span><span>Vrijeme polaska</span><span>Mjesto dolaska</span><span>Vrijeme dolaska</span>
                        <span>Kolosijek</span>
                        {/* <span>Kašnjenje</span> */}
                        <span>Cijena (HRK)</span><span>Kupi kartu</span></h5>
                    <hr />
                    </div>;
                }
                })()}
                <div>{location.state.map(t=>TrainContainer(t))}</div>
            </div>
        </div>);
}
export default SelectedStations;