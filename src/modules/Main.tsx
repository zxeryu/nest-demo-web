import React, { useState } from "react";
import { IRouteMeta, RouteMeta, SwitchRoutes } from "../core/route";
import { map } from "lodash";
import { NavLink } from "react-router-dom";
import { Layout } from "antd";
import { EachMenus } from "../component/menu/EachMenus";
import { select } from "../core/style";
const { Content, Sider } = Layout;

const HeaderHeight = "3em";

export const MainHeader = ({ route }: { route: IRouteMeta }) => {
  return (
    <header>
      <div css={select().height(HeaderHeight).display("flex").alignItems("center")}>
        <span css={select().margin("0 2em")}>nest-demo-web</span>
        {map(route.children, (sub) => {
          return (
            <NavLink key={sub.path} to={sub.fullPath}>
              <span key={sub.path}>{sub.title}</span>
            </NavLink>
          );
        })}
      </div>
    </header>
  );
};

export const MainAdmin = ({ route }: { route: RouteMeta }) => {
  const [collapsed, setCollapsed] = useState<boolean>();
  return (
    <Layout>
      <Sider
        css={{ height: `calc(100vh - ${HeaderHeight})`, overflow: "auto" }}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}>
        <EachMenus route={route} />
      </Sider>
      <Layout>
        <Content>
          <div css={{ height: `calc(100vh - ${HeaderHeight})`, overflowY: "auto" }}>
            <SwitchRoutes route={route} />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export const Main = ({ route }: { route: RouteMeta }) => {
  return (
    <Layout>
      <MainHeader route={route} />
      <Layout>
        <Content>
          <SwitchRoutes route={route} />
        </Content>
      </Layout>
    </Layout>
  );
};
