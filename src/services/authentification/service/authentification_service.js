const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_SECRET } = require('../../../../config');
const initModels = require('../../../../models/init-models');
const sequelize = require('../../../../db');
//import * as nodemailer from 'nodemailer';
const nodemailer = require('nodemailer');

const LoggingService = require('../../../services/logging/logging'); // Import the logging service

const models = initModels(sequelize);
const clients = models['clients'];
const admins = models['admins'];
const moderateurs = models['moderateurs'];

class AuthentificationService {
    constructor(loggingService) {
        this.loggingService = loggingService; // Inject the logging service into the authentication service
    }

    async login(email, password) {
        let user;
        let role;
        let userId;

        // Find the user in clients, admins, and moderateurs tables
        user = await clients.findOne({ where: { email } });
        role = 'client';
        if (!user) {
            user = await admins.findOne({ where: { email } });
            role = 'admin';
        }
        if (!user) {
            user = await moderateurs.findOne({ where: { email } });
            role = 'moderateur';
        }

        // Check if the user exists and the password matches
        if (user && await bcrypt.compare(password, user.password)) {
            // Store the user ID
            if (role != "moderateur") {
            userId = user.admin_id || user.client_id;
            } else {
            userId = user.mod_id;
            }
            // Generate JWT token with user ID and role
            const token = jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '24h' });

            // Log successful login
            await this.loggingService.log(`User ${email} logged in successfully.`);

            // Return the JWT token
            return { token, userId, role };
        } else {
            // Log login failure
            await this.loggingService.log(`Failed login attempt for user ${email}.`);

            // Otherwise, throw an authentication error
            throw new Error('Email or password incorrect');
        }
    }

    // Method to verify JWT token
    async verifyToken(token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            return decoded;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }



    /*
    async sendBill(name: string, email: string, path: string): Promise<void> {
        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port:587,
          secure:false,
              auth:{
                  user:'aissanyris84',
                  pass:'fluccvroupxcmrdv',
              },
              tls: {
                  rejectUnauthorized: true
              }
        });
      
        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: 'aissanyris84',// sender mail
          to: email, // list of receivers
          subject: "Your Bill", // Subject line
          html: `
            <p>Dear ${name},</p>
            <p>Please find attached your bill.</p>
            <p>Thank you for your business.</p>
          `, // HTML body
          attachments: [
            {
              filename: "bill.pdf",
              path: path,
            },
          ],
        });
      
        console.log(`Message sent: ${info.messageId}`);
      }
      
    
      async notifyReclamationAnswer(email: string, description: string): Promise<void> {
        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port:587,
          secure:false,
              auth:{
                  user:'aissanyris84',
                  pass:'fluccvroupxcmrdv',
              },
              tls: {
                  rejectUnauthorized: true
              }
        });
      
        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: 'aissanyris84',// sender mail
          to: email, // list of receivers
          subject: "Reclamation response", // Subject line
          html: `
            <p>${description}</p>
          `, // HTML body
        });
      
        console.log(`Message sent: ${info.messageId}`);
      }
    }
    */

    async recupererMotDePasseClient(email) {

        let user;
        
        // Find the user in clients table    
        user = await clients.findOne({ where: { email } });

        // Créer un objet de transport réutilisable en utilisant le transport SMTP par défaut
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'aissanyris84',
                pass: 'fluccvroupxcmrdv',
            },
            tls: {
                rejectUnauthorized: true
            }
        });
    
        // Envoyer un email avec l'objet de transport défini
        const info = await transporter.sendMail({
            from: 'aissanyris84@gmail.com', // Adresse email de l'expéditeur
            to: email, // Adresse email du destinataire
            subject: 'Récupération de mot de passe', // Objet de l'email
            html: `
                <p>Bonjour,</p>
                <p>Votre mot de passe est : <strong>motdepasse123</strong></p>
                <p>Cordialement,</p>
                <p>L'équipe de support</p>
            `, // Corps de l'email au format HTML
        });
    
        console.log(`Message envoyé : ${info.messageId}`);
    }
    

    async recupererMotDePasse(email,link) {

        // Créer un objet de transport réutilisable en utilisant le transport SMTP par défaut
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'aissanyris84',
                pass: 'fluccvroupxcmrdv',
            },
            tls: {
                rejectUnauthorized: true
            }
        });
    
        // Envoyer un email avec l'objet de transport défini
        const info = await transporter.sendMail({
            from: 'aissanyris84@gmail.com', // Adresse email de l'expéditeur
            to: email, // Adresse email du destinataire
            subject: 'Récupération de mot de passe', // Objet de l'email
            html: `
                <p>Bonjour,</p>
                <p>Pour récupérer votre mot de passe, cliquez sur ce lien : <strong><a href="${link}">Lien</a></strong></p>
                <p>Cordialement,</p>
                <p>L'équipe de support de Mobilis.</p>
            `, // Corps de l'email au format HTML
        });
    
        console.log(`Message envoyé : ${info.messageId}`);
    }

}

module.exports = new AuthentificationService(new LoggingService()); // Pass an instance of LoggingService to AuthentificationService
