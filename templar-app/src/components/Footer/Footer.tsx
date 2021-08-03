import React from 'react';
import './Footer.css';

import Discord from '/assets/svgs/discord.svg';

function Footer() {
  return (
    <footer className="footer">
        <div className="footer__content">
            <span className="footer__content__item footer__content__text footer__content__text--left">JOIN</span>
            <a className="footer__content__item footer__content__link" href="#">
                <img  className="footer__content__link__discord" src={Discord} alt="Discord" />
            </a>
            <span className="footer__content__item footer__content__text  footer__content__text--right">US!</span>
        </div>
    </footer>
  );
};

export default Footer;
