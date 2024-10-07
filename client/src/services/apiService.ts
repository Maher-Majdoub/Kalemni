import { AxiosResponse } from "axios";
import apiClient from "./apiClient";

class ApiService<TData, TInput = object> {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  get = () =>
    apiClient
      .get<TData>(this.endpoint, {
        headers: { "x-auth-token": localStorage.getItem("auth-token") },
      })
      .then((res) => res.data);

  post = (input: object) =>
    apiClient
      .post<TInput, AxiosResponse<TData>>(this.endpoint, input, {
        headers: { "x-auth-token": localStorage.getItem("auth-token") },
      })
      .then((res) => res.data);

  postFormData = (data: FormData) =>
    apiClient
      .post<TInput, AxiosResponse<TData>>(this.endpoint, data, {
        headers: {
          "x-auth-token": localStorage.getItem("auth-token"),
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => res.data);
}

export default ApiService;
