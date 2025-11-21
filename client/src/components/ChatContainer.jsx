import { useCallback, useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    selectedUser,
    setSelectedUser,
    sendMessage,
    getMessages,
    setShowDetailsPanel,
  } = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  const scrollEnd = useRef();
  const messagesContainerRef = useRef();
  const [atBottom, setAtBottom] = useState(true); // true if user is at (or very near) bottom
  // Removed lastLength tracking since not needed after refinement

  const [input, setInput] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (imagePreview) {
      const imageToSend = imagePreview;
      setImagePreview(null);
      setInput("");
      try {
        await sendMessage({ image: imageToSend });
      } catch {
        toast.error("Failed to send image");
        // Optionally, you could restore the preview here if send fails
      }
      return;
    }
    if (input.trim() === "") return null;
    await sendMessage({ text: input.trim() });
    setInput("");
  };

  // Handle sending an image

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("select an image file");
      return;
    }
    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result);
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  const cancelImage = () => {
    setImagePreview(null);
  };

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser, getMessages]);

  // Simple scroll handler (previous approach)
  const handleScroll = useCallback(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    setAtBottom(distance <= 5);
  }, []);

  // Previous scroll approach using scrollIntoView on a sentinel element
  const scrollToBottom = useCallback((behavior = "auto") => {
    const endEl = scrollEnd.current;
    if (!endEl) return;
    endEl.scrollIntoView({ behavior });
  }, []);

  useEffect(() => {
    if (!messages || !messages.length) return;
    const lastMessage = messages[messages.length - 1];
    const sentBySelf = lastMessage.senderId === authUser?._id;
    if (atBottom || sentBySelf) {
      scrollToBottom(sentBySelf ? "smooth" : "auto");
    }
  }, [messages, atBottom, authUser, scrollToBottom]);

  return selectedUser ? (
    <div className="h-full flex flex-col relative backdrop-blur-lg overflow-hidden">
      {/* {------------header-------------} */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt=""
          className="w-8 rounded-full"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt=""
          className="md:hidden max-w-7"
        />
        <img
          src={assets.help_icon}
          alt="Show user info"
          className="max-md:hidden max-w-5 cursor-pointer"
          onClick={() => setShowDetailsPanel((p) => !p)}
        />
      </div>
      {/* {----------chat area----------} */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex flex-col flex-1 overflow-y-auto p-3 pb-24"
        style={{ overscrollBehavior: "contain", willChange: "scroll-position" }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 justify-end ${
              msg.senderId !== authUser._id && "flex-row-reverse"
            }`}
          >
            {msg.image ? (
              <img
                src={msg.image}
                alt=""
                loading="lazy"
                className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
              />
            ) : (
              <p
                className={`p-2 max-w-[200px] md:text-sm font-light
                rounded-lg mb-8 break-all bg-violet-500/30 text-white ${
                  msg.senderId !== authUser._id
                    ? "rounded-br-none"
                    : "rounded-bl-none"
                }`}
              >
                {msg.text}
              </p>
            )}
            <div className="text-center text-xs">
              <img
                src={
                  msg.senderId === authUser._id
                    ? authUser?.profilePic || assets.avatar_icon
                    : selectedUser?.profilePic || assets.avatar_icon
                }
                alt=""
                className="w-7 rounded-full"
              />
              <p className="text-gray-500">
                {formatMessageTime(msg.createdAt)}
              </p>
            </div>
          </div>
        ))}

        <div ref={scrollEnd}></div>
      </div>

      {/* {-------------bottom area--------------} */}

      <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-3 p-3 bg-gradient-to-t from-black/60 to-transparent">
        {!atBottom && messages.length > 0 && (
          <button
            aria-label="Jump to latest"
            onClick={() => scrollToBottom("smooth")}
            className="absolute -top-10 right-4 bg-violet-600 text-white text-lg w-8 h-8 flex items-center justify-center rounded-full shadow hover:bg-violet-500"
          >
            ↓
          </button>
        )}
        {imagePreview && (
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-16 h-16 object-cover rounded-lg border border-gray-700"
            />
            <button
              aria-label="Cancel image"
              onClick={cancelImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
            >
              ×
            </button>
          </div>
        )}
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              onKeyDown={(e) => {
                e.key === "Enter" ? handleSendMessage(e) : null;
              }}
              type="text"
              placeholder="Send a message"
              className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400"
            />
            <input
              onChange={handleSendImage}
              type="file"
              id="image"
              accept="image/png, image/jpg, image/jpeg"
              hidden
            />
            <label htmlFor="image">
              <img
                src={assets.gallery_icon}
                alt=""
                className="w-5 mr-2 cursor-pointer"
              />
            </label>
          </div>
          <img
            onClick={handleSendMessage}
            src={assets.send_button}
            alt=""
            className="w-7 cursor-pointer"
          />
        </div>
        {/* Details panel intentionally moved to RightSidebar only */}
      </div>
    </div>
  ) : (
    <div
      className="flex flex-col items-center justify-center gap-2 text-gray-500
    bg-white/10 max-md:hidden"
    >
      <img src={assets.logo_icon} alt="" className="max-w-16" />
      <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;
