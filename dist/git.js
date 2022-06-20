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
        console.log(JSON.stringify(result));
        //----------------------------------------------------------------------
        console.log(`Repository ${chalk.yellow(JSON.stringify(answer.repo_name))} created successfully!`);
    });
}
function cloneRepo(repoExists = false, username = '', repo = '', branch = 'master') {
    return __awaiter(this, void 0, void 0, function* () {
        if (!repoExists) {
            yield child_process.execSync(`git clone https://${username}:${process.env.PERSONAL_ACCESS_TOKEN}@github.com/${username}/${repo}.git repos/${username}/${repo}`);
        }
        else {
            child_process.execSync(`cd repos/${username}/${repo} && git pull origin ${branch} --rebase`);
        }
    });
}
export { create_repository, cloneRepo };
