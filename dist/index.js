var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as app from "commander";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import inquirer from "inquirer";
import { authenticate } from "./auth.js";
import { cloneRepo, create_repository, doFragment, download, updateToWeb, } from "./git.js";
import fse from "fs-extra";
var _app = new app.Command("init")
    .description("Run CLI tool")
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
console.log(chalk.greenBright(figlet.textSync("Linked Fragments", { horizontalLayout: "full" })));
console.log(chalk.greenBright(`
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                     Author:Filipe Lukebana (LUK3D)                                          |
|                                           Date: 19/06/2022                                                  |
|                                    Email: filipelukebana@gmail.com                                          │
|                                              Version: 0.1                                                   │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
`));
console.log("Welcome to " + chalk.yellow("Open Linked Fragments"));
const question = [
    {
        name: "proceed",
        type: "input",
        message: "Proceed to create a Github repo?",
        choices: ["Yes", "No"],
        default: "Yes",
    },
];
const answer = await inquirer.prompt(question);
if (answer.proceed == "Yes") {
    //proceed with Github authentication
    console.log(chalk.gray("Authenticating..."));
    const octokit = await authenticate();
    const question1 = [
        {
            name: "opeation",
            type: "input",
            message: "What do you want to do?",
            choices: ["Upload", "Download"],
            default: "Upload",
        },
    ];
    const answer1 = await inquirer.prompt(question1);
    if (answer1.opeation == "Download") {
        const question = [
            {
                name: "file_url",
                type: "input",
                message: "File Url:",
                validate: function (value) {
                    return true;
                    if (value === path.basename(value)) {
                        return true;
                    }
                    else
                        return "Enter a valid file path";
                },
            },
        ];
        const answer = await inquirer.prompt(question);
        const destination = [
            {
                name: "destination",
                type: "input",
                message: "Destination Folder:",
                validate: function (value) {
                    return true;
                    if (value === path.basename(value)) {
                        return true;
                    }
                    else
                        return "Enter a valid file path";
                },
            },
        ];
        const answer2 = await inquirer.prompt(destination);
        // octokit?.repos.getContent({path})
        download(answer.file_url, answer2.destination, octokit, () => {
            console.log(chalk.greenBright(`DONE!────────────────────────────────────────────────────────────────────────────────────────────────────`));
        });
    }
    else {
        const destination = [
            {
                name: "destination",
                type: "input",
                message: "Destination Folder:",
                validate: function (value) {
                    return true;
                    if (value === path.basename(value)) {
                        return true;
                    }
                    else
                        return "Enter a valid file path";
                },
            },
        ];
        const answer2 = await inquirer.prompt(destination);
        //Creating Fragments from file
        await doFragment();
        //Creating new Repository
        let response = await create_repository(octokit);
        var finalDestination = await cloneRepo(response, answer2.destination);
        // To copy a folder or file
        let cpath = process.argv[1].split('\\');
        cpath.splice(-1);
        let current_path = cpath.join('\\');
        await fse.copySync(current_path + "\\core\\tmp\\metafiles\\", finalDestination);
        await updateToWeb(finalDestination);
        console.log(`${chalk.greenBright(`
        DONE!────────────────────────────────────────────────────────────────────────────────────────────────────
        `)}`);
        //wget https://raw.githubusercontent.com/username/reponame/path/to/file
    }
}
else {
    //show exit message
    console.log(chalk.gray("Okay, bye."));
}
