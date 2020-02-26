import * as React from 'react';
import './app.css';

import { HashRouter, Route, Switch } from 'react-router-dom';

import { LoginComponent } from './login/login';
import { SignupComponent } from './signup/signup';
import { DashboardComponent } from './dashboard/dashboard';

function App(props) {

    return (
        <HashRouter basename='/'>
            <Switch>
                <Route exact path="/" component={LoginComponent} />
                <Route exact path="/signup" component={SignupComponent} />
                <Route exact path="/dashboard" component={DashboardComponent} />
            </Switch>
        </HashRouter>
    );
}

export default App;