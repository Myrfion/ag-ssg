#! /usr/bin/env node
import { program } from 'commander';
import { ssg_ } from './index.js';

program
  .option('-v, --version', 'output the current version')
  .option('-i, --input <item>', 'gets the input')
  .option('-h, --help', 'help');

program.parse(process.argv);
if (program.version) {
  console.log('Name of the package: ' + ' ag-ssg');
  console.log('Version details: 0.1.0');
}

if (program.opts().help) {
  console.log(
    'To run the code in terminal \n' +
      'Clone the repository into your local drive \n' +
      'git clone  <repository url> <project_name> \n' +
      'node app.js -i  <iteam>  select the file or directory\n' +
      'node app.js -v --version to get the version details\n' +
      'node app.js -h --help  to get the option \n' +
      'Need to install all the dependencies such as npm  install , npm links , Build and run the project\n'
  );
}
if (program.opts().input) {
  console.log('input:' + program.opts().input);
  ssg_(`${program.opts().input}`);
}
