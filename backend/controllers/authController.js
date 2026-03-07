const User = require("../models/User");

exports.syncUser = async (req, res) => {
  const { clerkId, email, name } = req.body;

  try {
    let user = await User.findOne({ clerkId });

    if (!user) {
      user = await User.create({
        clerkId,
        email,
        name,
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Sync User Error:", error);
    res.status(500).json({ error: "Error syncing user" });
  }
};


exports.addAddress = async (req, res) => {
  const user = await User.findById(req.user._id);

  user.addresses.push(req.body);

  await user.save();

  res.json(user);
};


exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(req.user._id);

    const address = user.addresses.id(id);

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    address.deleteOne(); // remove subdocument

    await user.save();

    res.json({
      message: "Address deleted successfully",
      addresses: user.addresses,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
