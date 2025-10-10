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
  List
} from "react-bootstrap-icons";
import { useState, useEffect } from "react";

function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 992);

  // Update isDesktop on window resize
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItemClass = (path: string) =>
    `nav-link d-flex align-items-center gap-2 px-3 py-2 rounded fs-6 ${location.pathname === path ? "active fw-semibold shadow-sm" : "text-dark"
    }`;

  // Function to handle link click
  const handleLinkClick = () => {
    if (!isDesktop) setSidebarOpen(false); // close sidebar on mobile
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      {/* Header */}
      <header className="bg-dark text-white px-4 py-3 sticky-top shadow-sm d-flex align-items-center justify-content-between">
        <h1 className="fs-5 fw-bold m-0">SS Intern</h1>
        {/* Mobile toggle button */}
        {!isDesktop && (
          <button
            className="btn btn-outline-light"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <List size={20} />
          </button>
        )}
      </header>

      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <aside
          className={`bg-white border-end d-flex flex-column p-3 shadow-sm position-fixed top-0 start-0 h-100 overflow-auto ${sidebarOpen || isDesktop ? "d-flex" : "d-none"
            }`}
          style={{ width: "240px", zIndex: 1050 }}
        >
          <h6 className="text-uppercase text-muted mb-3 ps-2 small">Navigation</h6>
          <nav className="nav nav-pills flex-column gap-1">
            <Link to="/" className={navItemClass("/")} onClick={handleLinkClick}>
              <HouseFill size={16} /> Language
            </Link>
            <Link to="/country" className={navItemClass("/country")} onClick={handleLinkClick}>
              <Globe size={16} /> Country
            </Link>
            <Link to="/state" className={navItemClass("/state")} onClick={handleLinkClick}>
              <Map size={16} /> State
            </Link>
            <Link to="/district" className={navItemClass("/district")} onClick={handleLinkClick}>
              <MapFill size={16} /> District
            </Link>
            <Link to="/imageupload" className={navItemClass("/imageupload")} onClick={handleLinkClick}>
              <ImageFill size={16} /> Image Upload
            </Link>
            <Link to="/radiobutton" className={navItemClass("/radiobutton")} onClick={handleLinkClick}>
              <CircleHalf size={16} /> Radio Button
            </Link>
            <Link to="/searching" className={navItemClass("/searching")} onClick={handleLinkClick}>
              <Search size={16} /> Searching
            </Link>
            <Link to="/pagination" className={navItemClass("/pagination")} onClick={handleLinkClick}>
              <ListOl size={16} /> Pagination
            </Link>
            <Link to="/exportcsv" className={navItemClass("/exportcsv")} onClick={handleLinkClick}>
              <FileEarmarkArrowDownFill size={16} /> Export CSV
            </Link>
            <Link to="/checkbox" className={navItemClass("/checkbox")} onClick={handleLinkClick}>
              <CheckSquareFill size={16} /> Check Box
            </Link>
            <Link to="/multiselectdropdown" className={navItemClass("/multiselectdropdown")} onClick={handleLinkClick}>
              <MenuButtonWideFill size={16} /> Multi Select DDL
            </Link>
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {!isDesktop && sidebarOpen && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-25"
            style={{ zIndex: 1040 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main
          className="flex-grow-1 bg-light"
          style={{ marginLeft: isDesktop ? "240px" : "0" }}
        >
          <div className="card shadow border-0 rounded-3">
            <div className="card-body">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;
