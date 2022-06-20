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
        console.log(`Repository ${chalk.yellow(result.data.full_name)} created successfully!`);
        return result;
    });
}
/**
 * ## CLONE THE CREATED REPOSITORY
 * @param username the owner of the repository
 * @param repo The repository Name
 * @param branch
 * @param destination
 */
function cloneRepo(gitResponse, destination = '') {
    return __awaiter(this, void 0, void 0, function* () {
        let token = localStorage.getItem('GITHUB_TOKEN');
        yield child_process.execSync(`git clone https://${gitResponse.data.owner.login}:${token}@github.com/${gitResponse.data.full_name}.git "${destination}/${gitResponse.data.full_name}"`);
        console.log("DONE!");
        console.log(`Repository created at: ${destination}/${gitResponse.data.full_name}`);
        return `${destination}/${gitResponse.data.full_name}`;
    });
}
/**
 * ## Commit and Push

 */
function updateToWeb(path = '') {
    return __awaiter(this, void 0, void 0, function* () {
        yield child_process.execSync(`cd "${path}" && git add . && git commit -m "🚀New Updates ${Date.now().toLocaleString()}" && git push `);
        return path;
    });
}
export { create_repository, cloneRepo, updateToWeb };
