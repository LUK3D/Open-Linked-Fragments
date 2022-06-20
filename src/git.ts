import inquirer from 'inquirer';
import chalk from 'chalk';
import child_process from 'child_process';
import { GitResponse } from "./types/gitresponse";
import { LocalStorage } from "node-localstorage";
let localStorage = new LocalStorage('./storage');
/**
 * ## CREATE REPOSITORY
 * Function Create new Repository
 */
async function create_repository(octokit){
    const question = [{
        name: 'repo_name',
        type: 'input',
        message: 'Give a name to this Repository.',
        validate: function(value) {
           if (value.length > 5) {
               return true;
            } else return 'The name must have more then 4 characters.';
         }
    }];

    const answer = await inquirer.prompt(question);

    var reposConfig = {
        name:answer.repo_name,
        auto_init: true
    }
    console.log("Creating new Repository, please wait");
    let result:GitResponse = await octokit.repos.createForAuthenticatedUser(reposConfig);
    //----------------------------------------------------------------------
    console.log(`Repository ${chalk.yellow(result.data.full_name)} created successfully!`)
    return result;

}


/**
 * ## CLONE THE CREATED REPOSITORY
 * @param username the owner of the repository
 * @param repo The repository Name
 * @param branch 
 * @param destination 
 */
async function cloneRepo (gitResponse:GitResponse, destination='') {
    let token = localStorage.getItem('GITHUB_TOKEN');
     await child_process.execSync(`git clone https://${gitResponse.data.owner.login}:${token}@github.com/${gitResponse.data.full_name}.git "${destination}/${gitResponse.data.full_name}"`);
     console.log("DONE!");
     console.log(`Repository created at: ${destination}/${gitResponse.data.full_name}`);
     return `${destination}/${gitResponse.data.full_name}`;
}

/**
 * ## Commit and Push

 */
async function updateToWeb (path='') {
     await child_process.execSync(`cd "${path}" && git add . && git commit -m "🚀New Updates ${Date.now().toLocaleString()}" && git push `);
    return path;
}



export{
    create_repository,
    cloneRepo,
    updateToWeb
}