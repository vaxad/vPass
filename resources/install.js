const { exec } = require('child_process');

const childDirectories = ['server', 'web', 'app'];

childDirectories.forEach(dir => {
  exec(dir==="server"?`npm run setup`:`npm install`, { cwd: dir }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error installing dependencies in ${dir}:`, error);
      return;
    }
    console.log(`Dependencies installed in ${dir}:\n`, stdout);
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
  });
});
