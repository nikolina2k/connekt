import React, { createContext, useState, useEffect } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import coverPhoto from "../../assets/images/bg.png";

export const AuthContext = createContext();

const AppContext = ({ children }) => {
  const provider = new GoogleAuthProvider();
  const [user, setUser] = useState();
  const [userData, setUserData] = useState();

  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      const popup = await signInWithPopup(auth, provider);
      const user = popup.user;
      const d = doc(db, "users", user.uid);
      const snap = await getDoc(d);
      if (snap.data() === undefined) {
        await setDoc(d, {
          uid: user?.uid,
          name: user?.displayName,
          email: user?.email,
          image: user?.photoURL,
          coverUrl: coverPhoto,
          authProvider: popup?.providerId,
          jobTitle: user?.jobTitle ?? "Purrfessional Sleep Consultant",
          location: user?.location ?? "Location",
        });
        console.log("added doc for user");
      } else {
        console.log("User exists", snap.data());
      }
    } catch (err) {
      alert(err.message);
      console.log(err.message);
    }
  };

  const loginWithEmailAndPassword = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert(err.message);
      console.log(err.message);
    }
  };

  const registerWithEmailAndPassword = async (name, email, password) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = response.user;
      const d = doc(db, "users", user.uid);
      await setDoc(d, {
        uid: user.uid,
        name,
        email: user.email,
        image: user.photoURL,
        coverUrl: coverPhoto,
        providerId: "email/password",
        jobTitle: "Purrfessional Sleep Consultant",
        location: "Location",
      });
      await updateProfile(user, {
        displayName: name,
      });
    } catch (err) {
      alert(err.message);
      console.log(err.message);
    }
  };

  const sendPasswordToUser = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("New password has been sent to your email.");
    } catch (err) {
      alert(err.message);
      console.log(err.message);
    }
  };

  const signUserOut = async () => {
    await signOut(auth);
  };

  const userStateChanged = () => {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        const d = doc(db, "users", user.uid);
        onSnapshot(d, (doc) => {
          setUserData(doc.data());
        });
        setUser(user);
      } else {
        setUser(null);
        navigate("/login");
      }
    });
  };

  useEffect(() => {
    const unsub = userStateChanged();
    if (user || userData) {
      navigate("/");
    } else {
      navigate("/login");
    }
    return unsub;
  }, []);

  const initialState = {
    signInWithGoogle: signInWithGoogle,
    loginWithEmailAndPassword: loginWithEmailAndPassword,
    registerWithEmailAndPassword: registerWithEmailAndPassword,
    sendPasswordToUser: sendPasswordToUser,
    signUserOut: signUserOut,
    user: user,
    userData: userData,
  };

  return (
    <div>
      <AuthContext.Provider value={initialState}>
        {children}
      </AuthContext.Provider>
    </div>
  );
};

export default AppContext;
