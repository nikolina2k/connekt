import React, { useState } from "react";
import { Input } from "@material-tailwind/react";
import { Button } from "@material-tailwind/react";
import { Typography } from "@material-tailwind/react";
import { Transition } from "@headlessui/react";
import { Link } from "react-router-dom";

function Reset() {
  const [email, setEmail] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="grid grid-cols-1 justify-items-center items-center h-screen">
      <div className="w-96">
        <Typography variant="h6" color="blue-gray" className="pb-4 ">
          Enter your email address
        </Typography>
        <Input
          name="email"
          type="email"
          label="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setIsEmailValid(e.target.validity.valid);
          }}
        />

        <Button
          variant="gradient"
          fullWidth
          className="mt-4"
          onClick={openPopup}
          disabled={!isEmailValid}
        >
          Send
        </Button>

        {/* Popup */}
        <Transition show={showPopup}>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-sm w-full">
              <p className="text-center mb-4">
                Follow the link we sent to your email to reset password.
              </p>
              <Link to="/login">
                <Button
                  variant="gradient"
                  fullWidth
                  className="mt-4"
                  onClick={closePopup}
                >
                  Close
                </Button>
              </Link>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  );
}

export default Reset;
