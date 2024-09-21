import { useParams } from "react-router-dom";
import useMessages from "../hooks/useMessages";

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

  return (
    <>
      <div>Messages</div>
      {isGetMessagesPending && <span>Loading...</span>}
      {isGetMessagesSuccess && (
        <ul>
          {messages?.map((message) => (
            <li>{message.content}</li>
          ))}
        </ul>
      )}
      <form>
        <input type="text" />
        <button>Send</button>
      </form>
    </>
  );
};

export default Messages;
