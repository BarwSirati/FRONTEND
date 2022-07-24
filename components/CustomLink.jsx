import React from "react";
import Link from "next/link";

const CustomLink = ({href, children}) => {
  const redirect = () => {
    if (href === "") return;
    const taskCards = document.querySelectorAll(".redirecting-overlay");
    taskCards.forEach((element) => {
      element.classList.add('active');
    });
  };
  return (
    <Link href={href}>

      <a onClick={redirect}>{children}</a>
    </Link>
  );
};

export default CustomLink;
