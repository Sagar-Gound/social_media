import React, { useRef, useState } from "react";
import "./share.css";
import PermMediaOutlinedIcon from "@mui/icons-material/PermMediaOutlined";
import {
  Cancel,
  EmojiEmotionsOutlined,
  LabelOutlined,
  RoomOutlined,
} from "@mui/icons-material";
import { useContext } from "react";
import { AuthContext } from "./../../context/AuthContext";
import axios from "axios";

export default function Share() {
  const { user: currentUser } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const desc = useRef();
  const [file, setFile] = useState(null);
  
  const submitHandler = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: currentUser._id,
      desc: desc.current.value,
    };
    // console.log("File: ",file)
    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      newPost.img = fileName;
      // console.log(newPost)
      try {
        console.log(data);
        await axios.post("/upload", data);
      } catch (error) {}
    }
    try {
      await axios.post("/posts", newPost);
      window.location.reload();
    } catch (error) {}
  };

  // console.log(currentUser)
  
  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            className="shareProfileImg"
            src={
              currentUser.profilePicture
                ? PF + currentUser.profilePicture
                : PF + "profile/noAvatar.png"
            }
            alt=""
          />
          <input
            type="text"
            className="shareInput"
            placeholder={"What's in your mind " + currentUser.username + "?"}
            ref={desc}
          />
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareImgContainer">
            <img className="shareImg" src={URL.createObjectURL(file)} alt="" />
            <Cancel className="shareCancelImg" onClick={() => setFile(null)} />
          </div>
        )}
        <form className="shareBottom" onSubmit={submitHandler}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMediaOutlinedIcon
                htmlColor="tomato"
                fontSize="small"
                className="shareIcon"
              />
              <span className="shareOptionText">Photo or Video</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                }}
              />
            </label>
            <div className="shareOption">
              <LabelOutlined
                htmlColor="blue"
                fontSize="small"
                className="shareIcon"
              />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption">
              <RoomOutlined
                htmlColor="green"
                fontSize="small"
                className="shareIcon"
              />
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOption">
              <EmojiEmotionsOutlined
                htmlColor="goldenrod"
                fontSize="small"
                className="shareIcon"
              />
              <span className="shareOptionText">Feelings</span>
            </div>
          </div>
          <button className="shareButton" type="submit">
            Share
          </button>
        </form>
      </div>
    </div>
  );
}
