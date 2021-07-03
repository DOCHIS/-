const express   = require('express');
global.config   = require('../../config.json');
global.fetch    = require("node-fetch");
global.Buffer   = global.Buffer || require('buffer').Buffer;

// Create express instance
const app = express()

// Require API routes
const invite = require('./routes/invite')

// Import API Routes
app.use(invite)

// Export express app
module.exports = app

// Start standalone server if directly running
if (require.main === module) {
  const port = process.env.PORT || 3001
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API server listening on port ${port}`)
  })
}
