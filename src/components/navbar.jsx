function Navbar(){
    return(
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
            <div className="container-fluid px-4 flex-nowrap text-nowrap">

                {/* Logo / Brand */}
                <div className="d-flex align-items-center">
                    <a className="navbar-brand" href="#">
                        DemoShop
                    </a>
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
                            />

                            <button className="btn btn-outline-light" type="submit">
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
                        <a className="nav-link active" href="#">
                        Sign in
                        </a>
                    </li>

                    <li className="nav-item">
                        <a className="nav-link" href="#">
                        Orders
                        </a>
                    </li>

                    <li className="nav-item">
                        <a className="nav-link d-flex align-items-center" href="#">
                        <i className="bi bi-cart fs-4 me-2"></i>
                        <span  className="lh-1">
                            Shopping<br/>
                            Basket
                        </span>
                        </a>
                    </li>

                    </ul>
                </div>

            </div>
        </nav>
    )
}

export default Navbar