import React from "react";
import "./style.css";

function Header({ title, icon }) {
  return (
    <header>
      <h1>
        {title}
        <span>
          {" "}
          <i className={icon} />
        </span>
      </h1>
    </header>
  );
}

export default Header;
