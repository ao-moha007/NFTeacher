const  dotenv = require("dotenv");
dotenv.config();
function main() {
   console.log("Test : ", process.env.PINATA_API_KEY);
}
main();