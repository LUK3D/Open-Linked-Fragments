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
import chalk from "chalk";
import inquirer from "inquirer";
import { download, } from "./git.js";
export function Upload(octokit) {
    return __awaiter(this, void 0, void 0, function* () {
        const question = [
            {
                name: "file_url",
                type: "input",
                message: "File Url:",
                // validate: function (value) {
                //   return true;
                //   if (value === path.basename(value)) {
                //     return true;
                //   } else return "Enter a valid file path";
                // },
            },
        ];
        const answer = yield inquirer.prompt(question);
        const destination = [
            {
                name: "destination",
                type: "input",
                message: "Destination Folder:",
                validate: function (value) {
                    return true;
                    // if (value === path.basename(value)) {
                    //   return true;
                    // } else return "Enter a valid file path";
                },
            },
        ];
        const answer2 = yield inquirer.prompt(destination);
        // octokit?.repos.getContent({path})
        download(answer.file_url, answer2.destination, octokit, () => {
            console.log(chalk.greenBright(`DONE!────────────────────────────────────────────────────────────────────────────────────────────────────`));
        });
    });
}
