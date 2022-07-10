import React, {Fragment} from "react";
import Starfall from "../components/Login/Starfall";
import CustomLink from "../components/CustomLink";

const Custom404 = () => {
  return (
    <Fragment>
      <Starfall/>
      <div className="starLogin absolute z-10"></div>
      <div id="notfound" className="z-20">
        <div className="notfound">
          <div className="notfound-404">
            <h1>404</h1>
            <h2>Page not found</h2>
          </div>
          <CustomLink href={"/"}>
            <button className="btn my-5 btn-outline btn-error">
              Home Page
            </button>
          </CustomLink>
        </div>
      </div>
    </Fragment>
  );
};
export default Custom404;
