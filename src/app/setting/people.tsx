import React, { useMemo, useRef } from "react";
import { useTempDataOfRequest } from "../../core/request";
import { users, IUser } from "../../clients";
import { useObservable } from "../../core/store";
import { Button } from "antd";
import { ActionType, OTable } from "../../component/table";
import { map, size } from "lodash";

const Users = () => {
  const actionRef = useRef<ActionType<IUser> | undefined>();

  const [data, , requesting$] = useTempDataOfRequest(users, { name: "zx" }, []);
  const list = useMemo(() => map(data, (item) => ({ ...item, key: item.id })), [data]);
  const requesting = useObservable(requesting$);
  if (requesting) {
    return <div>Loading...</div>;
  }
  if (!list) {
    return <div>Empty</div>;
  }

  const columns = [
    { key: "id", dataIndex: "id", title: "id" },
    { key: "name", dataIndex: "name", title: "Name" },
    { key: "age", dataIndex: "age", title: "Age" },
  ];

  return (
    <div>
      <OTable<IUser>
        actionRef={(actionRef1) => (actionRef.current = actionRef1)}
        columns={columns}
        dataSource={list}
        rowSelection={{}}
        toolBarRender={(selectedObjs) => (
          <>
            {size(selectedObjs?.rows) > 0 && (
              <Button
                onClick={() => {
                  console.log(selectedObjs);
                }}>
                批量删除
              </Button>
            )}
            <Button
              onClick={() => {
                console.log(actionRef.current?.getSelected());
              }}>
              get
            </Button>
            <Button
              onClick={() => {
                actionRef.current?.clearSelected();
              }}>
              clear
            </Button>
            <Button
              onClick={() => {
                if (list) {
                  actionRef.current?.setSelected({ keys: [list[0].key], rows: [list[0]] });
                }
              }}>
              set
            </Button>
          </>
        )}
      />
    </div>
  );
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
