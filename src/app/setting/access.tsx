import React from "react";
import { Form, Input, InputNumber, Button } from "antd";

const AccessList = () => {
  return (
    <div>
      配置权限列表
      <Form
        layout={"inline"}
        onFinish={(values) => {
          console.log("onFinish values=", values);
        }}
        onValuesChange={(_, allValues) => {
          console.log("onFinish values", allValues);
        }}>
        <Form.Item label={"姓名"} name={"username"}>
          <Input />
        </Form.Item>
        <Form.Item label={"年龄～～～"} name={"age"}>
          <InputNumber />
        </Form.Item>
        <Form.Item>
          <Button htmlType={"submit"}>提交</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AccessList;
