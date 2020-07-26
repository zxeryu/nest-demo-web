import { createRequestActor } from "../core/request";

export interface IUser {
  id: number;
  name: string;
  age: string;
}

export interface IResp {
  data: IUser[];
  total: number;
}

export const users = createRequestActor<{ page: number; pageSize: number }, IResp>(
  "users",
  ({ page: pPage, pageSize: pPageSize }) => {
    return {
      method: "GET",
      // url: "http://localhost:8080/users",
      url: "http://192.168.200.37:8080/users",
      query: {
        page: pPage,
        pageSize: pPageSize,
      },
    };
  },
);
