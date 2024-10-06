import { QueryClient } from "@tanstack/react-query";
import { IConversation } from "./useConversation";

const useSetConversationUserState = (queryClient: QueryClient) => {
  const setConversationUserState = (
    conversationId: string,
    userId: string,
    newData: object
  ) => {
    queryClient.setQueryData(
      ["conversation", conversationId],
      (oldData: IConversation) => {
        if (!oldData) return;
        return {
          ...oldData,
          participants: oldData.participants.map((participant) => {
            if (participant.user._id === userId)
              return { ...participant, ...newData };

            return participant;
          }),
        };
      }
    );
  };

  return { setConversationUserState };
};

export default useSetConversationUserState;
