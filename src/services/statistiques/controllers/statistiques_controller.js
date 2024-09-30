const StatistiquesService = require('./../service/statistiques_service');
const fs = require('fs');



// Contrôleur pour récupérer le tableau de bord du client
exports.getClientDashboard = async (req, res) => {
  const clientId = req.userId; // Utilisation de req.userId pour obtenir l'ID du client à partir de la middleware
  try {
    const clientDashboard = await StatistiquesService.getClientDashboard(clientId);
    res.status(200).json(clientDashboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contrôleur pour récupérer le tableau de bord du modérateur
exports.getModerateurDashboard = async (req, res) => {
  const moderateurId = req.userId; // Utilisation de req.userId pour obtenir l'ID du client à partir de la middleware
  try {
    const moderateurDashboard = await StatistiquesService.getModerateurDashboard(moderateurId);
    res.status(200).json(moderateurDashboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contrôleur pour récupérer le tableau de bord de l'administrateur
exports.getAdminDashboard = async (req, res) => {
  try {
    const adminDashboard = await StatistiquesService.getAdminDashboard();
    res.status(200).json(adminDashboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Contrôleur pour récupérer les statistiques mensuelles pour un client spécifique
exports.getClientMonthlyStats = async (req, res) => {
  const { year } = req.params;
  const clientId = req.userId; // Utilisation de req.userId pour obtenir l'ID du client à partir de la middleware
  try {
    const monthlyStats = await StatistiquesService.getClientMonthlyStats(clientId, year);
    res.status(200).json(monthlyStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contrôleur pour récupérer les statistiques mensuelles pour un modérateur spécifique
exports.getModerateurMonthlyStats = async (req, res) => {
  const { year } = req.params;
  const moderateurId = req.userId; // Utilisation de req.userId pour obtenir l'ID du modérateur à partir de la middleware
  try {
    const monthlyStats = await StatistiquesService.getModerateurMonthlyStats(moderateurId, year);
    res.status(200).json(monthlyStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contrôleur pour récupérer les statistiques mensuelles pour l'administrateur
exports.getAdminMonthlyStats = async (req, res) => {
  const { year } = req.params;
  try {
    const monthlyStats = await StatistiquesService.getAdminMonthlyStats(year);
    res.status(200).json(monthlyStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contrôleur pour générer un rapport pour les administrateurs
exports.generateAdminReport = async (req, res) => {
  const { year, format } = req.params;
  try {
    // Generate the report and get the file path
    const reportPath = await StatistiquesService.generateAdminReport(year, format);

    // Ensure the file path is correct
    if (!reportPath) {
      throw new Error('File not found');
    }

    // Set the file name for download
    const fileName = `admin_report_${year}.${format}`;

    // Send the file as a downloadable attachment
    res.download(reportPath, fileName, (err) => {
      if (err) {
        // Handle the error occurred during download
        console.error('Failed to download the file:', err);
        res.status(500).json({ error: 'Failed to download the file' });
      } else {
        // Delete the file after it has been downloaded
        fs.unlinkSync(reportPath);
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Contrôleur pour générer un rapport pour les clients
exports.generateClientReport = async (req, res) => {
  const { year, format } = req.params;
  const clientId = req.userId; // Utilisation de req.userId pour obtenir l'ID du client à partir de la middleware
  try {
    const reportPath = await StatistiquesService.generateClientReport(clientId, year, format);

    // Ensure the file path is correct
    if (!reportPath) {
      throw new Error('File not found');
    }

    // Set the file name for download
    const fileName = `client_report_${year}.${format}`;

    // Send the file as a downloadable attachment
    res.download(reportPath, fileName, (err) => {
      if (err) {
        // Handle the error occurred during download
        console.error('Failed to download the file:', err);
        res.status(500).json({ error: 'Failed to download the file' });
      } else {
        // Delete the file after it has been downloaded
        fs.unlinkSync(reportPath);
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Contrôleur pour générer un rapport pour les modérateurs
exports.generateModerateurReport = async (req, res) => {
  const { year, format } = req.params;
  const moderateurId = req.userId; // Utilisation de req.userId pour obtenir l'ID du modérateur à partir de la middleware
  try {
    const reportPath = await StatistiquesService.generateModerateurReport(moderateurId, year, format);

    // Ensure the file path is correct
    if (!reportPath) {
      throw new Error('File not found');
    }

    // Set the file name for download
    const fileName = `modérateur_report_${year}.${format}`;

    // Send the file as a downloadable attachment
    res.download(reportPath, fileName, (err) => {
      if (err) {
        // Handle the error occurred during download
        console.error('Failed to download the file:', err);
        res.status(500).json({ error: 'Failed to download the file' });
      } else {
        // Delete the file after it has been downloaded
        fs.unlinkSync(reportPath);
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

