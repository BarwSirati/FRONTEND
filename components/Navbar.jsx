import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import { deleteCookie } from "cookies-next";
const path = [
  { key: 1, name: "HOME", to: "/", class: "nav-menu" },
  { key: 2, name: "TASKS", to: "/tasks", class: "nav-menu" },
  { key: 3, name: "RANKING", to: "/ranking", class: "nav-menu" },
  { key: 4, name: "PROFILE", to: "/profile", class: "nav-menu" },
  { key: 5, name: "GUIDE", to: "/guide", class: "nav-menu" },
];
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const logout = () => {
    deleteCookie("token");
    router.push("/login");
  };
  return (
    <header className="navbar-wrapper">
      <div className="navbar">
        <h1 className="navbar-header">
          <span className="ceboostup">CEBOOSTUP</span>
          <span className="x">X</span>
        </h1>
        <div className="navbar-menu">
          <ul className="navbar-menu-wrapper">
            {path.map((link) => {
              return (
                <Link key={link.key} href={link.to}>
                  <li
                    className={`navbar-menu-item ${
                      router.asPath === link.to ||
                      (link.key === 2 && router.pathname === "/tasks/[...id]")
                        ? "active"
                        : ""
                    }`}
                  >
                    <a>{link.name}</a>
                  </li>
                </Link>
              );
            })}
            <li
              className={`navbar-menu-item`}
            >
              <a onClick={logout}>LOGOUT</a>
            </li>
          </ul>
        </div>
        <div className="navbar-menu-mobile-button">
          <label>
            <input
              type="checkbox"
              onClick={() => {
                setIsOpen(!isOpen);
              }}
            />
            <FontAwesomeIcon
              icon={faBars}
              className="swap-off icon"
            />
            <FontAwesomeIcon
              icon={faXmark}
              className="swap-on icon"
            />
          </label>
        </div>
      </div>
      <div
        className={`navbar-menu-mobile ${isOpen ? "active" : ""}`}
      >
        <ul>
          {path.map((link) => {
            return (
              <Link key={link.key} href={link.to}>
                <li
                  key={link.key}
                  className={`navbar-menu-mobile-item ${
                    router.asPath === link.to ? "active" : ""
                  }`}
                >
                  <span>{link.name}</span>
                </li>
              </Link>
            );
          })}
          <li
            className={`navbar-menu-mobile-item`}
          >
            <span onClick={logout}>LOGOUT</span>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
