import React from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <div className="flex items-center justify-between p-4 bg-gray-800 text-white">
        <h1 className="text-2xl">SplitKaro</h1>
        <div className="space-x-4">
          <a href="/">Dashboard</a>
          <a href="/expenses">Expenses</a>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Layout;
