import { Link } from "react-router-dom";

function NavbarSec(){
    return(
        <nav className="navbar navbar-expand-sm bg-light border-bottom py-0">
            <div className="container-fluid">

                {/* Hamburger button */}
                <button
                    className="navbar-toggler border-0 shadow-none"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#secondaryNavbar"
                    aria-controls="secondaryNavbar"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Secondary navbar items */}
                <div className="collapse navbar-collapse" id="secondaryNavbar">
                    <ul className="navbar-nav mx-auto gap-5">
                        
                        {/* All equipments */}
                        <li className="nav-item">
                            <a className="nav-link active" href="#">
                                All
                            </a>
                        </li>

                        {/* Men's snow equipments */}
                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Men
                            </a>

                            <ul className="dropdown-menu rounded-0">
                                <li><Link  className="dropdown-item" to="/men/top">Top</Link ></li>
                                <li><Link  className="dropdown-item" to="/men/bottom">Bottom</Link ></li>
                                <li><Link  className="dropdown-item" to="/men/ski">Ski</Link ></li>
                                <li><Link  className="dropdown-item" to="/men/snowboard">Snowboard</Link ></li>
                            </ul>
                        </li>

                        {/* Women's snow equipments */}
                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Women
                            </a>

                            <ul className="dropdown-menu rounded-0">
                                <li><a className="dropdown-item" href="#">Top</a></li>
                                <li><a className="dropdown-item" href="#">Bottom</a></li>
                                <li><a className="dropdown-item" href="#">Ski</a></li>
                                <li><a className="dropdown-item" href="#">Snowboard</a></li>
                            </ul>
                        </li>

                        {/* Accessories like helmet and gloves */}
                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Accessories
                            </a>

                            <ul className="dropdown-menu rounded-0">
                                <li><a className="dropdown-item" href="#">Gloves</a></li>
                                <li><a className="dropdown-item" href="#">Helmet</a></li>
                                <li><a className="dropdown-item" href="#">Ski stocks</a></li>
                                <li><a className="dropdown-item" href="#">Googles</a></li>
                                <li><a className="dropdown-item" href="#">Mask</a></li>
                            </ul>
                        </li>

                        {/* Other wares */}
                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Others
                            </a>

                            <ul className="dropdown-menu rounded-0">
                                <li><a className="dropdown-item" href="#">Sticker</a></li>
                                <li><a className="dropdown-item" href="#">Griptape</a></li>
                                <li><a className="dropdown-item" href="#">Knit cap</a></li>
                            </ul>
                        </li>

                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default NavbarSec