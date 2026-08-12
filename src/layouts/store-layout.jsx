import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import NavbarSec from "../components/navbar-secondary";
import Footer from '../components/footer'

export default function StoreLayout() {
  return (
    <>
      <Navbar />
      <NavbarSec />

      <div className="container mt-4">
        <Outlet />
      </div>

      <Footer/>
    </>
  );
}