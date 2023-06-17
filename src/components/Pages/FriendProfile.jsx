import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import RightSidebar from "../RightSidebar/RightSidebar";
import { Avatar } from "@material-tailwind/react";
import avatar from "../../assets/images/avatar.png";
import { useParams } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";

const FriendProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const getUserProfile = () => {
      const d = doc(db, "users", id);
      onSnapshot(d, (doc) => {
        setProfile(doc.data());
      });
    };
    getUserProfile();
  }, [id]);

  return (
    <div className="w-full">
      <div className="fixed top-0 z-10 w-full bg-white">
        <Navbar />
      </div>
      <div className="flex bg-gray-100">
        <div className="flex-auto w-[82%] h-[100%] absolute top-12 bg-gray-50">
          <div className="w-[90%] mx-auto">
            <div>
              <div className="relative py-4">
                <img
                  className="h-96 w-full rounded-md"
                  src={profile?.coverUrl}
                  alt="profilePicture"
                ></img>

                <div className="absolute left-6">
                  <Avatar
                    size="xl"
                    variant="circular"
                    src={profile?.image || avatar}
                    alt="avatar"
                    className="bottom-10"
                  ></Avatar>
                  <p className="font-roboto font-medium text-sm text-black no-underline tracking-normal leading-none">
                    {profile?.name}
                  </p>
                  <p className="py-3 font-roboto font-medium text-sm text-black no-underline tracking-normal leading-none">
                    {profile?.email}
                  </p>
                </div>

                <div className="flex flex-col absolute right-6 mt-14">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#000000"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                      />
                    </svg>

                    <span className="ml-2 py-2 font-roboto font-medium text-sm text-black no-underline tracking-normal leading-none">
                      {profile?.location}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#000000"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
                      />
                    </svg>

                    <span className="ml-2 py-2 font-roboto font-medium text-sm text-black no-underline tracking-normal leading-none">
                      {profile?.jobTitle}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-auto w-[20%] fixed right-0 top-12">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default FriendProfile;
