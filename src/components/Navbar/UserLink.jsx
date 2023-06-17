import React, { useContext, useEffect, useState } from "react";
import { Tooltip, Avatar } from "@material-tailwind/react";
import avatar from "../../assets/images/avatar.png";
import { AuthContext } from "../AppContext/AppContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";

const UserLink = () => {
  const { signUserOut, user, userData } = useContext(AuthContext);
  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    if (user?.uid) {
      const d = doc(db, "users", user?.uid);
      return onSnapshot(d, (snap) => {
        setProfilePhoto(snap.get("image"));
      });
    }
  }, [user?.uid]);

  return (
    <div className="flex justify-center items-center cursor-pointer">
      <div
        className="hover:translate-y-1 duration-500 ease-in-out hover:text-blue-500"
        onClick={signUserOut}
      >
        <Tooltip content="Sign Out" placement="bottom">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
            />
          </svg>
        </Tooltip>
      </div>
      <div className="mx-4 flex items-center">
        <Avatar src={profilePhoto || avatar} size="sm" alt="avatar"></Avatar>

        <p className="ml-4 font-roboto text-sm text-black font-medium no-underline">
          {user?.email || userData?.email}
        </p>
      </div>
    </div>
  );
};

export default UserLink;
