import React from "react";

const Button = ({ onClick, className, children }) => {
  return (
    <button onClick={onClick} className={`bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 border border-gray-400 rounded shadow ${className}`}>
      {children}
    </button>
  );
};

export default Button;
