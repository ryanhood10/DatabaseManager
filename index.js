const fs = require('fs');
const path = require('path');

const roleSchemaPath = path.join(__dirname, './schemas/role.sql');
const roleSchema = fs.readFileSync(roleSchemaPath, 'utf-8');
