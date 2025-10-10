import { useState } from "react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HouseFill,
  Globe,
  Map,
  MapFill,
  ImageFill,
  CircleHalf,
  Search,
  ListOl,
  FileEarmarkArrowDownFill,
  CheckSquareFill,
  MenuButtonWideFill,
  List,
  X,
} from "react-bootstrap-icons";

function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItemClass = (path: string) =>
    `nav-link d-flex align-items-center gap-2 px-3 py-2 rounded fs-6 ${
      location.pathname === path
        ? "active fw-semibold shadow-sm bg-primary text-white"
        : "text-dark"
    }`;

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      {/* Header */}
      <header className="bg-dark text-white px-4 py-3 sticky-top shadow-sm d-flex align-items-center justify-content-between">
        <h1 className="fs-5 fw-bold m-0">SS Intern</h1>

        {/* Toggle button for mobile */}
        <button
          className="btn btn-outline-light d-lg-none"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={20} /> : <List size={20} />}
        </button>
      </header>

      {/* Main Container */}
      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <aside
          className="bg-white border-end shadow-sm d-flex flex-column p-3"
          style={{
            width: "240px",
            zIndex: 1050,
            position: "fixed",
            top: 0,
            left: 0,
            height: "100%",
            transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.3s ease-in-out",
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="text-uppercase text-muted small m-0 ps-2">
              Navigation
            </h6>
            <button
              className="btn btn-sm btn-outline-secondary d-lg-none"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={16} />
            </button>
          </div>

          <nav className="nav nav-pills flex-column gap-1">
            <Link to="/" className={navItemClass("/")}>
              <HouseFill size={16} /> Language
            </Link>
            <Link to="/country" className={navItemClass("/country")}>
              <Globe size={16} /> Country
            </Link>
            <Link to="/state" className={navItemClass("/state")}>
              <Map size={16} /> State
            </Link>
            <Link to="/district" className={navItemClass("/district")}>
              <MapFill size={16} /> District
            </Link>
            <Link to="/imageupload" className={navItemClass("/imageupload")}>
              <ImageFill size={16} /> Image Upload
            </Link>
            <Link to="/radiobutton" className={navItemClass("/radiobutton")}>
              <CircleHalf size={16} /> Radio Button
            </Link>
            <Link to="/searching" className={navItemClass("/searching")}>
              <Search size={16} /> Searching
            </Link>
            <Link to="/pagination" className={navItemClass("/pagination")}>
              <ListOl size={16} /> Pagination
            </Link>
            <Link to="/exportcsv" className={navItemClass("/exportcsv")}>
              <FileEarmarkArrowDownFill size={16} /> Export CSV
            </Link>
            <Link to="/checkbox" className={navItemClass("/checkbox")}>
              <CheckSquareFill size={16} /> Check Box
            </Link>
            <Link
              to="/multiselectdropdown"
              className={navItemClass("/multiselectdropdown")}
            >
              <MenuButtonWideFill size={16} /> Multi Select DDL
            </Link>
            <Link
              to="/authentication"
              className={navItemClass("/authentication")}
            >
              <CircleHalf size={16} /> Authentication
            </Link>
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none"
            style={{ zIndex: 1040 }}
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main
          className="flex-grow-1 p-3 bg-light"
          style={{
            marginLeft: "0",
          }}
        >
          <div
            className="card shadow border-0 rounded-3"
            style={{
              marginLeft: "0",
              minHeight: "80vh",
            }}
          >
            <div className="card-body">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;
