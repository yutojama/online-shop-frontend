import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import NavbarSec from "../components/navbar-secondary";
import Footer from '../components/footer'

export default function StoreLayout({user}) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar user={user}/>
      <NavbarSec />

      <div className="container mt-4 flex-grow-1">
        <Outlet />
      </div>

      <Footer/>
    </div>
  );
}