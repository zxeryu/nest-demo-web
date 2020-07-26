import React, { useEffect, useState } from "react";
import { TableProps } from "antd/es/table";
import { omit, map, get, filter } from "lodash";
import { IToolBarProps, ToolBar } from "./ToolBar";
import { OTableContextProvider, useOTableColumns } from "./ctx";
import { Table } from "antd";
import { ColumnType } from "antd/es/table/interface";

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
  toolBarRender?: IToolBarProps<T>["toolBarRender"];
  toolBarOptions?: IToolBarProps<T>["options"];
}

const TableComponent = <RecordType extends {}>({
  dataSource,
  rowSelection,
  actionRef,
  toolBarRender,
  toolBarOptions,
}: Omit<TableProps<RecordType>, "columns"> & IOTable<RecordType>) => {
  const columns = useOTableColumns();
  console.log("@@@@@@@@@@@@@@@@@@@");
  //selectRows
  const [selectedRows, setSelectedRows] = useState<ISelectedObjs<RecordType>>({
    keys: [],
    rows: [],
  });
  //columns

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
      {(toolBarRender || toolBarOptions) && (
        <ToolBar selectObjs={selectedRows} toolBarRender={toolBarRender} options={toolBarOptions} />
      )}
      <Table
        columns={filter(columns, (item) => get(item, "showState", true) as true)}
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

export const OTable = <RecordType extends {}>({
  columns,
  ...otherProps
}: TableProps<RecordType> & IOTable<RecordType>) => {
  const [oColumns, updateOColumns] = useState<ColumnType<RecordType>[]>([]);

  useEffect(() => {
    updateOColumns(
      map(columns, (item) => {
        const showState = get(item, "showState", true);
        return { ...item, showState };
      }),
    );
  }, [columns]);

  return (
    <OTableContextProvider value={{ columns: oColumns, updateColumns: updateOColumns as any }}>
      <TableComponent {...otherProps} />
    </OTableContextProvider>
  );
};
