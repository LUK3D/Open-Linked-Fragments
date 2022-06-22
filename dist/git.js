var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import inquirer from "inquirer";
import chalk from "chalk";
import child_process from "child_process";
import { LocalStorage } from "node-localstorage";
import path from "path";
import gh from "github-url-to-object";
import fetch from "node-fetch";
import * as fs from "fs";
let localStorage = new LocalStorage("./storage");
/**
 * ## CREATE REPOSITORY
 * Function Create new Repository
 */
function create_repository(octokit) {
    return __awaiter(this, void 0, void 0, function* () {
        const question = [
            {
                name: "repo_name",
                type: "input",
                message: "Give a name to this Repository.",
                validate: function (value) {
                    if (value.length > 5) {
                        return true;
                    }
                    else
                        return "The name must have more then 4 characters.";
                },
            },
        ];
        const answer = yield inquirer.prompt(question);
        var reposConfig = {
            name: answer.repo_name,
            auto_init: true,
        };
        console.log("Creating new Repository, please wait");
        let result = yield octokit.repos.createForAuthenticatedUser(reposConfig);
        //----------------------------------------------------------------------
        console.log(`Repository ${chalk.yellow(result.data.full_name)} created ${chalk.blueBright("successfully!")}`);
        return result;
    });
}
/**
 * ## CLONE THE CREATED REPOSITORY
 */
function cloneRepo(gitResponse, destination = "") {
    return __awaiter(this, void 0, void 0, function* () {
        let token = localStorage.getItem("GITHUB_TOKEN");
        console.log(`Cloning Respository...`);
        yield child_process.execSync(`git clone https://${gitResponse.data.owner.login}:${token}@github.com/${gitResponse.data.full_name}.git "${destination}/${gitResponse.data.full_name}"`);
        console.log(`Repository created at: ${chalk.yellow(destination + "/" + gitResponse.data.full_name)}`);
        return `${destination}/${gitResponse.data.full_name}`;
    });
}
/**
 * ## Create Fragments from File
 */
function doFragment() {
    return __awaiter(this, void 0, void 0, function* () {
        let cpath = process.argv[1].split('\\');
        cpath.splice(-1);
        let current_path = cpath.join('\\');
        const question = [
            {
                name: "file_path",
                type: "input",
                message: "File to be Uploaded (absolute file name including extension):",
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
        const answer = yield inquirer.prompt(question);
        console.log(`Fragmenting the File...`);
        yield child_process.execSync(current_path + `\\core\\luk3d encode "${answer.file_path}"`);
        console.log(`${chalk.yellow("File Fragmented with Success!")}`);
        return null;
    });
}
/**
 * ## Commit and Push
 */
function updateToWeb(path = "") {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Uploading Files to GitHub`);
        yield child_process.execSync(`cd "${path}" && git add . && git commit -m "🚀New Updates ${Date.now().toLocaleString()}" && git push `, { cwd: path });
        console.log(`Files Uploaded  ${chalk.yellow("successfully")}`);
        return path;
    });
}
/**
 * ## Download Specific File/Dir From github
 */
function download(fileUrl, destination = "", octokit, callback) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const data = gh(fileUrl);
        data.folder = data.https_url.split(data.clone_url)[1];
        if (data.https_url.includes(data.branch)) {
            var tmp = data.folder.split(data.branch);
            data.folder = (_a = (tmp.length > 1 ? tmp[1] : tmp[0])) !== null && _a !== void 0 ? _a : "";
        }
        const repoContent = yield octokit.rest.repos.getContent({
            owner: data.user,
            repo: data.repo,
            path: data.folder,
        });
        var files = repoContent.data.map(function (file) {
            if (file.name.includes(".js")) {
                return {
                    link: `https://raw.githubusercontent.com/${data.user}/${data.repo}/${data.branch}/${file.path}`,
                    name: file.name,
                };
            }
        });
        // console.log('Files found at root level', files);
        var count = 0;
        files.forEach(function (file) {
            return __awaiter(this, void 0, void 0, function* () {
                if (file) {
                    fetch(file.link)
                        .then((res) => res.blob())
                        .then((blob) => {
                        saveAs(blob, destination + "\\" + file.name);
                        if (count >= files.length) {
                            if (callback) {
                                callback();
                            }
                        }
                        count++;
                    });
                }
            });
        });
        return `${octokit}`;
    });
}
function saveAs(contet, filename) {
    return __awaiter(this, void 0, void 0, function* () {
        let buffer = Buffer.from(yield contet.text());
        fs.createWriteStream(filename).write(buffer);
    });
}
export { create_repository, cloneRepo, updateToWeb, doFragment, download };
