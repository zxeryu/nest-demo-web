import React, { ReactElement, useCallback, useMemo } from "react";
import { Form } from "antd";
import { isArray, map, size, forEach, includes, debounce } from "lodash";
import { FormProps } from "antd/es/form";

export interface ISearchFormProps extends Omit<FormProps, "onFieldsChange"> {
  state?: any;
  setFilter?: (_: any) => void;
  debounceKeys?: Array<string>;
  debounceTime?: number;
}

export const OSearchForm = ({
  state,
  setFilter,
  debounceKeys,
  debounceTime = 500,
  children,
  ...otherProps
}: ISearchFormProps) => {
  // debounce update for input
  const debounceSetFields = useMemo(() => {
    return debounce((key: string, value: any) => {
      setFilter && setFilter({ [key]: value });
    }, debounceTime);
  }, [debounceTime]);

  const handleFieldChange = useCallback((changedFields) => {
    if (!setFilter) {
      return;
    }
    if (size(changedFields) <= 0) {
      return;
    }
    forEach(changedFields, (item) => {
      forEach(item.name as [], (name) => {
        if (!name) {
          return;
        }
        if (includes(debounceKeys, name)) {
          debounceSetFields(name, item.value);
        } else {
          setFilter({ [name]: item.value });
        }
      });
    });
  }, []);

  return (
    <Form
      layout={"inline"}
      {...otherProps}
      initialValues={state || otherProps.initialValues}
      onFieldsChange={handleFieldChange}>
      {children}
    </Form>
  );
};

export const OSimpleSearchForm = ({
  children,
  ...otherProps
}: Omit<ISearchFormProps, "children"> & { children: ReactElement | ReactElement[] }) => {
  return (
    <OSearchForm {...otherProps}>
      {map(isArray(children) ? children : [children], (item) => {
        if (!item.key) {
          return item;
        }
        return (
          <Form.Item key={item.key as string} name={item.key as string}>
            {item}
          </Form.Item>
        );
      })}
    </OSearchForm>
  );
};
