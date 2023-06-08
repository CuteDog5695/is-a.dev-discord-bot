const Email = require("../models/email");
// smtp server
const SMTPServer = require("smtp-server").SMTPServer;

const SMTPserver = new SMTPServer({
    async onAuth(auth, session, callback) {
      const { username, password } = auth;
      try {
        // Check if the provided credentials are valid
        const user = await Email.findOne({ username, passkey: password }).exec();
  
        if (!user || domain !== user.domain) {
          callback(new Error("Invalid username or password"));
          console.log("SMTP: INVALID CREDENTIALS")
        } else {
          callback(null, { user });
        }
      } catch (error) {
        callback(error);
      }

    },
});

function SMTP() {
    console.log("SMTP Server Started");
    SMTPserver.listen(25);
}

module.exports = SMTP;


