import dbConnect from "@/utils/dbConnect";
import ProductAnalytics from "@/models/ProductAnalytics";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    await dbConnect();
    // Delete all product analytics data
    await ProductAnalytics.deleteMany({});
    return res.status(200).json({ success: true, message: "All product analytics reset successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || "Error resetting product analytics." });
  }
}
