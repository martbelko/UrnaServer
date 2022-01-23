import React from 'react';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

function App(): JSX.Element {
    return (
        <RecoilRoot>
            <Router>
                <Switch>
                    <Route path="/index">
                        Not found
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
