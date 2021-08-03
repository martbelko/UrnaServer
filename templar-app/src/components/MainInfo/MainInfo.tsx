import React from 'react';
import './MainInfo.css';

function MainInfo() {
  return (
    <main className="main-info">
        <div className="main-info__item main-info__item--one">
            <img className="main-info__item__img" src="./assets/svgs/csgo.svg" alt="CS:GO" />
            <p className="main-info__item__desc">Pozrite sa na zoznam našich serverov & Pripojte sa!*(niečo v tom zmysle)*</p>
            <a className="main-info__item__link" href="#">Viac info</a>
        </div>
        <div className="main-info__item main-info__item--two">
            <img className="main-info__item__img" src="./assets/svgs/templar.svg" alt="Templar" />
            <p className="main-info__item__desc">Pozrite sa na náš tím!</p>
            <a className="main-info__item__link" href="#">Viac info</a>
        </div>
        <div className="main-info__item main-info__item--three">
            <img className="main-info__item__img" src="./assets/svgs/shopping-cart.svg" alt="Shopping cart" />
            <p className="main-info__item__desc">Nakúpte si VIP výhody alebo rovno svoju vlastnú postavičku (niečo také)</p>
            <a className="main-info__item__link" href="#">Viac info</a>
        </div>
        <div className="main-info__item main-info__item--four">
            <img className="main-info__item__img" src="./assets/svgs/forum.svg" alt="Forum" />
            <p className="main-info__item__desc">Fórum</p>
            <a className="main-info__item__link" href="#">Viac info</a>
        </div>
        <div className="main-info__item main-info__item--five">
            <img className="main-info__item__img" src="./assets/svgs/ban.svg" alt="Ban" />
            <p className="main-info__item__desc">Banlist</p>
            <a className="main-info__item__link" href="#">Viac info</a>
        </div>
    </main>
  );
};

export default MainInfo;
