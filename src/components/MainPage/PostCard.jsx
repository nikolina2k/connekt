import React, { useContext, useEffect, useReducer, useState } from "react";
import { Avatar } from "@material-tailwind/react";
import avatar from "../../assets/images/avatar.png";
import { AuthContext } from "../AppContext/AppContext";
import {
  PostReducer,
  postActions,
  postStates,
} from "../AppContext/PostReducer";
import {
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import add from "../../assets/images/add-user.png";
import CommentSection from "./CommentSection";

const PostCard = ({ uid, id, logo, name, text, email, image, timestamp }) => {
  const { user } = useContext(AuthContext);
  const [state, dispatch] = useReducer(PostReducer, postStates);
  const likesRef = doc(collection(db, "posts", id, "likes"));
  const likesCollection = collection(db, "posts", id, "likes");
  const singlePostDocument = doc(db, "posts", id);
  const { ADD_LIKE, HANDLE_ERROR } = postActions;
  const [open, setOpen] = useState(false);
  const [melikey, setLikey] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isFriend, setIsFriend] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      const d = doc(db, "users", user?.uid);
      return onSnapshot(d, (snap) => {
        if (snap.get("friends"))
          setIsFriend(snap.get("friends").some((f) => f === uid));
      });
    }
  }, [user?.uid]);

  const handleOpen = (e) => {
    e.preventDefault();
    setOpen(!open);
  };

  const addFriend = async () => {
    try {
      const d = doc(db, "users", user.uid);
      await updateDoc(d, {
        friends: arrayUnion(uid),
      });
    } catch (err) {
      alert(err.message);
      console.log(err.message);
    }
  };

  useEffect(() => {
    const q = query(likesCollection, where("id", "==", user?.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      setLikey(!snapshot.empty);
    });
    return unsub;
  }, []);

  const handleLikes = async (e) => {
    e.preventDefault();
    const q = query(likesCollection, where("id", "==", user?.uid));
    const querySnapshot = await getDocs(q);
    const likesDocId = await querySnapshot?.docs[0]?.id;
    try {
      if (likesDocId !== undefined) {
        const deleteId = doc(db, "posts", id, "likes", likesDocId);
        await deleteDoc(deleteId);
      } else {
        await setDoc(likesRef, {
          id: user?.uid,
        });
      }
    } catch (err) {
      alert(err.message);
      console.log(err.message);
    }
  };

  const deletePost = async (e) => {
    e.preventDefault();
    try {
      if (user?.uid === uid) {
        await deleteDoc(singlePostDocument);
      } else {
        alert("You can't delete other user's post!");
      }
    } catch (err) {
      alert(err.message);
      console.log(err.message);
    }
  };

  useEffect(() => {
    const q = collection(db, "posts", id, "likes");
    return onSnapshot(q, (doc) => {
      dispatch({
        type: ADD_LIKE,
        likes: doc.docs.map((item) => item.data()),
      });
    });
  }, [id, ADD_LIKE, HANDLE_ERROR]);

  useEffect(() => {
    if (user?.uid) {
      const d = doc(db, "users", uid);
      return onSnapshot(d, (snap) => {
        setProfilePhoto(snap.get("image"));
      });
    }
  }, [user?.uid]);

  return (
    <div className="mb-4">
      <div className="flex flex-col py-4 bg-white rounded-t-3xl">
        <div className="flex items-center pb-4 ml-2">
          <Avatar
            size="sm"
            variant="circular"
            src={profilePhoto || logo || avatar}
            alt="avatar"
          ></Avatar>
          <div className="flex flex-col">
            <p className="ml-4 py-2 font-roboto font-medium text-sm text-grey-700 no-underline tracking-normal leading-none">
              {name}
            </p>
            <p className="ml-4 font-roboto font-medium text-sm text-grey-700 no-underline tracking-normal leading-none">
              Published: {timestamp}
            </p>
          </div>
          {user?.uid !== uid && !isFriend && (
            <div
              onClick={addFriend}
              className="w-full flex justify-end cursor-pointer mr-10"
            >
              <img
                className="hover:bg-blue-100 rounded-xl p-2 h-10"
                src={add}
                alt="add friend"
              ></img>
            </div>
          )}
        </div>
        <div>
          <p className="ml-4 pb-4 font-roboto font-medium text-sm text-grey-700 no-underline tracking-normal leading-none">
            {text}
          </p>
          {image && (
            <img className="h-[500px] w-full" src={image} alt="postImage"></img>
          )}
        </div>
        <div className="flex justify-around items-center pt-4">
          <button
            className="flex items-center cursor-pointer rounded-lg p-2 hover:bg-gray-100"
            onClick={handleLikes}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={melikey ? "red" : "none"}
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke={melikey ? "red" : "currentColor"}
              className="w-7 h-8 mr-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
            {state.likes?.length > 0 && state?.likes?.length}
          </button>
          <div
            className="flex items-center cursor-pointer rounded-lg p-2 hover:bg-gray-100"
            onClick={handleOpen}
          >
            <div className="flex items-center cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-7 h-8 mr-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                />
              </svg>
              <p className="font-roboto font-medium text-md text-gray-700 no-underline tracking-normal leading-none">
                Comments
              </p>
            </div>
          </div>
          <div
            className="flex items-center cursor-pointer rounded-lg p-2 hover:bg-gray-100"
            style={{ display: user?.uid !== uid ? "none" : "flex" }}
            onClick={deletePost}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-8 mr-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
            <p className="font-roboto font-medium text-md text-gray-700 no-underline tracking-normal leading-none">
              Delete
            </p>
          </div>
        </div>
      </div>
      {open && <CommentSection postId={id}></CommentSection>}
    </div>
  );
};

export default PostCard;
