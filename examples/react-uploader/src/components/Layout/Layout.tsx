import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import cs from 'classnames';

import st from './Layout.module.scss';

const getMenuLinkClassName = ({ isActive }: { isActive: boolean }) => {
  return cs(st.link, st.menuLink, { [st.active]: isActive });
};

export default function Layout() {
  return (
    <>
      <nav className={st.root}>
        <a className={cs(st.link, st.logo)} href="https://uploadcare.com">
          <svg xmlns="http://www.w3.org/2000/svg" focusable="false" viewBox="0 0 18 18" width="30" height="30">
            <circle cx="9" cy="9" r="9" fill="url(#gradient)"></circle>
            <defs>
              <radialGradient id="gradient" cx="0" cy="0" r="1" gradientTransform="rotate(149.216 9.368 7.42) scale(17.5848 20.2492)" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFC700"></stop>
                <stop offset="1" stopColor="#FFEDAB"></stop>
              </radialGradient>
            </defs>
          </svg>
        </a>

        <ul className={st.menu}>
          <li className={st.menuItem}>
            <NavLink
              to="/form"
              className={getMenuLinkClassName}
            >Real-life form</NavLink>
          </li>

          <li className={st.menuItem}>
            <NavLink
              to="/minimal"
              className={getMenuLinkClassName}
            >Minimal uploader</NavLink>
          </li>

          <li className={st.menuItem}>
            <NavLink
              to="/regular"
              className={getMenuLinkClassName}
            >Regular uploader</NavLink>
          </li>
        </ul>

        <div className={st.source}>
          <span className={st.sourceTitle}>
            Built with Uploadcare Blocks and React
          </span>

          <a className={st.link} href="https://github.com/uploadcare/blocks-examples/tree/main/examples/react-uploader">
            <svg xmlns="http://www.w3.org/2000/svg" focusable="false" viewBox="0 0 24 24" width="30" height="30">
              <path fill="#24292f" style={{ fill: 'var(--ui-control-text-color)' }} stroke="none" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
            </svg>
          </a>
        </div>
      </nav>

      <Outlet/>
    </>
  );
}
