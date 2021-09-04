import React from 'react';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Update from './components/Update/Update';

function App(): JSX.Element {
    return (
        <RecoilRoot>
            <Router>
                <Switch>
                    <Route path="/index">
                        Not found
                    </Route>
                    <Route path="/register">
                        <Register />
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path="/update">
                        <Update />
                    </Route>
                    <Route path="/">
                        <Redirect to="/index" />
                    </Route>
                </Switch>
            </Router>
        </RecoilRoot>
    );
}

export default App;
