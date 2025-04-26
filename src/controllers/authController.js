// src/controllers/authController.js
import UserModel from '../models/userModel.js';
import { registerUser, loginUser } from '../services/authService.js';

export const register = async (req, res) => {
    console.log('[REGISTER] Données reçues:', req.body);
    
    try {
        // Validation basique côté serveur
        if (!req.body.username || !req.body.email || !req.body.password) {
            console.log('[REGISTER] Champs manquants');
            return res.status(400).json({
                success: false,
                message: 'Tous les champs sont obligatoires'
            });
        }

        const userData = {
            ...req.body,
            user_type: req.body.role || 'user' // Valeur par défaut 'user' si role non spécifié
        };

        console.log('[REGISTER] Données utilisateur avant création:', userData);

        const user = new UserModel(userData);
        console.log('[REGISTER] Utilisateur à créer:', user);

        const result = await registerUser(user);
        console.log('[REGISTER] Résultat de registerUser:', result);

        if (result.success) {
            console.log('[REGISTER] Utilisateur créé avec succès');
            return res.status(201).json({
                success: true,
                message: 'Inscription réussie',
                user: {
                    id: result.id,
                    username: user.username,
                    email: user.email,
                    role: user.user_type
                }
            });
        } else {
            console.log('[REGISTER] Échec de l\'inscription:', result.message);
            return res.status(400).json({
                success: false,
                message: result.message || 'Échec de l\'inscription'
            });
        }
    } catch (error) {
        console.error('[REGISTER] Erreur serveur:', error.message);
        console.error(error.stack); // Log la stack trace pour le débogage
        
        return res.status(500).json({ 
            success: false, 
            message: 'Erreur serveur lors de l\'inscription',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const login = async (req, res) => {
    // ... (garder votre implémentation existante de login)
};