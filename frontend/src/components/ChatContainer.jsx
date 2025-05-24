import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setIsImageModalOpen(false);
  };

  const confirmAndDownload = async (imageUrl) => {
    const result = await Swal.fire({
      title: "Simpan Gambar?",
      text: "Klik Ya untuk menyimpan gambar ini.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, simpan",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = "gambar-chat.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      Swal.fire({
        icon: "success",
        title: "Disimpan",
        text: "Gambar berhasil disimpan!",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const handleAvatarClick = (avatarUrl) => {
    setSelectedAvatar(avatarUrl);
    setIsAvatarModalOpen(true);
  };

  const closeAvatarModal = () => {
    setSelectedAvatar(null);
    setIsAvatarModalOpen(false);
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            {/* Avatar */}
            <div className="chat-image avatar">
              <div
                className="w-10 h-10 rounded-full border overflow-hidden cursor-pointer"
                onClick={() =>
                  handleAvatarClick(
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  )
                }
              >
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Time */}
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>

            {/* Message Content */}
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2 cursor-pointer hover:opacity-80"
                  onClick={() => handleImageClick(message.image)}
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Gambar Chat */}
      {isImageModalOpen && selectedImage && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={closeImageModal}
        >
          <div
            className="relative flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeImageModal}
              className="absolute top-2 left-2 text-white text-xl bg-black bg-opacity-50 rounded-full px-3 py-1 hover:bg-opacity-80"
            >
              ✕
            </button>
            <img
              src={selectedImage}
              alt="Preview"
              onClick={() => confirmAndDownload(selectedImage)}
              className="max-w-[90vw] max-h-[80vh] object-contain rounded shadow-lg cursor-pointer"
              title="Klik gambar untuk menyimpan"
            />
          </div>
        </div>
      )}

      {/* Modal Avatar Bulat */}
      {isAvatarModalOpen && selectedAvatar && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={closeAvatarModal}
        >
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeAvatarModal}
              className="absolute top-2 right-2 text-white text-xl bg-black bg-opacity-50 rounded-full px-3 py-1 hover:bg-opacity-80"
            >
              ✕
            </button>

            <img
              src={selectedAvatar}
              alt="Avatar"
              className="w-60 h-60 object-cover rounded-full border-4 border-white shadow-xl"
            />
          </div>
        </div>
      )}

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
