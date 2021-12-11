const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const envPath = path.resolve(__dirname, '../', '../', '.env');

if (!fs.existsSync(envPath)) {
  throw new Error('.env file not found in root directory');
}

console.log('.env file found - applying params');
dotenv.config({ path: envPath});
