import React, { useState } from "react";
import { saveAs } from "file-saver";
import './MISC.css';

const MiscTable = () => {
  const [rows, setRows] = useState([
    {
      srNo: "",
      drvNo: "",
      supplierName: "",
      deliveryChallan: "",
      purchaseOrder: "",
      materialDescription: "",
      receivedQuantity: "",
      rateEach: "",
      taxTotal: "",
      totalCost: "",
      instructorName: "",
      issueQuantity: "",
      balanceQuantity: "",
      agvSignature: "",
      storeOfficerSignature: "",
      remarks: "",
    },
  ]);

  const handleRowChange = (rowIndex, field, value) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex][field] = value;
    setRows(updatedRows);
  };

  const deleteRow = (index) => {
    const updatedRows = rows.filter((_, rowIndex) => rowIndex !== index);
    setRows(updatedRows);
  };

  const saveToCSV = () => {
    const headers = [
      "Sr. No.",
      "DRV No.",
      "Name and Address of the Supplier",
      "No. & Date of Delivery Challan",
      "No. & Date of Purchase Order",
      "Description of Material",
      "Received Quantity",
      "Rate Each",
      "Tax & Other",
      "Total Cost",
      "Name of Instructor / Indent No. & Date",
      "Issue Quantity",
      "Balance Quantity",
      "Signature of AGV/SV",
      "Signature of Store Officer",
      "Remarks",
    ];

    const csvRows = [
      headers.join(","), // Header row
      ...rows.map((row) => Object.values(row).join(",")), // Data rows
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "miscellaneous_stock_register.csv");
  };

  return (
    <div>
      
      <h2 style={{ textAlign: 'center' }}>Miscellaneous Stock Register</h2>

      <table className="form-table">
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>DRV No.</th>
            <th>Name and Address of the Supplier</th>
            <th>No. & Date of Delivery Challan</th>
            <th>No. & Date of Purchase Order</th>
            <th>Description of Material</th>
            <th>Received Quantity</th>
            <th>Rate Each</th>
            <th>Tax & Other</th>
            <th>Total Cost</th>
            <th>Name of Instructor / Indent No. & Date</th>
            <th>Issue Quantity</th>
            <th>Balance Quantity</th>
            <th>Signature of AGV/SV</th>
            <th>Signature of Store Officer</th>
            <th>Remarks</th>
            <th>Actions</th>
          </tr>
          <tr>
            {Array.from({ length: 16 }, (_, i) => (
              <th key={i}>{i + 1}</th>
            ))}
            <th></th>
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
                    onChange={(e) => handleRowChange(index, field, e.target.value)}
                  />
                </td>
              ))}
              <td>
                <button onClick={() => deleteRow(index)} className="remove-btn">
                  Delete
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan="17" style={{ textAlign: "center" }}>
              <button
                onClick={() =>
                  setRows([
                    ...rows,
                    {
                      srNo: "",
                      drvNo: "",
                      supplierName: "",
                      deliveryChallan: "",
                      purchaseOrder: "",
                      materialDescription: "",
                      receivedQuantity: "",
                      rateEach: "",
                      taxTotal: "",
                      totalCost: "",
                      instructorName: "",
                      issueQuantity: "",
                      balanceQuantity: "",
                      agvSignature: "",
                      storeOfficerSignature: "",
                      remarks: "",
                    },
                  ])
                }
                className="add-btn"
              >
                Add Row
              </button>
              <button onClick={saveToCSV} className="submit-btn">
                Save
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MiscTable;