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
import { Octokit } from '@octokit/rest';
import { LocalStorage } from "node-localstorage";
/**
 * # Authenticate
 * This function runs to authenticate the user using the Github Access Token
 * @returns
 */
function authenticate() {
    return __awaiter(this, void 0, void 0, function* () {
        //1. try getting a token
        let localStorage = new LocalStorage('./storage');
        let token = localStorage.getItem('GITHUB_TOKEN');
        //2. if it exists, authenticate with it
        if (token) {
            console.log("Token is found in config. Skipping prompt.");
            try {
                const octokit = new Octokit({
                    auth: token,
                });
                return octokit;
            }
            catch (error) {
                throw error;
            }
        }
        else {
            //3. if no token is stored, prompt user for one
            const question = [{
                    name: 'token',
                    type: 'input',
                    message: 'Enter your Github personal access token.',
                    validate: function (value) {
                        if (value.length == 40) {
                            return true;
                        }
                        else
                            return 'Please enter a valid token.';
                    }
                }];
            const answer = yield inquirer.prompt(question);
            //4. authenticate with user's answer
            try {
                const octokit = new Octokit({
                    auth: answer.token,
                });
                //5. store the token for next time
                localStorage.setItem('GITHUB_TOKEN', answer.token);
                return octokit;
            }
            catch (error) {
                console.log(error);
            }
        }
    });
}
//5. export for use in index.js
export { authenticate };
