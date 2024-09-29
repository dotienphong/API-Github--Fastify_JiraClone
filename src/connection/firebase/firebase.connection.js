var admin = require("firebase-admin");

var serviceAccount = require("./jiraclone-a750e-firebase-adminsdk-lghhc-03012998cc.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
