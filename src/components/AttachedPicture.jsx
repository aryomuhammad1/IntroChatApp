import React from "react";
import { MdClose } from "react-icons/md";

function AttachedPicture({ attachedPicture, setAttachedPicture }) {
  return (
    <div className="upload-picture">
      <div className="header">
        <MdClose
          onClick={() => setAttachedPicture({})}
          style={{
            height: "1.5rem",
            width: "1.5rem",
            cursor: "pointer",
            // fill: "var(--spr-light-clr)",
            fill: "var(--dark-clr)",
          }}
        />
      </div>
      <div className="picture-container">
        <img className="picture" src={attachedPicture.message} alt="picture" />
      </div>
    </div>
  );
}

export default AttachedPicture;
