import { useMutation } from "@tanstack/react-query";
import apiClient from "../services/apiClient";

const usePingServer = () => {
  const mutation = useMutation({
    mutationFn: () => apiClient.get("/"),
  });
  return { pingServer: mutation.mutate, isSuccess: mutation.isSuccess };
};

export default usePingServer;
