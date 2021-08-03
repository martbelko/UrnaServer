import React from 'react';
import './Header.css';

import Helmet from '/assets/svgs/helmet.svg';

function Header() {
  return (
    <header className="header">
        <div className="header__logo">
            <img className="logo__img" src={Helmet} alt="Helmet" />
            <span className="logo__text">TEMPLAY</span>
        </div>
        <nav className="header__nav">
            <ul className="nav__main-nav">
                <li className="main-nav__item">
                    <a className="main-nav__item__link" href="#">Úvod</a>
                </li>
                <li className="main-nav__item">
                    <a className="main-nav__item__link" href="#">Servery</a>
                </li>
                <li className="main-nav__item">
                    <a className="main-nav__item__link" href="#">Rád / Tím</a>
                </li>
                <li className="main-nav__item">
                    <a className="main-nav__item__link" href="#">Nákup produktov</a>
                </li>
                <li className="main-nav__item">
                    <a className="main-nav__item__link" href="#">Fórum</a>
                </li>
                <li className="main-nav__item">
                    <a className="main-nav__item__link" href="#">Banlist</a>
                </li>
            </ul>
        </nav>
        <div className="header__log">
            <a className="header__log__item header__log__item--login" href="#">Login</a>
            <span>/</span>
            <a className="header__log__item header__log__item--register" href="#">Register</a>
        </div>
    </header>
  );
};

export default Header;
