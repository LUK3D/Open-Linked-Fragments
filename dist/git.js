var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import inquirer from 'inquirer';
import chalk from 'chalk';
import child_process from 'child_process';
import { LocalStorage } from "node-localstorage";
import path from 'path';
import fse from "fs-extra";
let localStorage = new LocalStorage('./storage');
/**
 * ## CREATE REPOSITORY
 * Function Create new Repository
 */
function create_repository(octokit) {
    return __awaiter(this, void 0, void 0, function* () {
        const question = [{
                name: 'repo_name',
                type: 'input',
                message: 'Give a name to this Repository.',
                validate: function (value) {
                    if (value.length > 5) {
                        return true;
                    }
                    else
                        return 'The name must have more then 4 characters.';
                }
            }];
        const answer = yield inquirer.prompt(question);
        var reposConfig = {
            name: answer.repo_name,
            auto_init: true
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
function cloneRepo(gitResponse, destination = '') {
    return __awaiter(this, void 0, void 0, function* () {
        let token = localStorage.getItem('GITHUB_TOKEN');
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
        const question = [{
                name: 'file_path',
                type: 'input',
                message: 'File to be Uploaded (absolute file name including extension):',
                validate: function (value) {
                    return true;
                    if (value === path.basename(value)) {
                        return true;
                    }
                    else
                        return 'Enter a valid file path';
                }
            }];
        const answer = yield inquirer.prompt(question);
        console.log(`Fragmenting the File...`);
        yield child_process.execSync(`luk3d encode "${answer.file_path}"`);
        console.log(`${chalk.yellow("File Fragmented with Success!")}`);
        return null;
    });
}
/**
 * ## Commit and Push
 */
function updateToWeb(path = '') {
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
function download(fileUrl, destination = '') {
    return __awaiter(this, void 0, void 0, function* () {
        let filename = fileUrl.split("/")[fileUrl.split("/").length - 1];
        if (fileUrl.length == 0) {
            console.log(`Invalid URL`);
            return null;
        }
        console.log("FILENAME: " + filename);
        let final_folder = destination + "\\" + filename;
        yield fse.mkdirSync(final_folder);
        var folder = fileUrl.split("tree")[0];
        if (fileUrl.split("tree").length > 1) {
            folder = fileUrl.split("tree")[1];
        }
        let myName = fileUrl.split("tree")[1].split("/");
        myName.shift();
        myName.shift();
        console.log("MYNAME:", myName);
        let repoName = fileUrl.split("tree")[0].split("/")[fileUrl.split("tree")[0].split("/").length - 1];
        let splited = fileUrl.split("tree")[0].trim().split('/');
        console.log(splited);
        let completeName = final_folder + "\\" + repoName + (splited[splited.length - 1] == "" ? splited[splited.length - 2] : splited[splited.length - 1]);
        //Initializing new Repo
        console.log(`Cloning Respository... ${completeName}`); //Trocado
        yield child_process.execSync(`git clone --filter=blob:none --no-checkout --depth 1 --sparse ${fileUrl.split("tree")[0]}`, { cwd: final_folder });
        yield child_process.execSync(`git sparse-checkout init --cone`, { cwd: completeName });
        yield child_process.execSync(`git sparse-checkout add ${myName.join('/')}`, { cwd: completeName });
        yield child_process.execSync(`git checkout`, { cwd: completeName });
        console.log(`Repository created at: ${chalk.yellow(final_folder)}`);
        return `${final_folder}`;
    });
}
export { create_repository, cloneRepo, updateToWeb, doFragment, download };
