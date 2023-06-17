import React, { useContext, useEffect, useReducer, useRef } from "react";
import { Avatar } from "@material-tailwind/react";
import avatar from "../../assets/images/avatar.png";
import { AuthContext } from "../AppContext/AppContext";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import {
  PostReducer,
  postActions,
  postStates,
} from "../AppContext/PostReducer";
import Comment from "./Comment";

const CommentSection = ({ postId }) => {
  const { user, userData } = useContext(AuthContext);
  const comment = useRef("");
  const commentRef = doc(collection(db, "posts", postId, "comments"));
  const [state, dispatch] = useReducer(PostReducer, postStates);
  const { ADD_COMMENT, HANDLE_ERROR } = postActions;
  // const [friends, setFriends] = useState([]);

  // useEffect(() => {
  //   const promises = friendIdList?.map((f) => getDoc(doc(db, "users", f)));
  //   if (!promises) return;
  //   Promise.all(promises).then((snaps) => {
  //     setFriends(snaps.map((snap) => snap.data()));
  //   });
  // }, [friendIdList]);

  const addComment = async (e) => {
    e.preventDefault();
    if (comment.current.value !== "") {
      try {
        await setDoc(commentRef, {
          uid: user.uid,
          id: commentRef.id,
          comment: comment.current.value,
          timestamp: serverTimestamp(),
        });
        comment.current.value = "";
      } catch (err) {
        dispatch({ type: HANDLE_ERROR });
        alert(err.message);
        console.log(err.message);
      }
    }
  };

  useEffect(() => {
    const collectionOfComments = collection(db, `posts/${postId}/comments`);
    const q = query(collectionOfComments, orderBy("timestamp", "desc"));
    return onSnapshot(q, async (snap) => {
      const comments = snap.docs?.map((item) => item.data());
      const filledComments = await Promise.all(
        comments.map(async (c) => {
          const snapshot = await getDoc(doc(db, "users", c.uid));
          const user = snapshot.data();
          return {
            ...c,
            name: user.name,
            image: user.image,
          };
        })
      );
      dispatch({
        type: ADD_COMMENT,
        comments: filledComments,
      });
    });
  }, [postId, ADD_COMMENT, HANDLE_ERROR]);

  return (
    <div className="flex flex-col bg-white w-full py-2 rounded-b-3xl">
      <div className="flex items-center">
        <div className="mx-2">
          <Avatar
            size="sm"
            variant="circular"
            src={user?.photoURL || avatar}
          ></Avatar>
        </div>
        <div className="w-full pr-2">
          <form className="flex items-center w-full" onSubmit={addComment}>
            <input
              name="comment"
              type="text"
              className="w-full rounded-2xl outline-none border-0 p-2 bg-gray-100"
              ref={comment}
              placeholder="Leave a comment..."
            ></input>
            <button className="hidden" type="submit">
              Comment
            </button>
          </form>
        </div>
      </div>
      {state?.comments?.map((comment, index) => {
        return (
          <Comment
            key={index}
            image={comment?.image}
            name={comment?.name}
            comment={comment?.comment}
          ></Comment>
        );
      })}
    </div>
  );
};

export default CommentSection;
