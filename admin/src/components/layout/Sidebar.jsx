import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { LockIcon, GroupsIcon, BooksIcon, GridViewIcon } from "../common/icons";
import AdminService from "../../service/AdminService";
import { useSelector } from "react-redux";

function Sidebar() {
  const store = useSelector((state) => state.store.auth);

  const handleLogout = () => {
    AdminService.logout().then(() => {
      window.location = "/admin/auth";
    });
  };

  return (
    <SideBar>
      <div>
        <Avt>
          <img
            src={store?.user?.avatar}
            alt=""
            style={{
              borderRadius: "50%",
              border: "1px solid #ccc",
              width: 50,
              height: 50,
            }}
          />
          <p>{store.user.username}</p>
        </Avt>
      </div>
      <NavLink to="/" activeClassName="active">
        <Wrap>
          <GridViewIcon />
          <p>Tổng quan</p>
        </Wrap>
      </NavLink>
      <NavLink to="/users" activeClassName="active">
        <Wrap>
          <GroupsIcon />
          <p>Người dùng</p>
        </Wrap>
      </NavLink>
      <NavLink to="/courses" activeClassName="active">
        <Wrap>
          <BooksIcon />
          <p>Khoá học</p>
        </Wrap>
      </NavLink>
      <NavLink
        to="/admin/login"
        activeClassName="active"
        onClick={handleLogout}
      >
        <Wrap>
          <LockIcon />
          <p>Đăng xuất</p>
        </Wrap>
      </NavLink>
    </SideBar>
  );
}

const SideBar = styled.div`
  display: flex;
  flex-flow: column nowrap;
  height: 100vh;
  margin-left: 20px;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
  padding: 20px 5px;
  a {
    padding: 10px 1.5rem;
    background: linear-gradient(to left, #fff 50%, #039be5 50%) right;
    background: white;
    background-size: 200%;
    transition: 0.471s ease-out;
    color: black;
    text-decoration: none;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;
    margin: 2px 0;
    border-radius: 12px;
    p {
      font-size: 1.4rem;
    }
  }
  a:hover {
    cursor: pointer;
    background-color: #E9D8D7;
    color: white;
    background-position: left;
    border-radius: 12px;
  }
  a.active {
    background-color: #B75B6C;
    background-position: 0 0;
    color: #fff;
    border-radius: 12px;
  }
`;

const Wrap = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: 10px;
  align-items: center;
`;
const Avt = styled.div`
  padding: 5px 1.5rem;
  display: flex;
  flex-flow: row nowrap;
  gap: 10px;
  align-items: center;
  height: 3rem;
  font-size: 1.5rem;
  font-weight: 400;
  margin-bottom: 20px;
  img {
    height: 100%;
    border-radius: 100%;
  }
  p {
    font-weight: 600;
    padding: 0.3rem;
    border-radius: 5px;
  }
`;
export default Sidebar;
