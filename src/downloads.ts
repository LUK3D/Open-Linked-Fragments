//@ts-ignore
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import inquirer from "inquirer";
import * as fs from "fs";
import {
  cloneRepo,
  create_repository,
  doFragment,
  updateToWeb,
} from "./git.js";
//@ts-ignore
import fse from "fs-extra";
import { GitResponse } from "./types/gitresponse.js";

export async function Download(octokit:any){
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
  
      let response: GitResponse;
  
      var user = await octokit.users.getAuthenticated();
      var res;
  
      try {
        res = await octokit?.repos.get({
          repo: answer2.destination,
          owner: user.data.login,
        });
      } catch (error) {
        console.log(
          chalk.greenBright(
            `Repository ${answer2.destination} not found! Creating new one`
          )
        );
      }
  
      if (res) {
        response = res;
        console.log("Response", response);
      } else {
        //Creating new Repository
        response = await create_repository(octokit);
      }

       // To copy a folder or file
       let cpath = process.argv[1].split("\\");
       cpath.splice(-1);
       let current_path = cpath.join("\\");


      await fs.mkdir(current_path + "\\core\\tmp\\", { recursive: true }, async (err) => {
        if (err) throw err;
      });

      //Creating Fragments from file
      let filename = await doFragment();
      var finalDestination = await cloneRepo(response, answer2.destination,filename);
      
     
      await fse.copySync(
        current_path + "\\core\\tmp\\",
        finalDestination
      );
      // console.log('Creating Temp Files...')

      // await fse.move(current_path + "\\core\\tmp\\", finalDestination, { overwrite: false }, (err:any) => {
      //   if (err) return console.error(err)
      //   console.log('success!')
      // })

      

      await updateToWeb(finalDestination);
      console.log(
        `${chalk.greenBright(
          `DONE!────────────────────────────────────────────────────────────────────────────────────────────────────`
        )}`
      );
}

