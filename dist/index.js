var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as app from 'commander';
import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import inquirer from 'inquirer';
import { authenticate } from './auth.js';
import { cloneRepo, create_repository, updateToWeb } from './git.js';
import fse from "fs-extra";
var _app = new app.Command('init')
    .description('Run CLI tool')
    .action(() => __awaiter(void 0, void 0, void 0, function* () {
    //show welcome message
    console.log("Welcome to Open Linked Fragments CLI");
}));
_app.parse(process.argv); //get the arg (i.e. init)
//show help if no arg is passed
if (!_app.args.length) {
    _app.help();
}
clear(); //clears the terminal
//display app title
console.log(chalk.greenBright(figlet.textSync('Linked Fragments', { horizontalLayout: 'full' })));
console.log("Welcome to " + chalk.yellow("Open Linked Fragments"));
const question = [{
        name: 'proceed',
        type: 'input',
        message: 'Proceed to create a Github repo?',
        choices: ['Yes', 'No'],
        default: 'Yes'
    }];
const answer = await inquirer.prompt(question);
if (answer.proceed == "Yes") {
    //proceed with Github authentication
    console.log(chalk.gray("Authenticating..."));
    const octokit = await authenticate();
    //Creating new Repository
    let response = await create_repository(octokit);
    var finalDestination = await cloneRepo(response, "C:\\Users\\Delfi\\3D Objects");
    // To copy a folder or file  
    fse.copySync("C:\\Luk3d\\zona\\bin\\tmp\\metafiles\\", finalDestination);
    updateToWeb(finalDestination);
    "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";
}
else {
    //show exit message
    console.log(chalk.gray("Okay, bye."));
}
