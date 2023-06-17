import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AppContext/AppContext";
import { Link } from "react-router-dom";
import { Avatar } from "@material-tailwind/react";
import avatar from "../../assets/images/avatar.png";
import { arrayRemove, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Input } from "@material-tailwind/react";

const RightSidebar = () => {
  const [input, setInput] = useState("");
  const { user, userData } = useContext(AuthContext);
  const friendIdList = userData?.friends;
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const promises = friendIdList?.map((f) => getDoc(doc(db, "users", f)));
    if (!promises) return;
    Promise.all(promises).then((snaps) => {
      setFriends(snaps.map((snap) => snap.data()));
    });
  }, [friendIdList]);

  const searchFriends = (data) => {
    return data.filter((item) =>
      item["name"].toLowerCase().includes(input.toLowerCase())
    );
  };

  const removeFriend = async (id) => {
    const d = doc(db, "users", user.uid);
    const snap = await getDoc(d);
    const userDocumentId = snap.id;

    await updateDoc(doc(db, "users", userDocumentId), {
      friends: arrayRemove(id),
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 shadow-lg border-2 rounded-l-xl">
      <div className="mx-2 mt-10">
        <p className="font-roboto font-medium text-sm text-gray-800 no-underline tracking-normal leading-none ml-4">
          Friends:{""}
        </p>
        <div className="mb-4">
          <Input
            variant="static"
            placeholder="Search friends"
            className="border-0 placeholder-gray-700 outline-none mx-4 w-[30%]"
            name="input"
            value={input}
            type="text"
            onChange={(e) => setInput(e.target.value)}
          ></Input>
        </div>
        {friends.length > 0 ? (
          searchFriends(friends)?.map((friend) => {
            return (
              <div
                className="flex items-center justify-between hover:bg-gray-200 duration-300 ease-in-out ml-2"
                key={friend.uid}
              >
                <Link to={`/profile/${friend.uid}`}>
                  <div className="flex items-center my-2 cursor-pointer">
                    <div className="flex items-center">
                      <Avatar
                        size="sm"
                        variant="circular"
                        className="ml-2"
                        src={friend?.image || avatar}
                        alt="avatar"
                      ></Avatar>
                      <p className="ml-4 font-roboto font-medium text-sm text-gray-900 no-underline tracking-normal leading-none">
                        {friend.name}
                      </p>
                    </div>
                  </div>
                </Link>
                <div className="mr-4">
                  <svg
                    onClick={() => removeFriend(friend.uid)}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 cursor-pointer"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </div>
              </div>
            );
          })
        ) : (
          <p className="mt-10 font-roboto font-medium text-sm text-gray-700 no-underline tracking-normal leading-none ml-4">
            Add friends to view their profile!
          </p>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
