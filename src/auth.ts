import inquirer from 'inquirer';
//@ts-ignore
import {Octokit} from '@octokit/rest';
//@ts-ignore
import { LocalStorage } from "node-localstorage";


/**
 * # Authenticate
 * This function runs to authenticate the user using the Github Access Token
 * @returns 
 */
//@ts-ignore
async function authenticate(dontseach = false){
    //1. try getting a token
    let localStorage = new LocalStorage('./storage');
    let token = localStorage.getItem('GITHUB_TOKEN');
    //2. if it exists, authenticate with it
    if(token && !dontseach){


      


      console.log("Old Token found in config.")

      const question1 = [
         {
           name: "operation",
           type: "input",
           message: "Do you want to use the old token?",
           choices: ["Y", "N"],
           default: "Y",
         },
       ];

       const answer1 = await inquirer.prompt(question1);

       if(answer1.operation == "N"){
         return await authenticate(true);
       }else{
         try{
            const octokit = new Octokit({
              auth: token,
             }); 
             return octokit;
         }catch (error){
           throw error;
         }
       }

       
    }else{
   //3. if no token is stored, prompt user for one
    const question = [{
        name: 'token',
        type: 'input',
        message: 'Enter your Github personal access token:',
        validate: function(value:any) {
           if (value.length == 40) {
               return true;
            } else return 'Please enter a valid token.';
         }
    }];
    const answer = await inquirer.prompt(question);
 
    //4. authenticate with user's answer
    try{
       const octokit = new Octokit({
         auth: answer.token,
       }); 
       //5. store the token for next time
       localStorage.setItem('GITHUB_TOKEN',answer.token)
       return octokit;
    }catch (error){
       console.log(error);
    }
 }
 }
  //5. export for use in index.js
  export{
    authenticate
  }