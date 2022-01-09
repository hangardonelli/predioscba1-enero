import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { DataContext } from '../context';
import { useHistory } from 'react-router-dom';

const Register = () => {
  const { user, setUser } = useContext(DataContext);
  const history = useHistory();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if(user) {
      history.push('/home');
    }
  }, [user]);

  const createUserWithEmailAndPasswordHandler = async (event, email, password) => {
    event.preventDefault();

    if (password.length < 6) {
      return;
    }

    try {
      const userData = await api.auth.register({firstName, lastName, email, password}, {headers: {'Content-Type': 'application/json'}});
      setUser(userData.data);
    } catch(err) {
      setError('Error Signing up with email and password: ', err);
    }
    
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setPhone("");
    
  };

  const onChangeHandler = event => {
    const { name, value } = event.currentTarget;

    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "firstName") {
      setFirstName(value);
    } else if (name === "lastName") {
      setLastName(value);
    } else if (name === "phone") {
      setPhone(value);
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center auth px-0">
        <div className="row w-100 mx-0">
          <div className="col-lg-4 mx-auto">
            <div className="auth-form-light text-left py-5 px-4 px-sm-5">
              <div className="brand-logo">
                <img src={require("../../assets/images/logo.svg")} alt="logo" />
              </div>
              <div>
                {error !== null && (
                  <div className="py-4 bg-red-600 w-full text-white text-center mb-3">
                    {error}
                  </div>
                )}
              </div>
              <h4>Eres nuevo ?</h4>
              <h6 className="font-weight-light">Registrarte es facil, solo toma unos minutos.</h6>
              <form className="pt-3">
                <div className="form-group">
                  <input 
                    type="text"
                    name="firstName"
                    className="form-control form-control-lg" 
                    placeholder="Nombre"
                    onChange={event => onChangeHandler(event)}
                  />
                </div>
                <div className="form-group">
                  <input 
                    type="text"
                    name="lastName"
                    className="form-control form-control-lg" 
                    placeholder="Apellido"
                    onChange={event => onChangeHandler(event)}
                  />
                </div>
                <div className="form-group">
                  <input 
                    type="text"
                    name="phone"
                    className="form-control form-control-lg" 
                    placeholder="Teléfono"
                    onChange={event => onChangeHandler(event)}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    className="form-control form-control-lg"
                    placeholder="Email"
                    onChange={event => onChangeHandler(event)}
                  />
                </div>
                <div className="form-group">
                  <select className="form-control form-control-lg" id="exampleFormControlSelect2">
                    <option>Country</option>
                    <option>United States of America</option>
                    <option>United Kingdom</option>
                    <option>India</option>
                    <option>Germany</option>
                    <option>Argentina</option>
                  </select>
                </div>
                <div className="form-group">
                  <input 
                    type="password"
                    name="password"
                    className="form-control form-control-lg" 
                    placeholder="Password"
                    onChange={event => onChangeHandler(event)}
                  />
                </div>
                <div className="mb-4">
                  <div className="form-check">
                    <label className="form-check-label text-muted">
                      <input type="checkbox" className="form-check-input" />
                      <i className="input-helper"></i>
                      Al registrarte, aceptás nuestros Términos de servicio y Política de privacidad
                    </label>
                  </div>
                </div>
                <div className="mt-3">
                  <button
                    className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                    onClick={event => {
                      createUserWithEmailAndPasswordHandler(event, email, password);
                    }}
                  >Registrarse</button>
                </div>
                <div className="text-center mt-4 font-weight-light">
                  <Link to="/auth/login" className="text-primary">Ingresar</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
