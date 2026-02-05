import axios, { AxiosResponse } from "axios";

export const fetcher = (url: string) =>
  axios.get(url).then((res: AxiosResponse) => res.data);
