import React from 'react';
import './ThemeSwitch.css';

import Sun from '/assets/svgs/sun.svg';
import Moon from '/assets/svgs/moon.svg';

function ThemeSwitch() {
  return (
    <aside className="theme-switch">
        <input type="checkbox" id="checkbox" className="theme-switch__checkbox" />
        <label htmlFor="checkbox" className="theme-switch__label">
            <img className="theme-switch__label__icon theme-switch__label__icon--moon" src={Moon} alt="Moon" />
            <img className="theme-switch__label__icon theme-switch__label__icon--sun" src={Sun} alt="Moon" />
            <div className="theme-switch__label__ball"></div>
        </label>
    </aside>
  );
};

export default ThemeSwitch;
