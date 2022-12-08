import prompt from "prompt";
import { ChatGPTAPI } from "chatgpt";
import dotenv from "dotenv";
import { marked } from "marked";
import TerminalRenderer from "marked-terminal";
import ora from "ora";
dotenv.config();

marked.setOptions({
  renderer: new TerminalRenderer(),
});

const spinner = ora();

async function chatGPT(query) {
  const api = new ChatGPTAPI({
    sessionToken: process.env.SESSION_TOKEN,
  });
  try {
    await api.ensureAuth();
  } catch (error) {
    console.log("Please try again later. " + error.message);
  }

  spinner.start("ChatGPT is thinking...");

  const response = await api.sendMessage(query);

  spinner.stop();

  console.log(marked(response));
}

console.log("Welcome to ChatGPT Shell!");
console.log("Type 'exit' or 'quit' to exit the shell. Type 'help' for help.");

const shell = () => {
  prompt.start();
  prompt.message = "";
  prompt.get(["Question"], async function (err, result) {
    if (err || result.Question === "exit" || result.Question === "quit") {
      return;
    } else if (result.Question === "help") {
      console.log(
        "Rename the .env.example file to .env and add your session token."
      );
    } else {
      await chatGPT(result.Question);
    }

    await shell();
  });
};

shell();
