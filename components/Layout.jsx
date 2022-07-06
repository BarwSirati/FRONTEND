import { Fragment } from "react";
import Navbar from "./Navbar";
const Layout = ({ children }) => {
  return (
    <Fragment>
      <Navbar />
      <main className="flex-1 p-5 overflow-x-hidden layout">{children}</main>
    </Fragment>
  );
};

export default Layout;
