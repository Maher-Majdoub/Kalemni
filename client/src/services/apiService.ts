import { AxiosError, AxiosResponse } from "axios";
import apiClient from "./apiClient";
import router from "../routes";
import { toast } from "react-toastify";

class ApiService<TData, TInput = object> {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = "/api" + endpoint;
  }

  handleException = (ex: AxiosError) => {
    if (ex.status === 401) {
      toast.info("Session expired");
      localStorage.removeItem("auth-token");
      router.navigate("/login");
    }

    if (ex.status === 500) {
      toast.error("Oops! Something went wrong. Please try refreshing the page");
    }

    if (ex.code === "ERR_NETWORK") {
      router.navigate("/server-down");
    }
  };

  get = () =>
    apiClient
      .get<TData>(this.endpoint, {
        headers: { "x-auth-token": localStorage.getItem("auth-token") },
      })
      .then((res) => res.data)
      .catch((ex) => {
        this.handleException(ex);
        throw ex;
      });

  post = (input: TInput) =>
    apiClient
      .post<TInput, AxiosResponse<TData>>(this.endpoint, input, {
        headers: { "x-auth-token": localStorage.getItem("auth-token") },
      })
      .then((res) => res.data)
      .catch((ex) => {
        this.handleException(ex);
        throw ex;
      });

  postFormData = (data: FormData) =>
    apiClient
      .post<TInput, AxiosResponse<TData>>(this.endpoint, data, {
        headers: {
          "x-auth-token": localStorage.getItem("auth-token"),
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => res.data)
      .catch((ex) => {
        this.handleException(ex);
        throw ex;
      });

  patch = (data: TInput) =>
    apiClient
      .patch<TInput, AxiosResponse<TData>>(this.endpoint, data, {
        headers: {
          "x-auth-token": localStorage.getItem("auth-token"),
        },
      })
      .then((res) => res.data)
      .catch((ex) => {
        this.handleException(ex);
        throw ex;
      });

  patchFormData = (data: FormData) =>
    apiClient
      .patch<TInput, AxiosResponse<TData>>(this.endpoint, data, {
        headers: {
          "x-auth-token": localStorage.getItem("auth-token"),
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => res.data)
      .catch((ex) => {
        this.handleException(ex);
        throw ex;
      });

  delete = () =>
    apiClient
      .delete(this.endpoint, {
        headers: { "x-auth-token": localStorage.getItem("auth-token") },
      })
      .then((res) => res.data)
      .catch((ex) => {
        this.handleException(ex);
        throw ex;
      });
}

export default ApiService;
