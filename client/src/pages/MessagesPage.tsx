import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import useMessages from "../hooks/useMessages";
import { useEffect, useRef, useState } from "react";
import "../index.css";

const socket = io("http://localhost:3000", {
  auth: {
    authToken: localStorage.getItem("auth-token"),
  },
});

interface Message {
  me: boolean;
  message: string;
}

const Messages = () => {
  const { friendId } = useParams();

  const {
    messages,
    isGetMessagesPending,
    isGetMessagesSuccess,
    isGetMessagesError,
    error,
  } = useMessages(friendId as string);

  if (isGetMessagesError) {
    console.log(error);
  }

  const messageInputRef = useRef<HTMLInputElement>(null);
  const [currMessages, setMessages] = useState<Message[]>([]);

  socket.on("receive-message", (data) => {
    console.log("here");

    if (data.senderId === friendId)
      setMessages([...currMessages, { me: false, message: data.message }]);
  });

  const sendMessage = () => {
    if (messageInputRef.current && messageInputRef.current.value) {
      const message = messageInputRef.current.value;
      socket.emit("send-message", {
        receiverId: friendId,
        message: message,
      });
      setMessages([...currMessages, { me: true, message: message }]);
      messageInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (isGetMessagesSuccess && messages) {
      const oldMessages: Message[] = messages.map((message) => {
        return { me: message.senderId !== friendId, message: message.content };
      });

      setMessages([...oldMessages, ...currMessages]);
    }
  }, [isGetMessagesSuccess]);

  return (
    <>
      <div>Messages</div>
      {isGetMessagesPending && <span>Loading...</span>}
      {isGetMessagesSuccess && (
        <ul>
          {currMessages?.map((message) => (
            <li key={message.message} className={message.me ? "right" : "left"}>
              {message.message}
            </li>
          ))}
        </ul>
      )}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendMessage();
        }}
      >
        <input type="text" placeholder="Message" ref={messageInputRef} />
        <button>Send</button>
      </form>
    </>
  );
};

export default Messages;
