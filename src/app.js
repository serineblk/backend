import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { pool } from './config/db.js';
import createAllTables from './utils/dbUtils.js';

// Import des routes
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import usersManagRoutes from './routes/usersmanagroute.js';
import housekeepingTaskRoutes from './routes/housekeepingTaskRoutes.js';
import inventoryOrderRoutes from './routes/inventoryOrderRoutes.js';
import specialRequestRoutes from './routes/specialRequestRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import invoice from'./routes/invoiceRoutes.js';
import taxpayment from'./routes/taxPaymentRoutes.js';
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // ou le port de votre frontend
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/usersmanag', usersManagRoutes);

// Routes d'entretien
app.use('/api/housekeeping', housekeepingTaskRoutes);


// Routes de commande d'inventaire
app.use('/api/inventory', inventoryOrderRoutes);

// Routes de demandes spéciales
app.use('/api/special-requests', specialRequestRoutes);

// Routes du personnel
app.use('/api/staff', staffRoutes);

app.use('/api/payments', paymentRoutes);
app.use('/api/invoices', invoice );
app.use('/api/tax_payments', taxpayment)

// Route de test
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'API en fonctionnement',
    timestamp: new Date().toISOString()
  });
});

const startServer = async () => {
  try {
    // Vérification connexion DB
    const conn = await pool.getConnection();
    console.log('✅ Connecté à la base de données MySQL');
    conn.release();

    // Création des tables
    await createAllTables();
    console.log('✅ Tables vérifiées/créées');

    // Démarrage du serveur
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Erreur initialisation:', error);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

startServer();