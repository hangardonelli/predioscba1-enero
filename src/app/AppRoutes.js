import React, { Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Spinner from '../app/shared/Spinner';
import PredioEdit from './predios/PredioEdit';

const Dashboard = lazy(() => import('./dashboard/Dashboard'));

const Home = lazy(() => import('./home/Home'));

const Turnos = lazy(() => import('./turnos/Index'));

const Buttons = lazy(() => import('./basic-ui/Buttons'));
const Dropdowns = lazy(() => import('./basic-ui/Dropdowns'));
const Typography = lazy(() => import('./basic-ui/Typography'));

const BasicElements = lazy(() => import('./form-elements/BasicElements'));

const BasicTable = lazy(() => import('./tables/BasicTable'));

const Orders = lazy(() => import('./orders/Orders'));

// Predios.
const PredioAdd = lazy(() => import('./predios/PredioAdd'));
const Pedidosdehoy = lazy(() => import('./pedidosdehoy/pedidosdehoy'));

// Adds
const Ads = lazy(() => import('./ads/Ads'));
const AdAdd = lazy(() => import('./ads/AdAdd'));

// Turnos
const TurnoAdd = lazy(() => import('./turnos/TurnoAdd'));

const Error404 = lazy(() => import('./user-pages/Error404'));
const Error500 = lazy(() => import('./user-pages/Error500'));

const Login = lazy(() => import('./user-pages/Login'));
const Register1 = lazy(() => import('./user-pages/Register'));

const BlankPage = lazy(() => import('./user-pages/BlankPage'));
const Account = lazy(() => import('./user-pages/Account'));
const PolicyPage = lazy(() => import('./user-pages/Policy'));
const Terms = lazy(() => import('./user-pages/TermsAndConditions'));


const AppRoutes = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <Switch>
        <Route exact path="/dashboard" component={Dashboard} />

        <Route exact path="/home" component={Home} />

        <Route exact path="/turnos" component={Turnos} />

        <Route path="/basic-ui/buttons" component={Buttons} />
        <Route path="/basic-ui/dropdowns" component={Dropdowns} />
        <Route path="/basic-ui/typography" component={Typography} />

        <Route path="/form-Elements/basic-elements" component={BasicElements} />

        <Route path="/tables/basic-table" component={BasicTable} />

        <Route path="/orders" component={Orders} />

        <Route path="/predio/add" component={PredioAdd} exact />
        <Route path="/predio/:id/edit" component={PredioEdit} exact />
        <Route path="/predio/edit" component={PredioEdit} />

        <Route path="/pedidosdehoy" component={Pedidosdehoy} />

        <Route path="/turno/add" component={TurnoAdd} />
        <Route path="/ads" component={Ads} exact />
        <Route path="/ads/add" component={AdAdd} exact />


        {/* <Route path="/icons/font-awesome" component={ FontAwesome } /> */}
        {/* <Route path="/charts/chart-js" component={ ChartJs } /> */}

        <Route path="/auth/login" component={Login} exact />
        <Route path="/auth/register" component={Register1} />

        <Route path="/user-pages/error-404" component={Error404} />
        <Route path="/user-pages/error-500" component={Error500} />

        <Route path="/user-pages/blank-page" component={BlankPage} />
        <Route path="/account" component={Account} />
        <Route path="/policy" component={PolicyPage} exact />
        <Route path="/terms-and-conditions" component={Terms} exact />


        <Redirect to="/auth/login" />
      </Switch>
    </Suspense>
  );
}

export default AppRoutes;