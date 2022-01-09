import React, { useState, useEffect, useContext } from 'react';
import { ProgressBar, Modal, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import api from '../api';
import { DataContext } from '../context';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss'

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})

const Home = () => {
  const history = useHistory();
  const { user } = useContext(DataContext);
  const [listPredios, setListPredios] = useState([]);
  const [listPrediosDisable, setListPrediosDisable] = useState([]);
  const [show, setShow] = useState(false);
  const [listTurnos, setListTurnos] = useState([]);

  useEffect(() => {
    if (user) {
      fetchPredios();
    } else {
      history.push(`/auth/login`);
    }
  }, [user]);

  const fetchPredios = async () => {
    const response = await api.predio.getList({headers: user.headers});
    console.log(response.data);
    const responseDisable = await api.predio.getListDisable({headers: user.headers});

    if (response) {
      setListPredios(response.data);
    }
    if (responseDisable) {
      setListPrediosDisable(responseDisable.data);
    }
  }

  const goToEditPredio = (e, id) => {
    e.preventDefault();
    history.push(`/predio/${id}/edit`);
  }

  const enablePredio = async (e, id, status) => {
    const dataModel = {
      id,
      status
    }
    const response = await api.predio.enable({headers: user.headers}, dataModel);
    
    if (response) {
      history.push(`/`);
    }
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const pay = async (e, predioUserId, userId, predioId) => {
    const { value: amount } = await Swal.fire({
      title: 'Ingrese el monto del pago',
      input: 'text',
      inputValue: '',
      showCancelButton: true,
      inputValidator: (value) => {
        console.log(value);
        if (!value) {
          return 'Debe ingresar un monto!'
        }
      }
    })
    
    if (amount) {
      swalWithBootstrapButtons.fire({
        title: 'Esta seguro?',
        text: "Aun puedes revertirlo!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, pagar!',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true
      }).then(async (result) => {
        if (result.isConfirmed) {
          const dataModel = {
            userId,
            predioUserId,
            amount,
            method: 'efectivo',
            idPredio: predioId,
          };
          const pay = await api.pay.add(dataModel, user.headers);
          if (pay.status === 200) {
            console.log(pay);
            swalWithBootstrapButtons.fire(
              'Pagado!',
              'Se han abonado los turnos compatibles con el importe indicado',
              'success'
            )
          }
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelado',
            'Su pago no realizo',
            'error'
          )
        }
      })
    }
  }

  const showTurnosFee = async (id) => {
    handleShow();
    const response = await api.turno.getNotPaidFee({headers: user.headers}, id);

    if (response) {
      console.log("ACA SE VA A VER LA LISTA");
      console.log("ACA SE VA A VER LA LISTA");
      console.log("ACA SE VA A VER LA LISTA");
      console.log("ACA SE VA A VER LA LISTA");
      console.log("ACA SE VA A VER LA LISTA");
      console.log("ACA SE VA A VER LA LISTA");
      
      setListTurnos(response.data);
      console.log(response.data);
      console.log("ARRIBA SE VA A VER LA LISTA");
      console.log("ARRIBA SE VA A VER LA LISTA");
      console.log("ARRIBA SE VA A VER LA LISTA");
      console.log("ARRIBA SE VA A VER LA LISTA");
      console.log("ARRIBA SE VA A VER LA LISTA");
      console.log("ARRIBA SE VA A VER LA LISTA");
      
      console.log("ARRIBA SE VA A VER LA LISTA");
    }
  }

  return (
    <div id="predios-page">
      <div className="row">
        <div className="col-lg-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Predios</h4>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th></th>
                      <th> Nombre </th>
                      <th> Direccion </th>
                      <th> Estado </th>
                      <th> Cant. Canchas </th>
                      <th> Saldo </th>
                      <th> </th>
                    </tr>
                  </thead>
                  <tbody>
                    {listPredios.map((predioItem, p) => (
                      
                      <tr key={p}>
                        <td className="font-weight-medium">{p + 1}</td>
                        <td onClick={(e) => goToEditPredio(e, predioItem._id)}> {predioItem.name} </td>
                        <td> {predioItem.address} </td>
                        <td>
                          <ProgressBar variant={predioItem.status ? "success" : "danger"} striped now={100}/>
                        </td>
                        <td> {predioItem.courts.length} </td>
                        <td>
                          <Button variant="primary" onClick={() => showTurnosFee(predioItem.id)}>
                            $ {predioItem.account ? predioItem.balance : 0}
                          </Button> 
                        </td>
                        <td> 
                          <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={(e) => pay(e, predioItem.userId, user._id, predioItem.id)}>Nuevo Pago</button>
                        </td>
                        <td>
                          <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={(e) => enablePredio(e, predioItem._id, false)}>Desabilitar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Predios nuevos</h4>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th></th>
                      <th> Nombre </th>
                      <th> Direccion </th>
                      <th> Estado </th>
                      <th> </th>
                    </tr>
                  </thead>
                  <tbody>
                    {listPrediosDisable.map((predioItem, p) => (
                      // <tr key={p} onClick={(e) => goToEditPredio(e, predioItem._id)}>
                      <tr>
                        <td className="font-weight-medium">{p + 1}</td>
                        <td> {predioItem.name} </td>
                        <td> {predioItem.address} </td>
                        <td>
                          <ProgressBar variant={predioItem.status ? "success" : "danger"} striped now={100}/>
                        </td>
                        <td>
                          <button 
                            type="button" 
                            className="btn btn-primary" 
                            onClick={(e) => enablePredio(e, predioItem._id, true)}>Habilitar</button>
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
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Turnos que adeuda</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="row">
            <div className="col-lg-12 grid-margin">
              <div className="card">
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th></th>
                          <th> Dia </th>
                          <th> Jugadores </th>
                          <th> Cesped </th>
                          <th> Hora </th>
                          <th> </th>
                        </tr>
                      </thead>
                      <tbody>
                        {listTurnos.map((turnoItem, p) => (
                          <tr key={p}>
                            <td className="font-weight-medium">{p + 1}</td>
                            <td> {turnoItem.date} </td>
                            <td> {turnoItem.label} </td>
                            <td> {turnoItem.typeCourt} </td>
                            <td> {turnoItem.hour} </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </div> 
  );
}

export default Home;