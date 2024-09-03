import { connectToDatabase } from "@/lib/db";
import Danger from "@/models/Danger";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await connectToDatabase();

      const {
        city,
        lat,
        lng,
        terrorism,
        meteo,
        health_issues,
        poison,
        natural_disasters,
        political_unrest,
        economic_crisis,
        car_crashes,
        fires,
        carnivors_zones,
        robberies,
        scams,
        over_tourism,
        riskValue,
      } = req.body;

      const danger = new Danger({
        city,
        lat,
        lng,
        terrorism,
        meteo,
        health_issues,
        poison,
        natural_disasters,
        political_unrest,
        economic_crisis,
        car_crashes,
        fires,
        carnivors_zones,
        robberies,
        scams,
        over_tourism,
        riskValue,
      });
      await danger.save();

      res.status(201).json({ message: "Danger submitted", danger });
    } catch (error) {
      console.error("Error saving danger:", error);
      res.status(500).json({ message: "Failed to save danger" });
    }
  } else if (req.method === "GET") {
    // try {
    //   await connectToDatabase();

    //   const dangers = await Danger.find({}).exec();

    //   res.status(200).json(dangers);
    // } catch (error) {
    //   console.error("Error fetching dangers:", error);

    //   res.status(500).json({ message: "Failed to fetch dangers" });
    // }
    try {
      await connectToDatabase();

      const dangers = await Danger.find({});
      if (!dangers || dangers.length === 0) {
        return res.status(200).json({ message: "No data found" });
      }
      return res.status(200).json(dangers);
    } catch (error) {
      return res.status(500).json({ error: "Database query failed" });
    }
  } else if (req.method === "PUT") {
    try {
      await connectToDatabase();

      const {
        _id,
        city,
        lat,
        lng,
        terrorism,
        meteo,
        health_issues,
        poison,
        natural_disasters,
        political_unrest,
        economic_crisis,
        car_crashes,
        fires,
        carnivors_zones,
        robberies,
        scams,
        over_tourism,
        riskValue,
      } = req.body;

      if (!_id) {
        return res.status(400).json({ message: "Danger ID is required" });
      }

      const updatedDanger = await Danger.findByIdAndUpdate(
        _id,
        {
          city,
          lat,
          lng,
          terrorism,
          meteo,
          health_issues,
          poison,
          natural_disasters,
          political_unrest,
          economic_crisis,
          car_crashes,
          fires,
          carnivors_zones,
          robberies,
          scams,
          over_tourism,
          riskValue,
        },
        { new: true }
      ).exec();

      if (!updatedDanger) {
        return res.status(404).json({ message: "Danger not found" });
      }
      console.log(updatedDanger);

      res.status(200).json(updatedDanger);
    } catch (error) {
      console.error("Error updating danger:", error);
      res.status(500).json({ message: "Failed to update danger" });
    }
  } else if (req.method === "DELETE") {
    try {
      await connectToDatabase();

      const { dangerId } = req.query;

      if (!dangerId) {
        return res.status(400).json({ message: "Danger ID is required" });
      }

      const deletedReport = await Danger.findByIdAndDelete(dangerId).exec();

      if (!deletedReport) {
        return res.status(404).json({ message: "Danger not found" });
      }

      res.status(200).json({ message: "Danger deleted successfully" });
    } catch (error) {
      console.error("Error deleting danger:", error);
      res.status(500).json({ message: "Failed to delete danger" });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
