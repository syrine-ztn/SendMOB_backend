const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");

// Enable CORS for all origins
app.use(cors());

const Sequelize = require("sequelize");
const config = require("./../config.js");

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

// Initialize Sequelize with the configuration
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
  }
);

// Test the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

const authentificationRoutes = require("./services/authentification/authentification_route");
const clientManagementRoutes = require("./services/gestion_clients/gestion_clients_route");
const adminManagementRoutes = require("./services/gestion_admins/gestion_admins_route");
const contactManagementRoutes = require("./services/gestion_contacts/gestion_contacts_route");
const moderateurManagementRoutes = require("./services/gestion_moderateurs/gestion_moderateurs_route");
const signalementManagementRoutes = require("./services/gestion_signalements/gestion_signalements_route");
const plansManagementRoutes = require("./services/gestion_plans/gestion_plans_route");
const adressesManagementRoutes = require("./services/gestion_adresses/gestion_adresses_route");
const transactionsManagementRoutes = require("./services/gestion_transactions/gestion_transactions_route");
const statistiquesRoutes = require("./services/statistiques/statistiques_route");
const envoiSMSRoutes = require("./services/envoi_sms/envoi_sms_route");
const paiementRoutes = require("./services/paiement/paiement_route");
const envoiSMS2Routes = require("./services/envoi_sms2/envoi_sms2_route");
const gestionSMSRoutes = require("./services/gestion_sms/gestion_sms_route");


const notificationsRoutes = require("./services/notifications/notifications_route");

// Définir Les routes principales
app.use("/auth", authentificationRoutes);

app.use("/clients", clientManagementRoutes);

app.use("/admins", adminManagementRoutes);

app.use("/contacts", contactManagementRoutes);

app.use("/moderateurs", moderateurManagementRoutes);

app.use("/signalements", signalementManagementRoutes);

app.use("/plans", plansManagementRoutes);

app.use("/adresses", adressesManagementRoutes);

app.use("/transactions", transactionsManagementRoutes);

app.use("/statistiques", statistiquesRoutes);

app.use("/envoiSMS", envoiSMSRoutes);

app.use("/paiement", paiementRoutes);

app.use("/envoiSMS2", envoiSMS2Routes);

app.use("/gestionsms", gestionSMSRoutes);

app.use("/notifications", notificationsRoutes);

// Définir une route pour la racine
app.get("/", (req, res) => {
  res.send("Bienvenue sur la page d'accueil !");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
