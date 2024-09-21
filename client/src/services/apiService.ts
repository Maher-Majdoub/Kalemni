import { AxiosResponse } from "axios";
import apiClient from "./apiClient";

class ApiService<TData, TInput = object> {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  get = () => apiClient.get<TData>(this.endpoint).then((res) => res.data);
  post = (input: object) =>
    apiClient
      .post<TInput, AxiosResponse<TData>>(this.endpoint, input)
      .then((res) => res.data);
}

export default ApiService;
