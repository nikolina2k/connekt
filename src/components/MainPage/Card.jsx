import React from "react";

const Card = ({ name, img, status }) => {
  return (
    <div>
      <div className="relative">
        <div className="rounded-2xl hover:scale-105 duration-700 ease-in-out cursor-pointer shadow-lg">
          <img className="h-80 w-56 rounded-2xl" src={img} alt={name}></img>
          <p className="absolute bottom-4 left-4 text-sm font-medium text-white font-roboto no-underline leading-none">
            {name}
          </p>
          <p
            className={`${
              status === "Offline"
                ? "absolute bottom-4 right-4 text-sm font-medium text-red-600 font-roboto no-underline leading-none"
                : "absolute bottom-4 right-4 text-sm font-medium text-green-600 font-roboto no-underline leading-none"
            }`}
          >
            {status}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Card;
