import React, { useState, useEffect, useContext } from 'react';
import { ProgressBar } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import api from '../api';
import { DataContext } from '../context';

const Turnos = () => {
  const history = useHistory();
  const { user } = useContext(DataContext);
  const [listTurnos, setListTurnos] = useState([]);

  useEffect(() => {
    fetchTurnos();
  }, []);

  const fetchTurnos = async () => {
    console.log("la lista de user es");
    console.log(user);
    const predioId = user.predio.id;
    console.log(predioId);
    const response = await api.turno.getList({headers: user.headers}, predioId);

  
    if (response) {

      console.log(response.data);
      setListTurnos(response.data);
    }
  }

  const goToEditTurno = (e, id) => {
    e.preventDefault();
    history.push(`/turno/${id}/edit`);
  }

  const cancelarTurno = async (e, id, status) => {
    e.preventDefault();
    const dataModel = {
      id,
      status,
      origin: 'admin'
    }
    const response = await api.turno.disable({headers: user.headers}, dataModel);
    
    if (response) {
      history.push(`/`);
    }
  }


  const confirmarTurno = async(e, id, status) => {
    e.preventDefault();
    const dataModel = {
      id,
      status
    }

    const response = await api.turno.confirm({headers: user.headers}, dataModel);

    if(response){
      history.push(`/`);
    }
  }
  return (
    <div>
      <div className="row">
        <div className="col-lg-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Turnos</h4>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th></th>
                      <th> Jugadores </th>
                      <th> Cesped </th>
                      <th> Hora </th>
                      <th> Estado </th>
                      <th> Día </th>
                      <th> Código </th>
                      <th> </th>
                    </tr>
                  </thead>
                  <tbody>
                    {listTurnos.reverse().map((turnoItem, p) => (
                      <tr key={p} onClick={(e) => goToEditTurno(e, turnoItem._id)}>
                        <td className="font-weight-medium">{p + 1}</td>
                        <td> {turnoItem.label} </td>
                        <td> {turnoItem.typeCourt} </td>
                        <td> {turnoItem.hour} </td>
                        <td>
                          {turnoItem.status ? (turnoItem.confirm ? 'Confirmado' : 'Cancelado') : (
                            <ProgressBar variant={turnoItem.status ? "success" : "danger"} striped now={100}/>
                          )} 
                        </td>
                        <td> {turnoItem.day} </td>
                        <td> {turnoItem.code} </td>
                        <td>
                          {!turnoItem.status && 
                          <button 
                            type="button" 
                            className="btn btn-primary" 
                            onClick={(e) => cancelarTurno(e, turnoItem._id, true)}>Cancelar</button>
                         }
                        </td>
                        <td>
                        {!turnoItem.status && <button 
                            type="button" 
                            className="btn btn-primary" 
                            onClick={(e) => confirmarTurno(e, turnoItem._id, true)}>Confirmar</button>
                        }
                      </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> 
  );
}

export default Turnos;