// src/routes/authRoutes.js
import express from 'express';
import { register, login } from '../controllers/authController.js'; // Maintenant correct

const router = express.Router();
router.post('/register', register);

router.post('/login', login);

export default router;