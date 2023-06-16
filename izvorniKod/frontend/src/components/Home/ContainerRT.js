import {React,useState,useEffect} from "react";
import { renderMatches } from "react-router";
import moment from 'moment';
const ContainerRT = (props) =>{

    
    useEffect(()=>{
        console.log(props.routes);
    });
    console.log(props)
    return(
    <table className="routesTable">
        <thead>
        <tr>
        <th>Id</th>
        <th>Odredište</th>
        <th>Dolazak</th>
        </tr>
        </thead>
        {
        props.routes.map(item=><tr>
            <td>{item.id}</td>
            <td>{item.odrediste}</td>
            {item.kasnjenje && <td className="da">{(item.dolazak)}</td>}
            {!item.kasnjenje && <td>{item.dolazak}</td>}
            </tr>)
        }   
    </table>
    )
}

export default ContainerRT;