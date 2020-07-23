import { Table } from "antd";
import React, { useEffect, useState } from "react";
import { TableProps } from "antd/es/table";
import { omit } from "lodash";

export interface ISelectedObjs<T> {
  keys: React.Key[];
  rows: T[];
}

export interface ActionType<T> {
  // reload: (resetPageIndex?: boolean) => void;
  // reloadAndRest: () => void;
  // fetchMore: () => void;
  // reset: () => void;
  clearSelected: () => void;
  getSelected: () => ISelectedObjs<T>;
  setSelected: (_: ISelectedObjs<T>) => void;
}

export interface IOTable<T> {
  //use OTable methods by ref
  actionRef?: React.MutableRefObject<ActionType<T> | undefined> | ((actionRef: ActionType<T>) => void);
}

export const OTable = <RecordType extends {}>({
  columns,
  dataSource,
  rowSelection,
  actionRef,
}: Omit<TableProps<RecordType>, ""> & IOTable<RecordType>) => {
  const [selectedRows, setSelectedRows] = useState<ISelectedObjs<RecordType>>({
    keys: [],
    rows: [],
  });
  //actionRef
  useEffect(() => {
    const userAction: ActionType<RecordType> = {
      clearSelected: () => {
        setSelectedRows({ keys: [], rows: [] });
      },
      getSelected: () => selectedRows,
      setSelected: (selectRows) => {
        setSelectedRows(selectRows);
      },
    };
    if (actionRef && typeof actionRef === "function") {
      actionRef(userAction);
    }
    if (actionRef && typeof actionRef !== "function") {
      actionRef.current = userAction;
    }
  }, [selectedRows]);
  return (
    <div>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowSelection={
          rowSelection
            ? {
                ...omit(rowSelection, ["selectedRowKeys", "onChange"]),
                selectedRowKeys: selectedRows.keys,
                onChange: (keys: React.Key[], rows: RecordType[]) => {
                  setSelectedRows({ keys, rows });
                },
              }
            : undefined
        }
      />
    </div>
  );
};
