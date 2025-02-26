const express = require('express');
const app = express();

// Serve static files from the dist directory
app.use(express.static('dist', { dotfiles: 'allow' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 