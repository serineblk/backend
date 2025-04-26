// src/services/authService.js
import { pool } from "../config/db.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Export nommé pour registerUser
export const registerUser = async (user) => {
    // ... votre implémentation existante de registerUser
};

// Export nommé pour loginUser (manquant dans votre code)
export const loginUser = async (email, password) => {
    try {
        const [users] = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        
        if (users.length === 0) {
            return { success: false, message: 'Utilisateur non trouvé' };
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!isMatch) {
            return { success: false, message: 'Mot de passe incorrect' };
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, user_type: user.user_type },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return { 
            success: true, 
            message: 'Connexion réussie',
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                user_type: user.user_type
            }
        };
    } catch (error) {
        console.error("Erreur de connexion:", error);
        throw error;
    }
};