var DataTypes = require("sequelize").DataTypes;
var _admins = require("./admins");
var _adresses = require("./adresses");
var _chatbot_conversations = require("./chatbot_conversations");
var _clients = require("./clients");
var _contact_message_client = require("./contact_message_client");
var _contacts = require("./contacts");
var _message_client_contacts = require("./message_client_contacts");
var _messages = require("./messages");
var _moderateurs = require("./moderateurs");
var _notifications = require("./notifications");
var _notifications_admin = require("./notifications_admin");
var _notifications_moderateur = require("./notifications_moderateur");
var _plans = require("./plans");
var _plans_clients = require("./plans_clients");
var _signalements = require("./signalements");
var _transactions = require("./transactions");

function initModels(sequelize) {
  var admins = _admins(sequelize, DataTypes);
  var adresses = _adresses(sequelize, DataTypes);
  var chatbot_conversations = _chatbot_conversations(sequelize, DataTypes);
  var clients = _clients(sequelize, DataTypes);
  var contact_message_client = _contact_message_client(sequelize, DataTypes);
  var contacts = _contacts(sequelize, DataTypes);
  var message_client_contacts = _message_client_contacts(sequelize, DataTypes);
  var messages = _messages(sequelize, DataTypes);
  var moderateurs = _moderateurs(sequelize, DataTypes);
  var notifications = _notifications(sequelize, DataTypes);
  var notifications_admin = _notifications_admin(sequelize, DataTypes);
  var notifications_moderateur = _notifications_moderateur(sequelize, DataTypes);
  var plans = _plans(sequelize, DataTypes);
  var plans_clients = _plans_clients(sequelize, DataTypes);
  var signalements = _signalements(sequelize, DataTypes);
  var transactions = _transactions(sequelize, DataTypes);

  adresses.belongsTo(clients, { as: "client", foreignKey: "client_id"});
  clients.hasMany(adresses, { as: "adresses", foreignKey: "client_id"});
  chatbot_conversations.belongsTo(clients, { as: "user", foreignKey: "user_id"});
  clients.hasMany(chatbot_conversations, { as: "chatbot_conversations", foreignKey: "user_id"});
  contacts.belongsTo(clients, { as: "client", foreignKey: "client_id"});
  clients.hasMany(contacts, { as: "contacts", foreignKey: "client_id"});
  message_client_contacts.belongsTo(clients, { as: "client", foreignKey: "client_id"});
  clients.hasMany(message_client_contacts, { as: "message_client_contacts", foreignKey: "client_id"});
  messages.belongsTo(clients, { as: "client", foreignKey: "client_id"});
  clients.hasMany(messages, { as: "messages", foreignKey: "client_id"});
  moderateurs.belongsTo(clients, { as: "client_client", foreignKey: "client_id"});
  clients.hasMany(moderateurs, { as: "moderateurs", foreignKey: "client_id"});
  notifications.belongsTo(clients, { as: "client", foreignKey: "client_id"});
  clients.hasMany(notifications, { as: "notifications", foreignKey: "client_id"});
  plans_clients.belongsTo(clients, { as: "client", foreignKey: "client_id"});
  clients.hasMany(plans_clients, { as: "plans_clients", foreignKey: "client_id"});
  signalements.belongsTo(clients, { as: "client", foreignKey: "client_id"});
  clients.hasMany(signalements, { as: "signalements", foreignKey: "client_id"});
  contact_message_client.belongsTo(contacts, { as: "contact", foreignKey: "contact_id"});
  contacts.hasMany(contact_message_client, { as: "contact_message_clients", foreignKey: "contact_id"});
  contact_message_client.belongsTo(messages, { as: "message", foreignKey: "message_id"});
  messages.hasMany(contact_message_client, { as: "contact_message_clients", foreignKey: "message_id"});
  message_client_contacts.belongsTo(messages, { as: "message", foreignKey: "message_id"});
  messages.hasMany(message_client_contacts, { as: "message_client_contacts", foreignKey: "message_id"});
  clients.belongsTo(moderateurs, { as: "mod", foreignKey: "mod_id"});
  moderateurs.hasMany(clients, { as: "clients", foreignKey: "mod_id"});
  notifications_moderateur.belongsTo(moderateurs, { as: "mod", foreignKey: "mod_id"});
  moderateurs.hasMany(notifications_moderateur, { as: "notifications_moderateurs", foreignKey: "mod_id"});
  plans_clients.belongsTo(plans, { as: "plan", foreignKey: "plan_id"});
  plans.hasMany(plans_clients, { as: "plans_clients", foreignKey: "plan_id"});
  transactions.belongsTo(plans, { as: "plan", foreignKey: "plan_id"});
  plans.hasMany(transactions, { as: "transactions", foreignKey: "plan_id"});

  return {
    admins,
    adresses,
    chatbot_conversations,
    clients,
    contact_message_client,
    contacts,
    message_client_contacts,
    messages,
    moderateurs,
    notifications,
    notifications_admin,
    notifications_moderateur,
    plans,
    plans_clients,
    signalements,
    transactions,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
