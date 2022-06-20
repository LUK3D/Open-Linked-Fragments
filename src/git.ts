import inquirer from 'inquirer';
import chalk from 'chalk';
import child_process from 'child_process';
import { GitResponse } from "./types/gitresponse";
import { LocalStorage } from "node-localstorage";
import path from 'path';
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
    console.log(`Repository ${chalk.yellow(result.data.full_name)} created ${chalk.blueBright("successfully!")}`)
    return result;

}


/**
 * ## CLONE THE CREATED REPOSITORY
 */
async function cloneRepo (gitResponse:GitResponse, destination='') {
    let token = localStorage.getItem('GITHUB_TOKEN');
    console.log(`Cloning Respository...`);
    await child_process.execSync(`git clone https://${gitResponse.data.owner.login}:${token}@github.com/${gitResponse.data.full_name}.git "${destination}/${gitResponse.data.full_name}"`);
    console.log(`Repository created at: ${chalk.yellow(destination+"/"+gitResponse.data.full_name)}`);
    return `${destination}/${gitResponse.data.full_name}`;
}

/**
 * ## Create Fragments from File
 */
async function doFragment () {
    const question = [{
        name: 'file_path',
        type: 'input',
        message: 'File to be Uploaded (absolute file name including extension):',
        validate: function(value) {

            return true;
            
           if (value === path.basename(value)) {
               return true;
            } else return 'Enter a valid file path';
         }
    }];
    const answer = await inquirer.prompt(question);
   
    console.log(`Fragmenting the File...`);
    await child_process.execSync(`luk3d encode "${answer.file_path}"`);
    console.log(`${chalk.yellow("File Fragmented with Success!")}`);
    return null;
}

/**
 * ## Commit and Push
 */
async function updateToWeb (path='') {
    console.log(`Uploading Files to GitHub`);
    await child_process.execSync(`cd "${path}" && git add . && git commit -m "🚀New Updates ${Date.now().toLocaleString()}" && git push `,{cwd:path});
    console.log(`Files Uploaded  ${chalk.yellow("successfully")}`);
    return path;
}



export{
    create_repository,
    cloneRepo,
    updateToWeb,
    doFragment
}