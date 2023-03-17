import React from "react";
import starkFamily from "../stark-family.jpeg";

function Message(props) {
  return (
    <div className={`message ${props.className}`}>
      <img className="avatar" src={props.avatar} alt="avatar" />

      {props.photoURL ? (
        <div className="content attached">
          <img className="picture" src={props.photoURL} alt="picture" />
          <span className="text">{props.msg}</span>
          <span className="receive-time">{props.time}</span>
        </div>
      ) : (
        <div className="content">
          <span className="text">{props.msg}</span>
          <span className="receive-time">{props.time}</span>
        </div>
      )}
    </div>
  );
}

export default Message;
