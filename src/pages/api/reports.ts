import { connectToDatabase } from "../../lib/db";
import Report from "../../models/Report";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await connectToDatabase();

      const {
        title,
        description,
        location,
        username,
        riskLevel,
        date,
        status,
      } = req.body;

      if (!username) {
        return res.status(400).json({ message: "Username is required" });
      }

      const validStatus = status === "resolved" ? "resolved" : "open";
      const validRisk = ["High", "Medium", "Low"].includes(riskLevel)
        ? riskLevel
        : "Undefined";

      const report = new Report({
        title,
        description,
        location,
        username,
        status: validStatus,
        riskLevel: validRisk,
        date: new Date(date),
        createdAt: new Date(),
      });
      await report.save();

      res.status(201).json({ message: "Report submitted", report });
    } catch (error) {
      console.error("Error saving report:", error);
      res.status(500).json({ message: "Failed to save report" });
    }
  } else if (req.method === "GET") {
    try {
      await connectToDatabase();

      const reports = await Report.find({}).exec();

      res.status(200).json(reports);
    } catch (error) {
      console.error("Error fetching reports:", error);

      res.status(500).json({ message: "Failed to fetch reports" });
    }
  } else if (req.method === "PUT") {
    try {
      await connectToDatabase();

      const {
        _id,
        username,
        title,
        description,
        location,
        riskLevel,
        date,
        status,
      } = req.body;

      if (!_id) {
        return res.status(400).json({ message: "Report ID is required" });
      }

      const validStatus = status === "Resolved" ? "Resolved" : "Open";
      const validRisk = ["High", "Medium", "Low"].includes(riskLevel) ? riskLevel : "Undefined";

      const updatedReport = await Report.findByIdAndUpdate(
        _id,
        {
          title,
          username,
          description,
          location,
          riskLevel: validRisk,
          status: validStatus,
          date: new Date(date),
        },
        { new: true }
      ).exec();

      if (!updatedReport) {
        return res.status(404).json({ message: "Report not found" });
      }
      console.log(updatedReport);

      res.status(200).json(updatedReport);
    } catch (error) {
      console.error("Error updating report:", error);
      res.status(500).json({ message: "Failed to update report" });
    }
  } else if (req.method === "DELETE") {
    try {
      await connectToDatabase();

      const { reportId } = req.query;

      if (!reportId) {
        return res.status(400).json({ message: "Report ID is required" });
      }

      const deletedReport = await Report.findByIdAndDelete(reportId).exec();

      if (!deletedReport) {
        return res.status(404).json({ message: "Report not found" });
      }

      res.status(200).json({ message: "Report deleted successfully" });
    } catch (error) {
      console.error("Error deleting report:", error);
      res.status(500).json({ message: "Failed to delete report" });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
