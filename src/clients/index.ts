import { createRequestActor } from "../core/request";

export interface IUser {
  id: number;
  name: string;
  age: string;
}

export const users = createRequestActor<{ name: string }, IUser[]>("users", ({ name: pName }) => {
  return {
    method: "GET",
    // url: "http://localhost:8080/users",
    url: "http://192.168.200.37:8080/users",
    query: {
      name: pName,
    },
  };
});
