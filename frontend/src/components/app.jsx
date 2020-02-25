import * as React from 'react';
import './app.css';

import { HashRouter, Route, Switch } from 'react-router-dom';

import { LoginComponent } from './login/login';
import { SignupComponent } from './signup/signup';

function App(props) {

    return (
        <HashRouter basename='/'>
            <Switch>
                <Route exact path="/" component={LoginComponent} />
                <Route exact path="/signup" component={SignupComponent} />
            </Switch>
        </HashRouter>
    );
}

export default App;