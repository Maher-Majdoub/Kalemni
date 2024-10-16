import { useQuery } from "@tanstack/react-query";
import ApiService from "../services/apiService";
import { AxiosError } from "axios";

interface ISharedMedia {
  _id: string;
  src: string;
  type: "video" | "image";
}

const useSharedMedia = (conversationId: string) => {
  const apiService = new ApiService<ISharedMedia[]>(
    `/users/me/conversations/${conversationId}/shared-media`
  );

  const query = useQuery<ISharedMedia[], AxiosError>({
    queryFn: apiService.get,
    queryKey: ["sharedMedia", conversationId],
  });

  return {
    sharedMedia: query.data,
    isGetSharedMediaPending: query.isPending,
    isGetSharedMediaSuccess: query.isSuccess,
    isGetSharedMediaError: query.isError,
    getSharedMediaError: query.error?.response?.data,
  };
};

export default useSharedMedia;
