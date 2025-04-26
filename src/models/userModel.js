// src/models/userModel.js
import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';

class UserModel {
  constructor({ username, email, mobile, password, user_type = 'user' }) {
    this.username = username;
    this.email = email;
    this.mobile = mobile;
    this.password = password;
    this.user_type = user_type;
  }

  // Créer un nouvel utilisateur (avec hashage du mot de passe)
  static async create(userData) {
    try {
      // Vérifier si l'email ou le username existe déjà
      if (await this.emailExists(userData.email)) {
        throw new Error('Email déjà utilisé');
      }
      if (await this.usernameExists(userData.username)) {
        throw new Error('Nom d\'utilisateur déjà utilisé');
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Insérer dans la base de données
      const [result] = await pool.query(
        `INSERT INTO users 
        (username, email, mobile, password_hash, user_type) 
        VALUES (?, ?, ?, ?, ?)`,
        [
          userData.username,
          userData.email,
          userData.mobile,
          hashedPassword,
          userData.user_type || 'user'
        ]
      );

      return { id: result.insertId, ...userData, password: undefined };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Trouver un utilisateur par email (pour le login)
  static async findByEmail(email) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM users WHERE email = ?', 
        [email]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  // Vérifier les credentials (pour le login)
  static async verifyCredentials(email, password) {
    try {
      const user = await this.findByEmail(email);
      if (!user) return null;

      const isMatch = await bcrypt.compare(password, user.password_hash);
      return isMatch ? user : null;
    } catch (error) {
      console.error('Error verifying credentials:', error);
      throw error;
    }
  }

  // Méthodes utilitaires
  static async emailExists(email) {
    const [rows] = await pool.query(
      'SELECT 1 FROM users WHERE email = ?', 
      [email]
    );
    return rows.length > 0;
  }

  static async usernameExists(username) {
    const [rows] = await pool.query(
      'SELECT 1 FROM users WHERE username = ?', 
      [username]
    );
    return rows.length > 0;
  }

  static async findById(id) {
    const [rows] = await pool.query(
      'SELECT id, username, email, mobile, user_type FROM users WHERE id = ?', 
      [id]
    );
    return rows[0] || null;
  }
}

export default UserModel;