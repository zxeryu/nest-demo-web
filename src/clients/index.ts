import { createRequestActor } from "../core/request";

export const users = createRequestActor<{ name: string }, any>("users", ({ name: pName }) => {
  return {
    method: "GET",
    url: "http://localhost:8080/users",
    query: {
      name: pName,
    },
  };
});
