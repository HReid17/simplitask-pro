import express from 'express';
import { validateLogin, validateRegister } from '../validators/auth.validator.js';
import { loginController, registerController } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Route to register a new user
router.post("/register", validateRegister, registerController);

// Route to log in an existing user
router.post("/login", validateLogin, loginController);

// Route to get information about the currently logged-in user
router.get("/me", requireAuth, (req, res) => {
    res.json({ user: req.user })
})

export default router;