//@ts-ignore
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import inquirer from "inquirer";
import {
  cloneRepo,
  create_repository,
  download,
  doFragment,
  updateToWeb,
} from "./git.js";
// import fse from "fs-extra";
import { GitResponse } from "./types/gitresponse.js";

export async function Upload(octokit:any) {
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
      const answer = await inquirer.prompt(question);
  
      const destination = [
        {
          name: "destination",
          type: "input",
          message: "Destination Folder:",
          validate: function (value:any) {
            return true;
            // if (value === path.basename(value)) {
            //   return true;
            // } else return "Enter a valid file path";
          },
        },
      ];
      const answer2 = await inquirer.prompt(destination);
      // octokit?.repos.getContent({path})
  
      download(answer.file_url, answer2.destination, octokit, () => {
        console.log(
          chalk.greenBright(
            `DONE!────────────────────────────────────────────────────────────────────────────────────────────────────`
          )
        );
      });
}