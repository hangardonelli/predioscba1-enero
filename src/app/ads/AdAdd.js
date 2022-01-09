import React, { useState, useContext, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import api from '../api';
import { DataContext } from '../context';
import { useHistory } from 'react-router-dom';
import DatePicker from "react-datepicker";
import UploadImage from '../components/UploadImage';

const AdAdd = () => {
  const { user } = useContext(DataContext);
  const history = useHistory();
  const [name, setName] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageName, setSelectedImageName] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [category, setCategory] = useState('basic');
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [status, setStatus] = useState(true);


  useEffect(() => {
    if(!user) {
      history.push('/auth/login');
    }
  }, [user]);

  const onFileChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const uploadImage = async (e) => {
    e.preventDefault();
    let formData = new FormData();

    formData.append('folder', 'ads'); 
    formData.append('file', selectedImage);

    // Send formData object. 
    await api.predio.addImage(formData, { headers: {
      'Content-Type': 'multipart/form-data'
    }});
  };

  const handleDate = (value) => {
    const newDate = parseInt(+ new Date(value)/1000);
    setSelectedDate(newDate);
    setDate(new Date(value));
  }

  const save = async (e) => {
    e.preventDefault();

    if (selectedImage) {
      await api.predio.addImage(selectedImage, { headers: {
        'Content-Type': 'multipart/form-data'
      }});
    }

    const dataModel = {
      name,
      category,
      status,
      endDate: selectedDate,
      image: selectedImageName
    };
    
    try {
      const response = await api.ad.add(dataModel, {headers: user.headers});
      setShowMessage('Publicidad agregada.');
      if (response) {
        history.push('/');
      }
    } catch(err) {
      setShowMessage('Error al guardar predio: ', err);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title">Agregar Publicidad</h3>
      </div>
      <div className="col-12 grid-margin">
        <div className="card">
          <div className="card-body">
            <form className="form-sample">
              <div className="row">
              </div>
              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="row">
                    <label className="col-sm-3 col-form-label">Nombre</label>
                    <div className="col-sm-9">
                      <Form.Control 
                        type="text" 
                        id="name" 
                        placeholder="Nombre" 
                        size="lg" 
                        onChange={(e) => setName(e.target.value)} 
                      />
                    </div>
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group className="row">
                  <label className="col-sm-3 col-form-label">Categoria</label>
                    <div className="col-sm-9">
                      <select className="form-control" onChange={(e) => setCategory(e.target.value)}>
                        <option value="basic" selected={category === 'basic' ? true : false}>Basic</option>
                        <option value="standard" selected={category === 'standard' ? true : false}>Standard</option>
                        <option value="premium" selected={category === 'premium' ? true : false}>Premium</option>
                      </select>
                    </div>
                  </Form.Group>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                    <Form.Group className="row">
                      <label className="col-sm-3 col-form-label">Fecha que finaliza</label>
                      <div className="col-sm-9">
                        <DatePicker className="form-control w-100"
                          selected={date}
                          onChange={handleDate}
                        />
                      </div>
                    </Form.Group>
                </div>
                <div className="col-md-6">
                  <UploadImage name="ads" placeholder="La imagen" handleImage={(data, name) => {
                      setSelectedImage(data);
                      setSelectedImageName(name);
                  }} />
                </div>
              </div>
              <div className="template-demo">
              <button type="button" className="btn btn-primary"
              onClick={(e) => save(e)}>Guardar</button>
            </div>
            </form>
          </div>
        </div>
      </div>
      {!showMessage && (
        <div><p>{showMessage}</p></div>
      )}
    </div>
  )
}

export default AdAdd;
