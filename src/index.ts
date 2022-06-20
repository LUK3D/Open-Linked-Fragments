import * as app from 'commander';
import chalk from 'chalk';
import clear from 'clear';
import  figlet from 'figlet';
import inquirer from 'inquirer';
import {authenticate} from './auth.js';
import {cloneRepo, create_repository, doFragment, updateToWeb} from './git.js';
import fse from "fs-extra";

var _app = new app.Command('init')
  .description('Run CLI tool')
  .action(async() => {
      //show welcome message
     console.log("Welcome to Open Linked Fragments CLI");
})

_app.parse(process.argv); //get the arg (i.e. init)

//show help if no arg is passed
if (!_app.args.length) {
    _app.help(); 
}

clear(); //clears the terminal

//display app title
console.log(chalk.greenBright(
figlet.textSync('Linked Fragments', { horizontalLayout: 'full' })));
console.log(chalk.greenBright(
`
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                     Author:Filipe Lukebana (LUK3D)                                          |
|                                           Date: 19/06/2022                                                  |
|                                    Email: filipelukebana@gmail.com                                          │
|                                              Version: 0.1                                                   │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
`
));

console.log("Welcome to "+ chalk.yellow("Open Linked Fragments"));

const question = [{
    name: 'proceed',
    type: 'input',
    message: 'Proceed to create a Github repo?',
    choices: ['Yes', 'No'],
    default: 'Yes'
}];

const answer = await inquirer.prompt(question);


if(answer.proceed == "Yes"){
    //proceed with Github authentication
    console.log(chalk.gray("Authenticating..."))
    const octokit = await authenticate(); 

    //Creating Fragments from file
    await doFragment();
    //Creating new Repository
    let response = await create_repository(octokit);
    var finalDestination = await cloneRepo(response,"C:\\Users\\Delfi\\3D Objects");
    // To copy a folder or file  
    await fse.copySync("C:\\Luk3d\\zona\\bin\\tmp\\metafiles\\", finalDestination);
    await updateToWeb(finalDestination);
    console.log(`${chalk.greenBright(`
    DONE!────────────────────────────────────────────────────────────────────────────────────────────────────
    `)}`);


}else{
    //show exit message
    console.log(chalk.gray("Okay, bye."))
}



