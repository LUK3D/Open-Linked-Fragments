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
import { cloneRepo, create_repository, doFragment, updateToWeb, } from "./git.js";
//@ts-ignore
import fse from "fs-extra";
export function Download(octokit) {
    return __awaiter(this, void 0, void 0, function* () {
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
        let response;
        var user = yield octokit.users.getAuthenticated();
        var res;
        try {
            res = yield (octokit === null || octokit === void 0 ? void 0 : octokit.repos.get({
                repo: answer2.destination,
                owner: user.data.login,
            }));
        }
        catch (error) {
            console.log(chalk.greenBright(`Repository ${answer2.destination} not found! Creating new one`));
        }
        if (res) {
            response = res;
            console.log("Response", response);
        }
        else {
            //Creating new Repository
            response = yield create_repository(octokit);
        }
        //Creating Fragments from file
        yield doFragment();
        var finalDestination = yield cloneRepo(response, answer2.destination);
        // To copy a folder or file
        let cpath = process.argv[1].split("\\");
        cpath.splice(-1);
        let current_path = cpath.join("\\");
        yield fse.copySync(current_path + "\\core\\tmp\\metafiles\\", finalDestination);
        yield updateToWeb(finalDestination);
        console.log(`${chalk.greenBright(`DONE!────────────────────────────────────────────────────────────────────────────────────────────────────`)}`);
    });
}
