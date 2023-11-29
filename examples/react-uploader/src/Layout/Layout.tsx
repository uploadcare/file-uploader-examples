import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import cs from 'classnames';

import st from './Layout.module.scss';

const getLinkClassName = ({ isActive }: { isActive: boolean }) => {
  return cs(st.link, { [st.active]: isActive });
};

export default function Layout() {
  return (
    <>
      <nav className={st.nav}>
        <ul className={st.list}>
          <li className={st.listItem}>
            <NavLink
              to="/form"
              className={getLinkClassName}
            >Real-life form</NavLink>
          </li>

          <li className={st.listItem}>
            <NavLink
              to="/minimal"
              className={getLinkClassName}
            >Minimal uploader</NavLink>
          </li>

          <li className={st.listItem}>
            <NavLink
              to="/regular"
              className={getLinkClassName}
            >Regular uploader</NavLink>
          </li>
        </ul>
      </nav>

      <Outlet/>
    </>
  );
}
