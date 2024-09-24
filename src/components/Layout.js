import React from 'react';
import NavBarComponent from "./NavBar";
import Footer from "./footer";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavBarComponent />
      <main className="flex-fill">
        <Outlet /> {/* This is where child routes will render */}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
