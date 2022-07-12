import inquirer from "inquirer";
//@ts-ignore
import chalk from "chalk";
import child_process from "child_process";
import { GitResponse } from "./types/gitresponse";
//@ts-ignore
import { LocalStorage } from "node-localstorage";
import path from "path";
//@ts-ignore
import gh from "github-url-to-object";
import { GitUrl } from "./types/giturl";
//@ts-ignore
import { Octokit } from "@octokit/rest";
//@ts-ignore
import fetch from "node-fetch";
import * as fs from "fs";

let localStorage = new LocalStorage("./storage");
/**
 * ## CREATE REPOSITORY
 * Function Create new Repository
 */
async function create_repository(octokit:any) {
  const question = [
    {
      name: "repo_name",
      type: "input",
      message: "Give a name to this Repository.",
      validate: function (value:string) {
        if (value.length > 5) {
          return true;
        } else return "The name must have more then 4 characters.";
      },
    },
  ];

  const answer = await inquirer.prompt(question);

  var reposConfig = {
    name: answer.repo_name,
    auto_init: true,
  };
  console.log("Creating new Repository, please wait");
  let result: GitResponse = await octokit.repos.createForAuthenticatedUser(
    reposConfig
  );
  //----------------------------------------------------------------------
  console.log(
    `Repository ${chalk.yellow(
      result.data.full_name
    )} created ${chalk.blueBright("successfully!")}`
  );
  return result;
}

/**
 * ## CLONE THE CREATED REPOSITORY
 */
async function cloneRepo(gitResponse: GitResponse, destination = "") {
  let token = localStorage.getItem("GITHUB_TOKEN");
  console.log(`Cloning Respository...`);
  await child_process.execSync(
    `git clone https://${gitResponse.data.owner.login}:${token}@github.com/${gitResponse.data.full_name}.git "${destination}/${gitResponse.data.full_name}"`
  );
  console.log(
    `Repository created at: ${chalk.yellow(
      destination + "/" + gitResponse.data.full_name
    )}`
  );

  await fs.writeFileSync(`${destination + "/" + gitResponse.data.full_name+ "/" + gitResponse.data.full_name}.olf`,`{"filename":"Teste basico"}`);

  return `${destination}/${gitResponse.data.full_name}`;
}

/**
 * ## Create Fragments from File
 */
async function doFragment() {
    let cpath = process.argv[1].split('\\');
    cpath.splice(-1);
    let current_path = cpath.join('\\');
  const question = [
    {
      name: "file_path",
      type: "input",
      message: "File to be Uploaded (absolute file name including extension):",
      //@ts-ignore
      validate: function (value) {
        return true;
        if (value === path.basename(value)) {
          return true;
        } else return "Enter a valid file path";
      },
    },
  ];
  const answer = await inquirer.prompt(question);

  console.log(`Fragmenting the File...`);
  await child_process.execSync(current_path+`\\core luk-fragments fgm "${answer.file_path}"`);


  



  console.log(`${chalk.yellow("File Fragmented with Success!")}`);
  return null;
}

/**
 * ## Commit and Push
 */
async function updateToWeb(path = "") {
  console.log(`Uploading Files to GitHub`);
  await child_process.execSync(
    `cd "${path}" && git add . && git commit -m "🚀New Updates ${Date.now().toLocaleString()}" && git push `,
    { cwd: path }
  );
  console.log(`Files Uploaded  ${chalk.yellow("successfully")}`);
  return path;
}

/**
 * ## Download Specific File/Dir From github
 */
async function download(fileUrl: string, destination = "", octokit: Octokit, callback?:Function) {
  const data: GitUrl = gh(fileUrl);
  data.folder = data.https_url.split(data.clone_url)[1];
  if (data.https_url.includes(data.branch)) {
    var tmp = data.folder.split(data.branch);
    data.folder = (tmp.length > 1 ? tmp[1] : tmp[0]) ?? "";
  }

  const repoContent = await octokit.rest.repos.getContent({
    owner: data.user,
    repo: data.repo,
    path: data.folder,
  });
//@ts-ignore
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
  
  files.forEach(async function (file:any) {
    if (file) {
      fetch(file.link)
        .then((res:any) => res.blob())
        .then((blob:any) => {
          saveAs(blob, destination + "\\" + file.name);
            if(count>=files.length){
                if(callback){
                    callback()
                }
            }
            count++;
        });
    }
  });

  return `${octokit}`;
}


async function saveAs(contet:any, filename:string) {
  let buffer = Buffer.from(await contet.text());
  fs.createWriteStream(filename).write(buffer);
}



// function clearTemps(path:string){
//     fs.rmSync();
// }
export { create_repository, cloneRepo, updateToWeb, doFragment, download };
