import React, { useState, useEffect, useContext } from 'react';
import { ProgressBar } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import api from '../api';
import { DataContext } from '../context';

const Account = () => {
  const history = useHistory();
  const { user } = useContext(DataContext);
  const [listTurnos, setListTurnos] = useState([]);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    fetchTurnos();
  }, []);

  const fetchTurnos = async () => {
    const predioId = user.predio.id;
    console.log("el predio id es")
    console.log(predioId);
    const dataModel = {
      predioId,
  
    }
    const response = await api.turno.getList({headers: user.headers}, predioId);
    console.log("LA RESPUESTA ES:");
    console.log(JSON.stringify(response.data));
    if (response) {
      setListTurnos(response.data.filter(t => !t.feePaid && t.confirm));
      let addAmount = 0
      response.data.filter(t => !t.feePaid && t.confirm).map(item => {
        addAmount += Math.trunc(item.price * 0.05)
      });

      setAmount(addAmount);
    }
  }

  return (
    <div>
      <div className="row">
        <div className="col-lg-12 grid-margin">
          <div className="card">
            {amount ? <div className="card-header">Saldo pendiente: ${amount}</div> : null}
            <div className="card-body">
              <h4 className="card-title">Turnos no abonados.</h4>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th></th>
                      <th> Día </th>
                      <th> Jugadores </th>
                      <th> Cesped </th>
                      <th> Hora </th>
                      <th> Precio </th>
                      <th> </th>
                    </tr>
                  </thead>
                  <tbody>
                    {listTurnos.map((turnoItem, p) => (
                      <tr key={p}>
                        <td className="font-weight-medium">{p + 1}</td>
                        <td> {turnoItem.day} </td>
                        <td> {turnoItem.label} </td>
                        <td> {turnoItem.typeCourt} </td>
                        <td> {turnoItem.hour} </td>
                        <td> {turnoItem.price} </td>
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
  )
}

export default Account;
