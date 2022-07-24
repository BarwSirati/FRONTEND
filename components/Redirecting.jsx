import React, {Fragment} from "react";

const RedirectOverlay = (props) => {
  const handleTransition = event => {
    event.currentTarget.classList.add('fade-in');
  };
  return (
    <Fragment>
      <div className="redirecting-overlay" onTransitionEnd={handleTransition}>
        <div className="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="text">Loading</div>
      </div>
    </Fragment>
  );
};

export default RedirectOverlay;
