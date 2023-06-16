import React, {useState, useEffect} from 'react';
import Header2 from "../Header/Header2";
import TrainContainerAdmin from './TrainContainerAdmin';
import {Link,withRouter,useLocation} from 'react-router-dom';
import Header3 from "../Header/Header3";

function StationsAdmin(props) {
    const location = useLocation();
    let list=[];
    const TrainContainerAdmin = (props) =>{


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
    const [journeys, setJourneys]=useState({list:[{
        trainID: -1,
        departureStation:"",
        departureTime:new Date(),
        arrivalStation:"",
        arrivalTime:new Date(),
        track: 1,
        delay: -1,
        price: 0.00
    }]});

   

    return (
        <div>
            <div><Header2 /></div>
            <div>
            {(() => {
                if (location.state[0].msg) {
                    return <h2>{location.state[0].msg}</h2>;
                } else {
                    return <div>
                     <h1 className="title">Vozni red</h1>
                    <h5 className="containerTrainsAdmin"><span>ID vlaka</span>
                        <span>Mjesto polaska</span><span>Vrijeme polaska</span><span>Mjesto dolaska</span><span>Vrijeme dolaska</span>
                        <span>Kolosijek</span>
                        {/* <span>Kašnjenje</span> */}
                        <span>Cijena (HRK)</span></h5>
                    <hr />
                    </div>;
                }
                })()}
                <div>{location.state.map(t=>TrainContainerAdmin(t))}</div>
            </div>
        </div>);
}
export default StationsAdmin;