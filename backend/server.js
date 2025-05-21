const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const connectionString =
  "mongodb+srv://sakshimane1103:R98EjNHrhU9vW3lV@cluster0.tg9hfbi.mongodb.net/itidata?retryWrites=true&w=majority&tlsAllowInvalidCertificates=true";

mongoose
  .connect(connectionString)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Materials Schema
const materialSchema = new mongoose.Schema({
  srNo: Number,
  materialName: String,
  binCardNumber: String,
  quantity: Number,
  unit: String,
  description: String,
});
const Material = mongoose.model("Material", materialSchema, "materials");

// Deadstock Schema
const deadstockSchema = new mongoose.Schema({
  srNo: Number,
  descriptionOfArticle: String,
  authorityForPurchaseAndDate: String,
  numberOrQuantity: Number,
  value: Number,
  finalDisposalNoQuantityAndNature: String,
  finalDisposalAuthorityOrVoucher: String,
  amountRealisedAndCreditDate: String,
  amountWritten: Number,
  balanceStockNumber: Number,
  balanceStockValue: Number,
  initialsHeadOffice: String,
  remarks: String,
});
const Deadstock = mongoose.model("Deadstock", deadstockSchema, "deadstock");

// BinCard Schema
const binCardSchema = new mongoose.Schema({
  materialName: String,
  staticFields: {
    description: String,
    codeNo: String,
    sectionIndex: String,
    unitOfMeasure: String,
    binNo: String,
    maximum: String,
    minimum: String,
  },
  binCardData: [
    {
      date: String,
      authority: String,
      receiptQty: String,
      issueQty: String,
      balanceQty: String,
      storekeeperInitials: String,
    },
  ],
});
const BinCard = mongoose.model("BinCard", binCardSchema, "bincards");

// ---------------- API Routes ---------------- //

// Materials
app.get("/materials", async (req, res) => {
  try {
    const materials = await Material.find();
    res.json(materials);
  } catch (error) {
    res.status(500).send("Error fetching materials");
  }
});

app.delete("/materials/:id", async (req, res) => {
  try {
    await Material.findByIdAndDelete(req.params.id);
    res.status(200).send("Material deleted successfully");
  } catch (error) {
    res.status(500).send("Error deleting material");
  }
});

app.put("/materials/:id", async (req, res) => {
  try {
    const { materialName } = req.body;
    const updatedMaterial = await Material.findByIdAndUpdate(
      req.params.id,
      { materialName },
      { new: true }
    );
    res.status(200).json(updatedMaterial);
  } catch (error) {
    res.status(500).send("Error updating material");
  }
});

// Deadstock
app.post("/api/saveDeadstock", async (req, res) => {
  try {
    const data = req.body.rows;
    const newEntries = await Deadstock.insertMany(data);
    res
      .status(200)
      .json({ message: "Data saved successfully", data: newEntries });
  } catch (error) {
    res.status(500).json({ message: "Error saving data", error });
  }
});

app.get("/api/getDeadstock", async (req, res) => {
  try {
    const entries = await Deadstock.find();
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error });
  }
});

app.delete("/api/deleteDeadstock/:id", async (req, res) => {
  try {
    const deletedEntry = await Deadstock.findByIdAndDelete(req.params.id);
    if (!deletedEntry) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.status(200).json({ message: "Entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting entry", error });
  }
});

// Bin Card: Save or Update + Update Material Description
app.post("/api/saveBinCard", async (req, res) => {
  try {
    const { materialName, staticFields, binCardData } = req.body;

    // Update or create BinCard
    const existing = await BinCard.findOne({ materialName });

    if (existing) {
      existing.staticFields = staticFields;
      existing.binCardData = binCardData;
      await existing.save();
    } else {
      const newEntry = new BinCard({ materialName, staticFields, binCardData });
      await newEntry.save();
    }

    // Update description field in the Material collection
    const material = await Material.findOne({ materialName });
    if (material) {
      material.description = staticFields.description;
      await material.save();
    }

    res
      .status(200)
      .json({ message: "Bin Card and Material updated successfully" });
  } catch (err) {
    console.error("Error saving bin card:", err);
    res.status(500).json({ message: "Error saving bin card", err });
  }
});

// Bin Card: Fetch
app.get("/api/getBinCard/:materialName", async (req, res) => {
  try {
    const binCard = await BinCard.findOne({
      materialName: req.params.materialName,
    });
    if (!binCard) return res.status(404).json({ message: "Not found" });
    res.status(200).json(binCard);
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
});

// ---------------- Start Server ---------------- //

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
