import React, { useState } from "react";
import "./GIRForm.css";

const GIRForm = () => {
  // Initializing dynamic rows for the Goods Inward Register
  const [rows, setRows] = useState([
    {
      srNo: "",
      drv: "",
      supplier: "",
      challan: "",
      po: "",
      materialDescription: "",
      quantity: "",
      bin: "",
      price: "",
      remarks: "",
    },
  ]);

  // Handle changes in the input fields for the table
  const handleRowChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  // Add a new row to the table
  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        srNo: "",
        drv: "",
        supplier: "",
        challan: "",
        po: "",
        materialDescription: "",
        quantity: "",
        bin: "",
        price: "",
        remarks: "",
      },
    ]);
  };

  // Handle form submission (display data in console)
  const handleSubmit = () => {
    console.log(
      "Industrial Training Institute Goods Inward Register Data:",
      rows
    );
    alert("Form submitted! Check the console for details.");
  };

  const handleSave = () => {
    const csvHeaders = [
      [
        "Sr. No.",
        "DRV No. & Date",
        "Name & Address of Supplier",
        "No. and Date of Delivery Challan",
        "No. and Date of Purchase Order",
        "Description of Material",
        "Quantity",
        "No. of Bin",
        "Price (Rs.)",
        "Remarks",
      ],
    ];

    // Flatten headers and combine with data rows
    const csvData = [
      csvHeaders.map((row) => row.join(",")).join("\n"), // Join headers
      ...rows.map((row) =>
        Object.values(row)
          .map((value) => `"${value}"`) // Wrap each value in quotes
          .join(",")
      ), // Join rows
    ].join("\n");

    // Create a Blob object with the CSV data
    const blob = new Blob([csvData], { type: "text/csv" });

    // Create a link element to download the file
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "goods_inward_register.csv"; // File name
    link.click();
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Goods Inward Register</h2>
      <div className="form-body">
        <table className="form-table">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>DRV No. & Date</th>
              <th>Name & Address of Supplier</th>
              <th>No. and Date of Delivery Challan</th>
              <th>No. and Date of Purchase Order</th>
              <th>Description of Material</th>
              <th>Quantity</th>
              <th>No. of Bin</th>
              <th>Price (Rs.)</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                {Object.keys(row).map((field) => (
                  <td key={field}>
                    <input
                      type="text"
                      value={row[field]}
                      onChange={(e) =>
                        handleRowChange(index, field, e.target.value)
                      }
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="form-buttons">
          <button className="add-btn" onClick={handleAddRow}>
            Add Row
          </button>
          <button className="submit-btn" onClick={handleSubmit}>
            Submit
          </button>
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default GIRForm;
