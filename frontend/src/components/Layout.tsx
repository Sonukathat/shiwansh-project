import type { ReactNode } from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HouseFill, Globe, Map, MapFill, ImageFill, CircleHalf, Search, ListOl, FileEarmarkArrowDownFill, CheckSquareFill, MenuButtonWideFill, List } from "react-bootstrap-icons";

function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItemClass = (path: string) => `nav-link d-flex align-items-center gap-2 px-3 py-2 rounded fs-6 ${ location.pathname === path ? "active fw-semibold shadow-sm" : "text-dark" }`;

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <header className="bg-dark text-white px-3 py-2 sticky-top shadow-sm d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-sm btn-outline-light d-md-none" aria-label="Toggle navigation" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <List size={18} />
          </button>
          <h1 className="fs-5 fw-bold m-0">SS Intern</h1>
        </div>
        <div className="d-none d-md-flex align-items-center text-muted small">v1.0</div>
      </header>

      <div className="d-flex flex-grow-1 position-relative">
        {/* Sidebar for md+ screens */}
        <aside className="bg-white border-end d-none d-md-flex flex-column p-3 shadow-sm" style={{ width: "240px" }}>
          <h6 className="text-uppercase text-muted mb-3 ps-2 small">Navigation</h6>
          <nav className="nav nav-pills flex-column gap-1">
            <Link to="/" className={navItemClass("/")}><HouseFill size={16} />Language</Link>
            <Link to="/country" className={navItemClass("/country")}><Globe size={16} />Country</Link>
            <Link to="/state" className={navItemClass("/state")}><Map size={16} />State</Link>
            <Link to="/district" className={navItemClass("/district")}><MapFill size={16} />District</Link>
            <Link to="/imageupload" className={navItemClass("/imageupload")}><ImageFill size={16} />Image Upload</Link>
            <Link to="/radiobutton" className={navItemClass("/radiobutton")}><CircleHalf size={16} />Radio Button</Link>
            <Link to="/searching" className={navItemClass("/searching")}><Search size={16} />Searching</Link>
            <Link to="/pagination" className={navItemClass("/pagination")}><ListOl size={16} />Pagination</Link>
            <Link to="/exportcsv" className={navItemClass("/exportcsv")}><FileEarmarkArrowDownFill size={16} />Export CSV</Link>
            <Link to="/checkbox" className={navItemClass("/checkbox")}><CheckSquareFill size={16} />Check Box</Link>
            <Link to="/multiselectdropdown" className={navItemClass("/multiselectdropdown")}><MenuButtonWideFill size={16} />Multi Select DDL</Link>
          </nav>
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="d-md-none position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 1050 }}>
            <div className="bg-dark bg-opacity-50 w-100 h-100" onClick={() => setSidebarOpen(false)} />
            <aside className="bg-white border-end d-flex flex-column p-3 shadow-sm" style={{ width: "260px", position: "absolute", top: 0, left: 0, bottom: 0 }}>
              <h6 className="text-uppercase text-muted mb-3 ps-2 small">Navigation</h6>
              <nav className="nav nav-pills flex-column gap-1">
                <Link to="/" className={navItemClass("/")} onClick={() => setSidebarOpen(false)}><HouseFill size={16} />Language</Link>
                <Link to="/country" className={navItemClass("/country")} onClick={() => setSidebarOpen(false)}><Globe size={16} />Country</Link>
                <Link to="/state" className={navItemClass("/state")} onClick={() => setSidebarOpen(false)}><Map size={16} />State</Link>
                <Link to="/district" className={navItemClass("/district")} onClick={() => setSidebarOpen(false)}><MapFill size={16} />District</Link>
                <Link to="/imageupload" className={navItemClass("/imageupload")} onClick={() => setSidebarOpen(false)}><ImageFill size={16} />Image Upload</Link>
                <Link to="/radiobutton" className={navItemClass("/radiobutton")} onClick={() => setSidebarOpen(false)}><CircleHalf size={16} />Radio Button</Link>
                <Link to="/searching" className={navItemClass("/searching")} onClick={() => setSidebarOpen(false)}><Search size={16} />Searching</Link>
                <Link to="/pagination" className={navItemClass("/pagination")} onClick={() => setSidebarOpen(false)}><ListOl size={16} />Pagination</Link>
                <Link to="/exportcsv" className={navItemClass("/exportcsv")} onClick={() => setSidebarOpen(false)}><FileEarmarkArrowDownFill size={16} />Export CSV</Link>
                <Link to="/checkbox" className={navItemClass("/checkbox")} onClick={() => setSidebarOpen(false)}><CheckSquareFill size={16} />Check Box</Link>
                <Link to="/multiselectdropdown" className={navItemClass("/multiselectdropdown")} onClick={() => setSidebarOpen(false)}><MenuButtonWideFill size={16} />Multi Select DDL</Link>
              </nav>
            </aside>
          </div>
        )}

        <main className="flex-grow-1 p-3 p-md-4 bg-light">
          <div className="card shadow border-0 rounded-3">
            <div className="card-body">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;