import { AxiosResponse } from "axios";
import apiClient from "./apiClient";

class ApiService<TData, TInput = object> {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = "/api" + endpoint;
  }

  get = () =>
    apiClient
      .get<TData>(this.endpoint, {
        headers: { "x-auth-token": localStorage.getItem("auth-token") },
      })
      .then((res) => res.data);

  post = (input: TInput) =>
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

  patch = (data: TInput) =>
    apiClient
      .patch<TInput, AxiosResponse<TData>>(this.endpoint, data, {
        headers: {
          "x-auth-token": localStorage.getItem("auth-token"),
        },
      })
      .then((res) => res.data);

  patchFormData = (data: FormData) =>
    apiClient
      .patch<TInput, AxiosResponse<TData>>(this.endpoint, data, {
        headers: {
          "x-auth-token": localStorage.getItem("auth-token"),
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => res.data);

  delete = () =>
    apiClient
      .delete(this.endpoint, {
        headers: { "x-auth-token": localStorage.getItem("auth-token") },
      })
      .then((res) => res.data);
}

export default ApiService;
