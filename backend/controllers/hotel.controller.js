import Hotel from "../models/Hotel.js";
import User from "../models/User.js";

export const registerHotel = async (req, res) => {
  try {
    const { name, address, contact, city } = req.body;

    if (!name || !address || !contact || !city) {
      return res.json({
        success: false,
        message: "All fields are required",
      });
    }

    const owner = req.user._id;
    // Check if User already registered
    const hotel = await Hotel.findOne({ owner });
    if (hotel) {
      return res
        .json({ success: false, message: "Your Hotel Is Already Registered" });
    }

    await Hotel.create({ name, address, contact, city, owner });
    await User.findByIdAndUpdate(owner, { role: "hotelOwner" });
    res
      .json({ success: true, message: "Hotel Registered Successfully" });
  } catch (error) {
    console.error("Hotel Registration Error:", error);
    res.json({ success: false, message: "Internal server error" });
  }
};
