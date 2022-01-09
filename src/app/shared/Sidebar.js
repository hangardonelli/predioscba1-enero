import React, { useState, useContext } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';
import { Dropdown } from 'react-bootstrap';
import { DataContext } from '../context';

const Sidebar = () => {
  const { user } = useContext(DataContext);
  const [prediosPageMenuOpen, setPrediosPageMenuOpen] = useState(false);
  const [publicidadesPagesMenuOpen, setPublicidadesPagesMenuOpen] = useState(false);
  const [userPagesMenuOpen, setUserPagesMenuOpen] = useState(false);

  const isPathActive = (path) => {
    if (path === window.location.pathname) {
      return true;
    }
    return false;
  }

  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
      <ul className="nav">
        <li className="nav-item nav-profile not-navigation-link">
          <div className="nav-link">
            <Dropdown>
              <Dropdown.Toggle className="nav-link user-switch-dropdown-toggler p-0 toggle-arrow-hide bg-transparent border-0 w-100">
                <div className="d-flex justify-content-between align-items-start">
              
                  <div className="text-left ml-3">
                    <p className="profile-name">{user && user.predio ? user.predio.name : 'Administrador'}</p>
                    <small className="designation text-muted text-small">Manager</small>
                    <span className="status-indicator online"></span>
                  </div>
                </div>
              </Dropdown.Toggle>
            </Dropdown>
            {/* {user && user.role === 'predio_admin' ? (
              <Link className="nav-link" to="/turno/add">
                <button className="btn btn-success btn-block">Agregar Turno <i className="mdi mdi-plus"></i></button>
              </Link>
            ) : null} */}
          </div>
        </li>
        {/* <li className={ this.isPathActive('/dashboard') ? 'nav-item active' : 'nav-item' }>
          <Link className="nav-link" to="/dashboard">
            <i className="mdi mdi-television menu-icon"></i>
            <span className="menu-title">Dashboard</span>
          </Link>
        </li> */}
        {user && user.role === 'admin' ? (
          <li className={ isPathActive('/home') ? 'nav-item active' : 'nav-item' }>
            <Link className="nav-link" to="/home">
              <i className="mdi mdi-television menu-icon"></i>
              <span className="menu-title">Home</span>
            </Link>
          </li>
        ) : null}
        {/* <li className={ this.isPathActive('/basic-ui') ? 'nav-item active' : 'nav-item' }>
          <div className={ this.state.basicUiMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('basicUiMenuOpen') } data-toggle="collapse">
            <i className="mdi mdi-crosshairs-gps menu-icon"></i>
            <span className="menu-title">Basic UI Elements</span>
            <i className="menu-arrow"></i>
          </div>
          <Collapse in={ this.state.basicUiMenuOpen }>
            <ul className="nav flex-column sub-menu">
              <li className="nav-item"> <Link className={ this.isPathActive('/basic-ui/buttons') ? 'nav-link active' : 'nav-link' } to="/basic-ui/buttons">Buttons</Link></li>
              <li className="nav-item"> <Link className={ this.isPathActive('/basic-ui/dropdowns') ? 'nav-link active' : 'nav-link' } to="/basic-ui/dropdowns">Dropdowns</Link></li>
              <li className="nav-item"> <Link className={ this.isPathActive('/basic-ui/typography') ? 'nav-link active' : 'nav-link' } to="/basic-ui/typography">Typography</Link></li>
            </ul>
          </Collapse>
        </li> */}
        {/* <li className={ this.isPathActive('/form-elements') ? 'nav-item active' : 'nav-item' }>
          <Link className="nav-link" to="/form-elements/basic-elements">
            <i className="mdi mdi-format-list-bulleted menu-icon"></i>
            <span className="menu-title">Form Elements</span>
          </Link>
        </li> */}
        {/* <li className={ this.isPathActive('/pedidosdehoy') ? 'nav-item active' : 'nav-item' }>
          <Link className="nav-link" to="/pedidosdehoy">
            <i className="mdi mdi-format-list-bulleted menu-icon"></i>
            <span className="menu-title">pedidos de hoy</span>
          </Link>
        </li> */}
        {user && user.role === 'predio_admin' ? (
          <li className={ isPathActive('/turnos') ? 'nav-item active' : 'nav-item' }>
            <Link className="nav-link" to="/turnos">
              <i className="mdi mdi-format-list-bulleted menu-icon"></i>
              <span className="menu-title">Turnos</span>
            </Link>
          </li>
        ) : null}
        {user && user.role === 'predio_admin' ? (
          <li className={ isPathActive('/predio/edit') ? 'nav-item active' : 'nav-item' }>
            <Link className="nav-link" to="/predio/edit">
              <i className="mdi mdi-format-list-bulleted menu-icon"></i>
              <span className="menu-title">Editar Predio</span>
            </Link>
          </li>
        ) : null}
        {user && user.role === 'predio_admin' ? (
          <li className={ isPathActive('/account') ? 'nav-item active' : 'nav-item' }>
            <Link className="nav-link" to="/account">
              <i className="mdi mdi-format-list-bulleted menu-icon"></i>
              <span className="menu-title">Mi cuenta</span>
            </Link>
          </li>
        ) : null}
        {user && user.role === 'admin' ? (
          <li className={ isPathActive('/predios') ? 'nav-item active' : 'nav-item' }>
            <div className={ prediosPageMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => setPrediosPageMenuOpen(!prediosPageMenuOpen) } data-toggle="collapse">
              <i className="mdi mdi-format-list-bulleted menu-icon"></i>
              <span className="menu-title">Predios</span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={prediosPageMenuOpen}>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={ isPathActive('/home') ? 'nav-link active' : 'nav-link' } to="/home">Lista</Link></li>
                <li className="nav-item"> <Link className={ isPathActive('/predio/add') ? 'nav-link active' : 'nav-link' } to="/predio/add">Agregar</Link></li>
              </ul>
            </Collapse>
          </li>
        ) : null}
        {/* <li className={ this.isPathActive('/tables') ? 'nav-item active' : 'nav-item' }>
          <Link className="nav-link" to="/tables/basic-table">
            <i className="mdi mdi-table-large menu-icon"></i>
            <span className="menu-title">Tables</span>
          </Link>
        </li> */}
        {/* <li className={ this.isPathActive('/orders') ? 'nav-item active' : 'nav-item' }>
          <Link className="nav-link" to="/orders">
            <i className="mdi mdi-table-large menu-icon"></i>
            <span className="menu-title">Predios</span>
          </Link>
        </li> */}
        {/* <li className={ this.isPathActive('/icons') ? 'nav-item active' : 'nav-item' }>
          <Link className="nav-link" to="/icons/font-awesome">
            <i className="mdi mdi-account-box-outline menu-icon"></i>
            <span className="menu-title">Icons</span>
          </Link>
        </li> */}
        {/* <li className={ this.isPathActive('/charts') ? 'nav-item active' : 'nav-item' }>
          <Link className="nav-link" to="/charts/chart-js">
            <i className="mdi mdi-chart-line menu-icon"></i>
            <span className="menu-title">Charts</span>
          </Link>
        </li> */}
        {user && user.role === 'admin' ? (
          <li className={ isPathActive('/ads') ? 'nav-item active' : 'nav-item' }>
            <div className={ publicidadesPagesMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => setPublicidadesPagesMenuOpen(!publicidadesPagesMenuOpen) } data-toggle="collapse">
              <i className="mdi mdi-format-list-bulleted menu-icon"></i>
              <span className="menu-title">Publicidades</span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={ publicidadesPagesMenuOpen }>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={ isPathActive('/ads') ? 'nav-link active' : 'nav-link' } to="/ads">Lista</Link></li>
                <li className="nav-item"> <Link className={ isPathActive('/ads/add') ? 'nav-link active' : 'nav-link' } to="/ads/add">Agregar</Link></li>
              </ul>
            </Collapse>
          </li>
        ) : null}
        {/* {user && user.role === 'admin' ? (
          <li className={ isPathActive('/user-pages') ? 'nav-item active' : 'nav-item' }>
            <div className={ userPagesMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => setUserPagesMenuOpen(!userPagesMenuOpen) } data-toggle="collapse">
              <i className="mdi mdi-lock-outline menu-icon"></i>
              <span className="menu-title">Paginas de usuario</span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={ userPagesMenuOpen }>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={ isPathActive('/user-pages/blank-page') ? 'nav-link active' : 'nav-link' } to="/user-pages/blank-page">Blank Page</Link></li>
                <li className="nav-item"> <Link className={ isPathActive('/auth/login') ? 'nav-link active' : 'nav-link' } to="/auth/login">Login</Link></li>
                <li className="nav-item"> <Link className={ isPathActive('/auth/register-1') ? 'nav-link active' : 'nav-link' } to="/auth/register">Register</Link></li>
                <li className="nav-item"> <Link className={ isPathActive('/user-pages/error-404') ? 'nav-link active' : 'nav-link' } to="/user-pages/error-404">404</Link></li>
                <li className="nav-item"> <Link className={ isPathActive('/user-pages/error-500') ? 'nav-link active' : 'nav-link' } to="/user-pages/error-500">500</Link></li>
              </ul>
            </Collapse>
          </li>
        ) : null} */}
      </ul>
    </nav>
  );
}

export default withRouter(Sidebar);