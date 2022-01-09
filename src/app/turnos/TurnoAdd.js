import React, { useState, useEffect, useContext } from 'react';
import { Form } from 'react-bootstrap';
import { DataContext } from '../context';
import { useHistory } from 'react-router-dom';
import api from '../api';
import DatePicker from "react-datepicker";
import listPreferences from '../../data/preferences';
import hours from '../../data/hours';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const TurnoAdd = ({location}) => {
  const { user } = useContext(DataContext);
  const history = useHistory();
  const [predios, setPredios] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [court, setCourt] = useState(null);
  const [date, setDate] = useState(new Date());
  const [hour, setHour] = useState('21:00');
  const [selectedDate, setSelectedDate] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const [price, setPrice] = useState(0);
  const [predio, setPredio] = useState(null);
  const [message, setMessage] = useState(null);
 
  useEffect(() => {
    if(!user) {
      history.push('/auth/login');
    } else {
      setPredio(user.predio);
    }
  }, [user]);

  const handlePredio = (e) => {
    setPredio(predios[e.target.value]._id);
  }

  const handlePlayer = (e) => {
    const option = e.target.value.split('-');
    setSelectedPlayer(parseInt(option[0]));
    setCourt(parseInt(option[1]));
    setPrice(parseInt(option[2]));
  }

  const handlePreference = (value) => {
    const dataPreferences = [...preferences];
    if (!dataPreferences.includes(value)) {
      dataPreferences.push(value);
    } else {
      dataPreferences.splice(dataPreferences.indexOf(value), 1);
    }

    setPreferences(dataPreferences);
  }

  const onChange = date => {
    setDate(date);
    const allDays = getDatesBetweenDates(date[0], date[1]);
    const days = [];
    allDays.map(item => {
      const newDate = new Date(item).toLocaleDateString("es-ES", {
        day: '2-digit',
        month: '2-digit',  
        year: 'numeric' 
      });
      days.push(newDate);
    });
    setSelectedDate(days);
  };

  const getDatesBetweenDates = (startDate, endDate) => {
    let dates = []
    //to avoid modifying the original date
    const theDate = new Date(startDate)
    while (theDate < endDate) {
      dates = [...dates, new Date(theDate)]
      theDate.setDate(theDate.getDate() + 1)
    }
    return dates
  }

  const save = async () => {

    const dataModels = [];
    selectedDate.map((day, i) => {
      const dataModel = {
        predio,
        players: selectedPlayer,
        court,
        preferences,
        date: day,
        price,
        hour
      }
      dataModels.push(dataModel);
    })
    
    const response = await api.turno.add(dataModels, {headers: user.headers});

    if (response) {
      setMessage('Los turnos fueron creados correctamente');
    }

  }

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title">Agregar Turno</h3>
      </div>
      <div className="row">
        <div className="col-md-6 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              {message ? (
                <div className="row proBanner bg-error">
                  <div className="col-12">
                    <span className="d-flex align-items-center alert-order text-white">
                      {message}
                    </span>
                  </div>
                </div>
              ) : (  
                <form className="forms-sample">
                  <Form.Group>
                    <label htmlFor="options">Opciones</label>
                    <select className="form-control" id="options" onChange={handlePlayer}>
                      {predio && predio.courts.map((court, iCourt) => (
                        <option value={`${court.players}-${iCourt}-${court.price}`}>{`Cesped ${court.type}: ${court.players} vs ${court.players} ($${court.price})`}</option>
                      ))}
                    </select>
                  </Form.Group>
                  <Form.Group>
                    <label className="col-form-label">Hora</label>
                    <div>
                      <select className="form-control" id="localidad" onChange={(e) => setHour(e.target.value)}>
                        {hours.map(hourItem => (
                          <option value={hourItem}>{hourItem}</option>
                        ))}
                      </select>
                    </div>
                  </Form.Group>
                  <Form.Group>
                    <label htmlFor="calendar" className="col-sm-3 col-form-label">Seleccione dias</label>
                    <div>
                      <Calendar
                        onChange={onChange}
                        value={date}
                        allowPartialRange={true}
                        minDate={new Date()}
                        selectRange={true}
                      />
                    </div>
                  </Form.Group>
                  <Form.Group>
                    {listPreferences.map(preference => (
                      <div className="form-check form-check-success">
                        <label className="form-check-label">
                          <input 
                            type="checkbox" 
                            className="form-check-input"
                            onClick={() => handlePreference(preference.val)}
                          /> {preference.label} 
                          <i className="input-helper"></i>
                        </label>
                      </div>
                    ))}
                  </Form.Group>
                  {/* <Form.Group>
                    <div className="form-check form-check-primary">
                      <label className="form-check-label">
                        <input type="checkbox" className="form-check-input" defaultChecked /> Destacado
                        <i className="input-helper"></i>
                      </label>
                    </div>
                    <div className="form-check form-check-success">
                      <label className="form-check-label">
                        <input type="checkbox" className="form-check-input" defaultChecked /> Publicado 
                        <i className="input-helper"></i>
                      </label>
                    </div>  
                  </Form.Group> */}
                  <button type="button" className="btn btn-primary" onClick={() => save()}>Crear !</button>            
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TurnoAdd
