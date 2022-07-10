import {Fragment} from "react";
import Navbar from "./Navbar";
import Redirecting from "./Redirecting";

const Layout = ({children}) => {
  return (
    <Fragment>
      <Navbar/>
      <div className="background-stars"></div>
      <main className="layout">
        <Redirecting/>
        {children}
      </main>
    </Fragment>
  );
};

export default Layout;
