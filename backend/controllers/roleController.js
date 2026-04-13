import Role from "../models/role.js";

export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find({ isActive: true }).select('title description -_id');
    res.status(200).json({ success: true, count: roles.length, data: roles });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error fetching roles' });
  }
};

export const createRole = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ success: false, error: 'Title is required' });
    
    let role = await Role.findOne({ title });
    if (role) return res.status(400).json({ success: false, error: 'Role already exists' });
    
    role = await Role.create({ title, description });
    res.status(201).json({ success: true, data: role });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteRole = async (req, res) => {
    try {
        await Role.findOneAndDelete({ title: req.params.title });
        res.status(200).json({ success: true, data: {} });
    } catch(err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const deleteAllRoles = async (req, res) => {
    try {
        await Role.deleteMany({});
        res.status(200).json({ success: true, message: "All roles cleared" });
    } catch(err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
