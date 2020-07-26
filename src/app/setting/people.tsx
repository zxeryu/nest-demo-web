import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRequest, useTempDataOfRequest } from "../../core/request";
import { users, IUser, IResp } from "../../clients";
import { useObservable } from "../../core/store";
import { Button } from "antd";
import { ActionType, OTable } from "../../component/table";
import { map, size, get } from "lodash";

const Users = () => {
  const actionRef = useRef<ActionType<IUser> | undefined>();

  const [pageInfo, setPageInfo] = useState<{ page: number; pageSize: number }>();
  const [data, setData] = useState<IResp | undefined>();
  const [request, requesting$] = useRequest(users, {
    onSuccess: (actor) => {
      setData(actor.arg.data);
    },
  });
  useEffect(() => {
    pageInfo &&
      request({
        page: pageInfo?.page,
        pageSize: pageInfo?.pageSize,
      });
  }, [pageInfo]);
  const list = useMemo(() => map(get(data, "data", []), (item) => ({ ...item, key: item.id })), [data]);
  const requesting = useObservable(requesting$);

  const columns = [
    { key: "id", dataIndex: "id", title: "id" },
    { key: "name", dataIndex: "name", title: "姓名" },
    { key: "age", dataIndex: "age", title: "年龄", sorter: (a, b) => a.age - b.age },
  ];

  return (
    <div>
      <OTable<IUser>
        actionRef={(actionRef1) => (actionRef.current = actionRef1)}
        loading={requesting}
        columns={columns}
        dataSource={list}
        rowSelection={{}}
        pageTotal={get(data, "total")}
        onPageChange={(page, pageSize) => {
          setPageInfo({ page, pageSize });
        }}
        toolBarOptions={{ columnSetting: true }}
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
