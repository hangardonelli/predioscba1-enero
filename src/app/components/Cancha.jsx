import React, { useState, useRef, useEffect  } from "react";
import { ReactDOM  } from "react-dom";
import { Form } from 'react-bootstrap';

function Cancha() {

  function handleChange(event) {
    console.log(event.target.value);
  }
  
  return (
    <input name="firstName" onChange={handleChange} />
  );
}


/*
function Cancha(props) {

  const [canchaAct, setCanchaAct] = useState(props.cancha);
  const [state, setState] = useState('');
  this.handleChange = this.handleChange.bind(this);
  this.handleSubmit = this.handleSubmit.bind(this);
  

 
  function priceChanger(cancha){
    cancha.price = state.price;
    console.log("cambiado!");

    return cancha;
  }

    console.log(state.price);

// $<input  id="iprice" onChange={handleChange} value={state.price} type="text"></input> 
    return(
      <div className="CanchaDetail">
      <h1>Cancha {props.cancha == null ? '' : props.cancha.id}</h1>
      <h4>Jugadores: {state.price}</h4>
      <h4>Activa: {props.cancha.status ? 'Sí' : 'No'}</h4>
      <h4>Precio:
       </h4>
      <h4>Tipo de pasto: {props.cancha.typeCourt == 'sintetico' ? 'Sintético' : 'Natural'}</h4>
      
      <button  style={{marginRight:'20px'}}
        onClick={() => props.updater(priceChanger(props.cancha, props.cancha.value))}
        type="button" 
        className="btn btn-success btn-sm"
        >Editar</button>
      <button 
        type="button" 
        className="btn btn-danger btn-sm"
        >Eliminar</button>
         
      </div>);
    }
    */
  export default Cancha;
