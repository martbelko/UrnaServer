import React from 'react';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import ThemeSwitch from './components/ThemeSwitch/ThemeSwitch';
import MainInfo from './components/MainInfo/MainInfo';

function App() {
  return (
	<>
	  <Header />
	  <ThemeSwitch />
	  <Router>
		<Switch>
		<Route path="/index">
			<Redirect to="/" />
			</Route>
			<Route path="/">
				<MainInfo />
			</Route>
		</Switch>
        </Router>
	  <Footer />
	</>
  );
};

export default App
