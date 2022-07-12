var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//@ts-ignore
import * as app from "commander";
//@ts-ignore
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import inquirer from "inquirer";
import { authenticate } from "./auth.js";
import { Download } from "./downloads.js";
import { Upload } from "./uploads.js";
function Run() {
    return __awaiter(this, void 0, void 0, function* () {
        var _app = new app.Command("init")
            .description("Run CLI tool")
            .action(() => __awaiter(this, void 0, void 0, function* () {
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
        //proceed with Github authentication
        console.log(chalk.gray("Authenticating..."));
        const octokit = yield authenticate();
        const question1 = [
            {
                name: "opeation",
                type: "input",
                message: "What do you want to do?",
                choices: ["u", "d"],
                default: "Upload",
            },
        ];
        const answer1 = yield inquirer.prompt(question1);
        if (answer1.opeation == "Download") {
            Upload(octokit);
        }
        else {
            Download(octokit);
        }
    });
}
Run();
