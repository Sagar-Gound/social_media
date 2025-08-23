import React, { useRef, useState } from "react";
import "./share.css";
import PermMediaOutlinedIcon from "@mui/icons-material/PermMediaOutlined";
import {
  Cancel,
  EmojiEmotionsOutlined,
  LabelOutlined,
  RoomOutlined,
  Send,
  PhotoCamera,
  VideoCall,
  GifBox,
  Poll,
} from "@mui/icons-material";
import { useContext } from "react";
import { AuthContext } from "./../../context/AuthContext";
import axios from "axios";
import EmojiPicker from 'emoji-picker-react';

export default function Share({ onNewPost }) {
  const { user: currentUser } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const desc = useRef();
  const [file, setFile] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [postText, setPostText] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const fileInputRef = useRef();

  const MAX_CHARS = 500;

  // Handle text input changes
  const handleTextChange = (e) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARS) {
      setPostText(text);
      setCharCount(text.length);
      desc.current.value = text;
    }
  };

  // Handle emoji selection
  const handleEmojiClick = (emojiData) => {
    const emoji = emojiData.emoji;
    const currentText = postText;
    const newText = currentText + emoji;

    if (newText.length <= MAX_CHARS) {
      setPostText(newText);
      setCharCount(newText.length);
      desc.current.value = newText;
    }
    setShowEmojiPicker(false);
  };

  // Handle file selection
  const handleFileChange = (selectedFile) => {
    if (selectedFile) {
      // Validate file type - only images for posts
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(selectedFile.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF, WEBP)');
        return;
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (selectedFile.size > maxSize) {
        alert('File size should be less than 10MB');
        return;
      }

      setFile(selectedFile);
      setShowPreview(true);
    }
  };

  // Handle drag and drop
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    handleFileChange(droppedFile);
  };

  // Clear post data
  const clearPost = () => {
    setPostText("");
    setCharCount(0);
    setFile(null);
    setShowPreview(false);
    setShowEmojiPicker(false);
    desc.current.value = "";
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const trimmedText = postText.trim() || desc.current.value.trim();

    if (!trimmedText && !file) {
      alert("Please add some content or attach a file to your post!");
      return;
    }

    if (trimmedText.length > MAX_CHARS) {
      alert(`Post is too long! Maximum ${MAX_CHARS} characters allowed.`);
      return;
    }

    setIsPosting(true);

    const newPost = {
      userId: currentUser._id,
      desc: trimmedText,
    };

    // Handle file upload
    if (file) {
      const data = new FormData();
      data.append("file", file);

      try {
        console.log("Uploading file...");
        const uploadResponse = await axios.post("/upload/posts", data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log(uploadResponse)

        if (uploadResponse.data && uploadResponse.data.data.filename) {
          newPost.img = uploadResponse.data.data.filename;
        } else {
          throw new Error("Upload response missing filename");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Failed to upload file. Please try again.");
        setIsPosting(false);
        return;
      }
    }

    try {
      const response = await axios.post("/posts", newPost);

      console.log({ response });
      // Call the callback with the new post if provided
      if (onNewPost && response.data) {
        onNewPost(response.data.data || response.data);
      }

      // Clear the form
      clearPost();

      // Show success message
      alert("Post created successfully! 🎉");

    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <form className="shareForm" onSubmit={submitHandler}>
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
            <div className="shareInputContainer">
              <textarea
                className="shareInput"
                placeholder={`What's on your mind, ${currentUser.username}?`}
                ref={desc}
                value={postText}
                onChange={handleTextChange}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                rows="3"
                maxLength={MAX_CHARS}
              />
              <div className="shareInputFooter">
                <div className="charCounter">
                  <span className={charCount > MAX_CHARS * 0.9 ? 'warning' : ''}>
                    {charCount}/{MAX_CHARS}
                  </span>
                </div>
                {charCount > 0 && (
                  <button
                    type="button"
                    className="clearTextButton"
                    onClick={() => {
                      setPostText("");
                      setCharCount(0);
                      desc.current.value = "";
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Drag and Drop Overlay */}
          {dragActive && (
            <div className="dragOverlay">
              <div className="dragContent">
                <PhotoCamera className="dragIcon" />
                <p>Drop your image or video here</p>
              </div>
            </div>
          )}

          {/* File Preview */}
          {file && showPreview && (
            <div className="sharePreview">
              <div className="previewHeader">
                <span>File Preview</span>
                <button
                  type="button"
                  className="removePreview"
                  onClick={() => {
                    setFile(null);
                    setShowPreview(false);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                >
                  <Cancel />
                </button>
              </div>
              <div className="previewContent">
                {file.type.startsWith('image/') ? (
                  <img
                    className="sharePreviewImg"
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                  />
                ) : (
                  <video
                    className="sharePreviewVideo"
                    src={URL.createObjectURL(file)}
                    controls
                    muted
                  />
                )}
                <div className="fileInfo">
                  <span className="fileName">{file.name}</span>
                  <span className="fileSize">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
              </div>
            </div>
          )}

          <hr className="shareHr" />

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="emojiPickerContainer">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}

          <div className="shareBottom">
            <div className="shareOptions">
              <label htmlFor="file" className="shareOption">
                <PhotoCamera className="shareIcon" sx={{ color: "#f39c12" }} />
                <span className="shareOptionText">Photo</span>
                <input
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  type="file"
                  id="file"
                  accept="image/*,video/*"
                  onChange={(e) => handleFileChange(e.target.files[0])}
                />
              </label>

              <div className="shareOption">
                <VideoCall className="shareIcon" sx={{ color: "#e74c3c" }} />
                <span className="shareOptionText">Video</span>
              </div>

              <div
                className="shareOption"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <EmojiEmotionsOutlined className="shareIcon" sx={{ color: "#f1c40f" }} />
                <span className="shareOptionText">Feeling</span>
              </div>

              <div className="shareOption">
                <RoomOutlined className="shareIcon" sx={{ color: "#27ae60" }} />
                <span className="shareOptionText">Location</span>
              </div>

              <div className="shareOption">
                <GifBox className="shareIcon" sx={{ color: "#9b59b6" }} />
                <span className="shareOptionText">GIF</span>
              </div>

              <div className="shareOption">
                <Poll className="shareIcon" sx={{ color: "#3498db" }} />
                <span className="shareOptionText">Poll</span>
              </div>
            </div>

            <button
              className={`shareButton ${isPosting ? 'posting' : ''} ${!postText.trim() && !file ? 'disabled' : ''}`}
              type="submit"
              disabled={isPosting || (!postText.trim() && !file)}
            >
              {isPosting ? (
                <div className="loadingSpinner">
                  <div className="spinner"></div>
                  <span>Posting...</span>
                </div>
              ) : (
                <div className="shareButtonContent">
                  <Send className="shareButtonIcon" />
                  <span>Share</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
