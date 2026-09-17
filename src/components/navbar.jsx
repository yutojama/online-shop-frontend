import { Link } from "react-router-dom"
import { useState } from "react"
import { useNavigate } from "react-router-dom";

export default function Navbar({user}){

    const navi = useNavigate();
    const [search, setSearch] = useState("");
    // console.log(search);

    return(
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
            <div className="container-fluid px-4 flex-nowrap text-nowrap">

                {/* Logo / Brand */}
                <div className="d-flex align-items-center">
                    <Link className="navbar-brand" to="/">
                        DemoShop
                    </Link>
                </div>

                {/* Search bar*/}
                <div className="d-flex flex-grow-1 mx-4 flex-nowrap">
                    <form className="flex-grow-1">
                        <div className="input-group">
                            <input
                                className="form-control"
                                type="search"
                                placeholder="Search"
                                aria-label="Search"
                                value={search}
                                onChange={(e)=> setSearch(e.target.value)}
                            />

                            <button 
                                className="btn btn-outline-light" 
                                type="submit"
                                onClick={()=> navi("/search/"+search)}
                            >
                                <i className="bi bi-search"></i>
                            </button>
                        </div>
                    </form>
                </div>

                {/* Hamburger menu after collapsing */}
                <button
                    className="navbar-toggler border-0 shadow-none"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navigation items */}
                <div className="collapse navbar-collapse flex-grow-0" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center">

                    <li className="nav-item">
                        {user?(
                            <UserMenu user={user}/>
                                
                        ):(
                            <a 
                            className="nav-link active" 
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#loginModal"
                            >
                                Login
                            </a>
                        )}
                    </li>

                    <li className="nav-item">
                        {user?(
                            user.role==="SHOP"?(
                                <Link className="nav-link" to={"/shop-order"}>
                                    Orders
                                </Link>
                            ):(
                                <Link className="nav-link" to={"/order"}>
                                    Orders
                                </Link>
                            )
                        ):(
                            <a 
                            className="nav-link active" 
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#loginModal"
                            >
                                Orders
                            </a>
                        )}
                    </li>

                    <li className="nav-item">
                        <CartButton user={user}/>
                    </li>

                    </ul>
                </div>

            </div>
        </nav>
    )
}

function UserMenu({user}){
    return (

        <div className="dropdown">
            <button
                className="nav-link dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                Hello, {user.firstName}
            </button>

            <ul className="dropdown-menu dropdown-menu-end rounded-0">
                <li>
                    <Link
                        className="dropdown-item"
                        to="/profile"
                    >
                        Profile
                    </Link>
                </li>

                <li>
                    <button
                        className="dropdown-item"
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#logoutModal"
                    >
                        Logout
                    </button>
                </li>
            </ul>
        </div>
    )
}

function CartButton({user}) {
    // console.log(user);
    return(
        user?(
            user.role==="CUSTOMER"?(
                <Link 
                    className="nav-link d-flex align-items-center" 
                    to={user?"/cart":"/"}
                >
                <i className="bi bi-cart fs-4 me-2"></i>
                <span  className="lh-1">
                    Shopping<br/>
                    Cart
                </span>
                </Link>
            ):(
                <Link 
                    className="nav-link d-flex align-items-center" 
                    to={user?"/shop/product-list":"/"}
                >
                <i className="bi bi-file-earmark-text fs-4 me-2"></i>
                <span  className="lh-1">
                    Product<br/>
                    List
                </span>
                </Link>
            )
        ):(
            <button
                type="button"
                className="nav-link d-flex align-items-center"
                data-bs-toggle="modal"
                data-bs-target="#loginModal"
            >
                <i className="bi bi-cart fs-4 me-2"></i>
                <span className="lh-1">
                    Shopping<br />
                    Cart
                </span>
            </button>
        )
    )

}