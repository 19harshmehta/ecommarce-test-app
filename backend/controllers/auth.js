const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  console.log(`[AUTH] Register request received`, { name, email, role });

  if (!name || !email || !password || !role) {
    console.warn(`[AUTH] Register failed : Missing fields`);
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const existing = await userModel.findUserByEmail(email);
    if (existing) {
      console.warn(`[AUTH] Register failed : Email already exists: ${email}`);
      return res.status(400).json({ message: 'Email exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await userModel.createUser({
      name,
      email,
      passwordHash,
      role,
    });

    console.log(`[AUTH] User registered successfully: ${email}`);
    res.status(201).json({ message: 'Registered' });

  } catch (error) {
    console.error(`[AUTH] Register error`, error);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  console.log(`[AUTH] Login request received`, { email });

  try {
    const user = await userModel.findUserByEmail(email);

    if (!user) {
      console.warn(`[AUTH] Login failed : User not found: ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      console.warn(`[AUTH] Login failed : Wrong password for: ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log(`[AUTH] Login successful: ${email}`);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(`[AUTH] Login error`, error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login };
