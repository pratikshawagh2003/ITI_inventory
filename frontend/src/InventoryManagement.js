import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "./InventoryManagement.css";
import itiImage from "./assets/image.png";
import DSR from "./DSR";
import DRV from "./DRV";
import GIR from "./GIR";
import MISC from "./MISC";

function InventoryManagement() {
  const [materials, setMaterials] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [updatedMaterial, setUpdatedMaterial] = useState({
    srNo: "",
    materialName: "",
    binCardNumber: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/materials")
      .then((response) => setMaterials(response.data))
      .catch((error) => console.error("Error fetching materials:", error));
  }, []);

  const handleTabClick = (tab) => setActiveTab(tab);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredMaterials = materials.filter(
    (material) =>
      material.materialName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.binCardNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditClick = (material) => {
    setEditingMaterial(material._id);
    setUpdatedMaterial({
      srNo: material.srNo,
      materialName: material.materialName,
      binCardNumber: material.binCardNumber,
    });
  };

  const handleUpdateChange = (field, value) => {
    setUpdatedMaterial((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdateSubmit = () => {
    axios
      .put(
        `http://localhost:5000/materials/${editingMaterial}`,
        updatedMaterial
      )
      .then((response) => {
        setMaterials((prev) =>
          prev.map((material) =>
            material._id === editingMaterial ? response.data : material
          )
        );
        setEditingMaterial(null);
      })
      .catch((error) => console.error("Error updating material:", error));
  };

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">Government ITI Inventory</h1>
        <nav className="sticky-nav">
          <ul className="nav-items">
            <li
              className={activeTab === "" ? "active" : ""}
              onClick={() => handleTabClick("")}
            >
              Home
            </li>
            <li
              className={activeTab === "materialHistory" ? "active" : ""}
              onClick={() => handleTabClick("materialHistory")}
            >
              Bin Card
            </li>
            <li
              className={activeTab === "dsr" ? "active" : ""}
              onClick={() => handleTabClick("dsr")}
            >
              DSR
            </li>
            <li
              className={activeTab === "drv" ? "active" : ""}
              onClick={() => handleTabClick("drv")}
            >
              DRV
            </li>
            <li
              className={activeTab === "gir" ? "active" : ""}
              onClick={() => handleTabClick("gir")}
            >
              GIR
            </li>
            <li
              className={activeTab === "misc" ? "active" : ""}
              onClick={() => handleTabClick("misc")}
            >
              MISC
            </li>
          </ul>
        </nav>
      </header>

      <main className="main">
        {!activeTab && (
          <div className="image-container">
            <img src={itiImage} alt="ITI" className="iti-image" />
            <div className="welcome-text">
              Welcome To Government ITI Inventory Management
            </div>
          </div>
        )}

        {activeTab === "materialHistory" && (
          <div className="card">
            <h2 className="section-title">Material History</h2>
            <input
              type="text"
              className="search-bar"
              placeholder="Search by material name or bin card number"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <table className="materials-table">
              <thead>
                <tr>
                  <th>Sr. No</th>
                  <th>Material Name</th>
                  <th>Bin Card Number</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaterials.map((material) => (
                  <tr key={material._id}>
                    {editingMaterial === material._id ? (
                      <>
                        <td>
                          <input
                            type="text"
                            value={updatedMaterial.srNo}
                            onChange={(e) =>
                              handleUpdateChange("srNo", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={updatedMaterial.materialName}
                            onChange={(e) =>
                              handleUpdateChange("materialName", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={updatedMaterial.binCardNumber}
                            onChange={(e) =>
                              handleUpdateChange(
                                "binCardNumber",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td>
                          <button
                            className="update-button"
                            onClick={handleUpdateSubmit}
                          >
                            Save
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{material.srNo}</td>
                        <td>
                          <Link
                            to={`/bin-card/${material._id}`}
                            state={{ material }}
                          >
                            {material.materialName}
                          </Link>
                        </td>
                        <td>{material.binCardNumber}</td>
                        <td>
                          <button
                            className="update-button"
                            onClick={() => handleEditClick(material)}
                          >
                            Update
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "dsr" && <DSR />}
        {activeTab === "drv" && <DRV />}
        {activeTab === "gir" && <GIR />}
        {activeTab === "misc" && <MISC />}
      </main>
    </div>
  );
}

export default InventoryManagement;
