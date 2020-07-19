import React from "react";
import { useTempDataOfRequest } from "../../core/request";
import { users } from "../../clients";
import { useObservable } from "../../core/store";

const Users = () => {
  const [data, , requesting$] = useTempDataOfRequest(users, { name: "zx" }, []);
  const requesting = useObservable(requesting$);
  if (requesting) {
    return <div>Loading...</div>;
  }
  if (!data) {
    return <div>Empty</div>;
  }
  console.log("@@@@@@@@@", data);
  return <div>{data.toString()}</div>;
};

const PeopleList = () => {
  return (
    <div>
      people list
      <Users />
    </div>
  );
};

export default PeopleList;
