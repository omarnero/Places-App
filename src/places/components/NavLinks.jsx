import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import "./NavLinks.css";
const NavLinks = () => {
  const Auth = useContext(AuthContext);
  const { isLogdedIn, Logout } = useContext(AuthContext);
  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>
          ALL USERS
        </NavLink>
      </li>
      {isLogdedIn && (
        <li>
          <NavLink to={`/${Auth.userId}/places`}>MYPLACES</NavLink>
        </li>
      )}
      {isLogdedIn && (
        <li>
          <NavLink to="/places/new">ADDPLACE</NavLink>
        </li>
      )}
      {!isLogdedIn && (
        <li>
          <NavLink to="/auth">AUTH</NavLink>
        </li>
      )}
      {isLogdedIn && (
        <li>
          <button onClick={Logout}>LOGOUT</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
