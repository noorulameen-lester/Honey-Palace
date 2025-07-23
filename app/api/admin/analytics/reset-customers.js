import dbConnect from "@/utils/dbConnect";
import CustomerAnalytics from "@/models/CustomerAnalytics";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    await dbConnect();
    // Delete all customer analytics data
    await CustomerAnalytics.deleteMany({});
    return res.status(200).json({ success: true, message: "All customer analytics reset successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || "Error resetting customer analytics." });
  }
}
