const email = require("../models/email");
// smtp server
const SMTPServer = require("smtp-server").SMTPServer;

const SMTPserver = new SMTPServer({
    onAuth(auth, session, callback) {
      const { username, password } = auth;

  
      // Check if the provided credentials are valid
      email.findOne({ username, passkey: password }, (err, user) => {
        if (err || !user) {
          callback(new Error("Invalid username or password"));
          console.log("Invalid username or password")
        } else {
          callback(null, { user });
        }
      });
    },
});

function SMTP() {
    console.log("SMTP Server Started");
    SMTPserver.listen(25);
}

module.exports = SMTP;


