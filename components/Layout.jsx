import { Fragment } from "react";
import Navbar from "./Navbar";
const Layout = ({ children }) => {
  return (
    <Fragment>
      <Navbar />
      <main className="layout">{children}</main>
    </Fragment>
  );
};

export default Layout;
