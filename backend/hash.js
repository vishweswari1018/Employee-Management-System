
const bcrypt = require("bcryptjs");

bcrypt.hash("Admin@123", 10).then((hash) => {
  console.log("Hashed Password:");
  console.log(hash);
});