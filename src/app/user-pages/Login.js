import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { DataContext } from '../context';
import { useHistory } from 'react-router-dom';
import api from '../api';
import PropagateLoader from "react-spinners/PropagateLoader";

const Login = () => {
  const history = useHistory();
  const { user, setUser } = useContext(DataContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(user && user.role === 'admin') {
      history.push('/home');
    } else if (user && user.role === 'predio_admin') {
      history.push('/turnos');
    }
  }, [user]);

  const signInWithEmailAndPasswordHandler = async (event,email, password) => {
    event.preventDefault();
    setLoading(true);
    if(email && password) {
      try {
        const response = await api.auth.login(
          {email, password}, 
          {headers: {'Content-Type': 'application/json'}}
        );
  
        if (response) {
          setUser(response.data);
        }
      } catch(err) {
        setMessage('Email o contraseña incorrectos.');
      }
    }
    setLoading(false);
  };
  
  const onChangeHandler = (event) => {
    const {name, value} = event.currentTarget;
  
    if(name === 'userEmail') {
        setEmail(value);
    }
    else if(name === 'userPassword'){
      setPassword(value);
    }
  };

  return (
    <div id="login-page">
      <div className="d-flex align-items-center auth px-0">
        {error !== null && <div className = "py-4 bg-red-600 w-full text-white text-center mb-3">{error}</div>}
        <div className="row w-100 mx-0">
          <div className="col-lg-4 mx-auto">
            <div className="auth-form-light text-left py-5 px-4 px-sm-5">
              {/* <div className="brand-logo">
                <img src={require("../../assets/images/logo.jpg")} alt="logo" className="text-center" />
              </div> */}
              {message &&
                <div className="row proBanner bg-error">
                  <div className="col-12">
                    <span className="d-flex align-items-center alert-order text-white">
                      {message}
                    </span>
                  </div>
                </div>
              }
              <h4>Bienvenido !!</h4>
              <h6 className="font-weight-light">Ingresa para administrar tu predio.</h6>
              <Form className="pt-3">
                <Form.Group className="d-flex search-field">
                  <Form.Control 
                    type="email"
                    name="userEmail"
                    placeholder="Email" 
                    size="lg" 
                    className="h-auto"
                    onChange={(e => onChangeHandler(e))}
                  />
                </Form.Group>
                <Form.Group className="d-flex search-field">
                  <Form.Control
                    type="password" 
                    name="userPassword"
                    placeholder="Password" 
                    size="lg" 
                    className="h-auto"
                    onChange={(e => onChangeHandler(e))}
                  />
                </Form.Group>
                <div className="mt-3">
                  <button 
                    className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                    onClick = {(event) => {signInWithEmailAndPasswordHandler(event, email, password)}}
                  >
                    <PropagateLoader
                      size={15}
                      color={"#FFFFFF"}
                      loading={loading}
                    />
                    {!loading && 'INGRESAR'}
                  </button>
                </div>
                <div className="mt-3">
                  <button 
                    className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                    onClick = {() => history.push('/predio/add')}
                  >
                    AGREGA TU PREDIO
                  </button>
                </div>
                {/* <div className="my-2 d-flex justify-content-between align-items-center">
                  <div className="form-check">
                    <label className="form-check-label text-muted">
                      <input type="checkbox" className="form-check-input"/>
                      <i className="input-helper"></i>
                      Mantenerme conectado
                    </label>
                  </div>
                  <a href="!#" onClick={event => event.preventDefault()} className="auth-link text-black">Olvidaste tu contraseña?</a>
                </div> */}
                {/* <div className="text-center mt-4 font-weight-light">
                  Aun no te registras ? <Link to="/user-pages/register" className="text-primary">Hazlo ahora !</Link>
                </div> */}
              </Form>
            </div>
          </div>
        </div>
      </div>  
    </div>
  )
}

export default Login
