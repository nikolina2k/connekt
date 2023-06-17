import React, { useContext, useState, useEffect, useRef } from "react";
import { Tooltip, Avatar } from "@material-tailwind/react";
import avatar from "../../assets/images/avatar.png";
import ad from "../../assets/images/ad.png";
import { AuthContext } from "../AppContext/AppContext";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../firebase/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

const LeftSidebar = () => {
  const { user, userData } = useContext(AuthContext);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const [jobTitle, setJobTitle] = useState(user?.jobTitle);

  const [location, setLocation] = useState(user?.location);

  const storage = getStorage();
  const jobTitleInputRef = useRef(null);
  const locationInputRef = useRef(null);

  const handleCoverPhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const storageRef = ref(storage, `coverPhotos/${file.name}`);

      const snapshot = await uploadBytes(storageRef, file);
      console.log("Cover photo uploaded successfully");

      const url = await getDownloadURL(snapshot.ref);
      setCoverPhoto(url);

      await updateDoc(doc(db, "users", user.uid), {
        coverUrl: url,
      });
    }
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const storageRef = ref(storage, `profilePhotos/${file.name}`);

      uploadBytes(storageRef, file)
        .then((snapshot) => {
          console.log("Profile photo uploaded successfully");

          getDownloadURL(snapshot.ref)
            .then((url) => {
              setProfilePhoto(url);
              updateProfile(user, {
                photoURL: url,
              });
              updateDoc(doc(db, "users", user.uid), {
                image: url,
              });
            })
            .catch((error) => {
              console.log("Error getting download URL:", error);
            });
        })
        .catch((error) => {
          console.log("Error uploading profile photo:", error);
        });
    }
  };

  useEffect(() => {
    if (user?.uid) {
      const d = doc(db, "users", user?.uid);
      return onSnapshot(d, (snap) => {
        setCoverPhoto(snap.get("coverUrl"));
        setProfilePhoto(snap.get("image"));
        if (snap.get("jobTitle")) setJobTitle(snap.get("jobTitle"));
        if (snap.get("location")) setLocation(snap.get("location"));
      });
    }
  }, [user?.uid, user?.jobTitle, user?.location]);

  const handleJobTitleEdit = () => {
    jobTitleInputRef.current.contentEditable = true;
    jobTitleInputRef.current.focus();
  };

  const handleLocationEdit = () => {
    locationInputRef.current.contentEditable = true;
    locationInputRef.current.focus();
  };

  const handleJobTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      jobTitleInputRef.current.contentEditable = false;
      const newJobTitle = jobTitleInputRef.current.textContent.trim();
      setJobTitle(newJobTitle);
      if (user?.uid) {
        updateDoc(doc(db, "users", user.uid), {
          jobTitle: newJobTitle,
        })
          .then(() => {
            console.log("Job title updated successfully");
          })
          .catch((error) => {
            console.log("Error updating job title:", error);
          });
      }
    }
  };

  const handleLocationKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      locationInputRef.current.contentEditable = false;
      const newLocation = locationInputRef.current.textContent.trim();
      setLocation(newLocation);
      if (user?.uid) {
        updateDoc(doc(db, "users", user.uid), {
          location: newLocation,
        })
          .then(() => {
            console.log("Location updated successfully");
          })
          .catch((error) => {
            console.log("Error updating location:", error);
          });
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 pb-4 border-2 rounded-r-xl shadow-lg">
      <div className="flex flex-col items-center relative">
        <img
          className="h-36 w-full rounded-xl cursor-pointer"
          src={coverPhoto}
          alt="cover"
          onClick={() => document.getElementById("coverPhotoInput").click()}
        ></img>
        <input
          id="coverPhotoInput"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleCoverPhotoChange}
        />
        <div className="absolute -bottom-4">
          <Tooltip content="Profile" placement="top">
            <Avatar
              size="lg"
              src={profilePhoto || user?.photoURL || avatar}
              alt="avatar"
              onClick={() =>
                document.getElementById("profilePhotoInput").click()
              }
            ></Avatar>
          </Tooltip>
          <input
            id="profilePhotoInput"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleProfilePhotoChange}
          />
        </div>
      </div>
      <div className="flex flex-col items-center pt-6">
        <p className="font-roboto font-medium text-xl text-grey-700 no-underline tracking-normal leading-none py-2">
          {user?.displayName === null && userData?.name !== undefined
            ? userData?.name
            : user?.displayName}
        </p>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-8 h-7 m-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
            />
          </svg>
          <p
            className="font-roboto font-medium text-grey-700 no-underline tracking-normal leading-none py-2"
            ref={jobTitleInputRef}
            onClick={handleJobTitleEdit}
            onKeyDown={handleJobTitleKeyDown}
            onBlur={() => {
              jobTitleInputRef.current.contentEditable = false;
            }}
            role="textbox"
            tabIndex={0}
          >
            {jobTitle || 'Jobless :('}
          </p>
        </div>
        <div className="flex items-center pb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-8 h-7 ml-4 mr-4"
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
          <p
            className="font-roboto font-medium text-grey-700 no-underline tracking-normal leading-none py-2"
            ref={locationInputRef}
            onClick={handleLocationEdit}
            onKeyDown={handleLocationKeyDown}
            onBlur={() => {
              locationInputRef.current.contentEditable = false;
            }}
            role="textbox"
            tabIndex={0}
          >
            {location || 'Planet Earth'}
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center pt4 mt-auto mb-20">
        <p className="font-roboto font-bold text-lg no-underline tracking-normal leading-none pt-5 pb-3 mt-3">
          Some Ads
        </p>
        <div className="bg-blue-600 rounded-xl h-1 mb-4 w-[50%]"></div>
        <img
          className="h-36 rounded-lg cursor-pointer"
          src={ad}
          alt="ads"
        ></img>
      </div>
    </div>
  );
};

export default LeftSidebar;
