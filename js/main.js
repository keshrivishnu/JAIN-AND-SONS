
window.onload = function () {
    google.accounts.id.initialize({
      client_id: '89099724777-7rkgrnt7jgdrbv4q3kqj11bd1dgqvpnl.apps.googleusercontent.com', // Replace this
      callback: handleGoogleResponse,
    });
};

  
  function handleAuth() {
    google.accounts.id.prompt();
  }
  
  function handleGoogleResponse(response) {
    console.log("ID Token:", response.credential);
    alert("Signed in successfully with Google!");
  }
  const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  email: { type: String, required: true },
  phone: { type: String, required: true },
});

module.exports = mongoose.model('Customer', customerSchema);
