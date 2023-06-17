import React from "react";
import Navbar from "../Navbar/Navbar";
import LeftSidebar from "../LeftSidebar/LeftSidebar";
import RightSidebar from "../RightSidebar/RightSidebar";
import CardArea from "../MainPage/CardArea";
import Main from "../MainPage/Main";

const Home = () => {
  return (
    <div className="w-full">
      <div className="fixed top-0 z-10 w-full bg-white">
        <Navbar />
      </div>
      <div className="flex bg-gray-100">
        <div className="flex-auto w-[20%] fixed top-12">
          <LeftSidebar />
        </div>
        <div className="flex-auto w-[60%] absolute left-[20%] top-12 bg-gray-100">
          <div className="w-[90%] mx-auto">
            <CardArea />
            <Main />
          </div>
        </div>
        <div className="flex-auto w-[20%] fixed right-0 top-12">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default Home;
