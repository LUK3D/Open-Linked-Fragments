import inquirer from 'inquirer';
import chalk from 'chalk';
import child_process from 'child_process';

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
    let result = await octokit.repos.createForAuthenticatedUser(reposConfig);
    //----------------------------------------------------------------------
        console.log(JSON.stringify(result));
    //----------------------------------------------------------------------
    console.log(`Repository ${chalk.yellow(JSON.stringify(answer.repo_name))} created successfully!`)

}


async function cloneRepo (repoExists = false, username = '', repo = '', branch = 'master') {
    if (!repoExists) {
     await child_process.execSync(`git clone https://${username}:${process.env.PERSONAL_ACCESS_TOKEN}@github.com/${username}/${repo}.git repos/${username}/${repo}`);
    } else {
      child_process.execSync(`cd repos/${username}/${repo} && git pull origin ${branch} --rebase`);
    }
  }



export{
    create_repository,
    cloneRepo
}