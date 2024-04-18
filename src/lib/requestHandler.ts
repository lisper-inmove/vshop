import { AxiosError, AxiosResponse } from "axios";

type Headers = {
  Authorization?: string;
};

type BaseRequest<T, V> = (
  params?: T,
  headers?: Headers,
) => Promise<AxiosResponse<V>>;

type SuccessResponse<V> = {
  code: "success";
  data: V;
};

type ErrorResponse<E = AxiosError> = {
  code: "error";
  error: E;
};

type BaseResponse<V, E> = Promise<SuccessResponse<V> | ErrorResponse<E>>;

export const requestHandler =
  <T, V, E = AxiosError>(request: BaseRequest<T, V>) =>
  async (params?: T, headers?: Headers): BaseResponse<V, E> => {
    try {
      const response = await request(params, headers);
      return { code: "success", data: response.data };
    } catch (e) {
      return { code: "error", error: e as E };
    }
  };
