import React, { useState, useEffect } from "react";
import "./DSR.css";

function DeadStockRegister() {
  const [rows, setRows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [previousEntries, setPreviousEntries] = useState([]);
  const [rowToDelete, setRowToDelete] = useState("");

  useEffect(() => {
    const storedRows = localStorage.getItem("deadStockRows");
    if (storedRows) {
      setRows(JSON.parse(storedRows));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("deadStockRows", JSON.stringify(rows));
  }, [rows]);

  const fetchPreviousEntries = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/getDeadstock");
      if (!response.ok) throw new Error("Failed to fetch previous entries.");
      const data = await response.json();
      setPreviousEntries(data);
    } catch (error) {
      console.error("Error fetching previous entries:", error);
      alert("Error fetching previous entries. Please try again later.");
    }
  };

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedRows = [...rows];
    updatedRows[index][name] = value;
    setRows(updatedRows);
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        serialNo: "",
        descriptionOfArticle: "",
        authorityForPurchaseAndDate: "",
        numberOrQuantity: "",
        value: "",
        finalDisposalNoQuantityAndNature: "",
        finalDisposalAuthorityOrVoucher: "",
        amountRealisedAndCreditDate: "",
        amountWritten: "",
        balanceStockNumber: "",
        balanceStockValue: "",
        initialsHeadOffice: "",
        remarks: "",
      },
    ]);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    const csvHeaders = [
      [
        "Sr. No.",
        "Description of Article",
        "Authority for Purchase and Date",
        "Number or Quantity",
        "Value",
        "Final Disposal No./Quantity and Nature",
        "Final Disposal Authority or Voucher",
        "Amount Realised and Date of Credit",
        "Amount Written Off",
        "Balance Stock Number",
        "Balance Stock Value",
        "Initials of Head of Office",
        "Remarks",
      ],
    ];

    const csvRows = rows.map((row) =>
      Object.values(row)
        .map((val) => `"${val}"`)
        .join(",")
    );

    const csvContent = [
      csvHeaders.map((headerRow) => headerRow.join(",")).join("\n"),
      csvRows.join("\n"),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "DSR.csv";
    link.click();
  };

  const saveToDatabase = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/saveDeadstock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows }),
      });

      if (!response.ok) throw new Error("Failed to save data to the database.");
      alert("Data successfully saved to the database!");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error saving data. Please try again later.");
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
    if (!showModal) fetchPreviousEntries();
  };

  // DELETE entry from database by ID
  const deletePreviousEntry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/deleteDeadstock/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok)
        throw new Error("Failed to delete entry from database.");

      alert("Entry deleted successfully.");
      fetchPreviousEntries();
    } catch (error) {
      console.error("Error deleting entry:", error);
      alert("Error deleting entry. Please try again later.");
    }
  };

  return (
    <div className="dsr-container">
      <h2 className="dsr-heading">Dead Stock Register</h2>
      <div className="dsr-form-container">
        <table className="dsr-table">
          <div id="print-section">
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Description of Article</th>
                <th>Authority for Purchase and Date</th>
                <th>Number or Quantity</th>
                <th>Value</th>
                <th>No. or Quantity and Nature</th>
                <th>Authority or Voucher</th>
                <th>Amount Realised and Date of Credit</th>
                <th>Amount Written</th>
                <th>Balance Stock Number</th>
                <th>Balance Stock Value</th>
                <th>Initials of Head of Office</th>
                <th>Remarks</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  {Object.keys(row).map((key) => (
                    <td key={key}>
                      <input
                        className="dsr-input"
                        type={
                          key.toLowerCase().includes("date")
                            ? "date"
                            : key.toLowerCase().includes("number") ||
                              key.toLowerCase().includes("value") ||
                              key.toLowerCase().includes("quantity") ||
                              key.toLowerCase().includes("amount")
                            ? "number"
                            : "text"
                        }
                        name={key}
                        value={row[key]}
                        onChange={(e) => handleChange(index, e)}
                        required
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </div>
        </table>
      </div>

      <div className="dsr-button-container">
        <button className="dsr-btn add" onClick={addRow}>
          Add Row
        </button>
        <button className="dsr-btn print" onClick={handlePrint}>
          Print Form
        </button>
        <button className="dsr-btn save" onClick={handleSave}>
          Save as CSV
        </button>
        <button className="dsr-btn previous" onClick={toggleModal}>
          Show Previous Entries
        </button>
        <button className="dsr-btn save" onClick={saveToDatabase}>
          Save to Database
        </button>

        {/* Dropdown for deleting a row */}
        <div className="dsr-delete-row-container">
          <label htmlFor="delete-row-select">Select Row to Delete:</label>
          <select
            id="delete-row-select"
            className="dsr-delete-dropdown"
            value={rowToDelete}
            onChange={(e) => setRowToDelete(e.target.value)}
          >
            <option value="">-- Select Row --</option>
            {rows.map((row, index) => (
              <option key={index} value={index}>
                {row.serialNo || `Row ${index + 1}`}
              </option>
            ))}
          </select>
          <button
            className="dsr-btn delete"
            onClick={() => {
              if (rowToDelete === "") {
                alert("Please select a row to delete.");
                return;
              }
              if (
                window.confirm(
                  `Are you sure you want to delete row ${
                    Number(rowToDelete) + 1
                  }?`
                )
              ) {
                const updatedRows = rows.filter(
                  (_, idx) => idx !== Number(rowToDelete)
                );
                setRows(updatedRows);
                setRowToDelete("");
              }
            }}
          >
            Delete Selected Row
          </button>
        </div>
      </div>

      {showModal && (
        <div className="dsr-modal">
          <div className="dsr-modal-content">
            <h3>Previous Entries</h3>
            <table className="dsr-table">
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>Description of Article</th>
                  <th>Authority for Purchase and Date</th>
                  <th>Number or Quantity</th>
                  <th>Value</th>
                  <th>No. or Quantity and Nature</th>
                  <th>Authority or Voucher</th>
                  <th>Amount Realised and Date of Credit</th>
                  <th>Amount Written</th>
                  <th>Balance Stock Number</th>
                  <th>Balance Stock Value</th>
                  <th>Initials of Head of Office</th>
                  <th>Remarks</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {previousEntries.map((row, index) => (
                  <tr key={row._id || index}>
                    <td>{index + 1}</td>
                    <td>{row.descriptionOfArticle}</td>
                    <td>{row.authorityForPurchaseAndDate}</td>
                    <td>{row.numberOrQuantity}</td>
                    <td>{row.value}</td>
                    <td>{row.finalDisposalNoQuantityAndNature}</td>
                    <td>{row.finalDisposalAuthorityOrVoucher}</td>
                    <td>{row.amountRealisedAndCreditDate}</td>
                    <td>{row.amountWritten}</td>
                    <td>{row.balanceStockNumber}</td>
                    <td>{row.balanceStockValue}</td>
                    <td>{row.initialsHeadOffice}</td>
                    <td>{row.remarks}</td>
                    <td>
                      <button
                        className="dsr-btn delete"
                        onClick={() => deletePreviousEntry(row._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="dsr-btn close" onClick={toggleModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeadStockRegister;
