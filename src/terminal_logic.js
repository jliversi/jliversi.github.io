import { getCaret, getInput1, getInput2, getInputContainer, getTerminal, getOutputBlocks, getInputBlocks, getTerminalContainer } from "./selectors";
import { aboutText, contactText, creditsText, experienceText, helpText, resumeText, skillsText, sudoText, welcomeText } from "./constants";
import { escapeHtml } from "./ui";
import { toggleMode, toggleTheme } from "./listener_callbacks";


// TODO: Add memory of commands and up+down to navigate

// Terminal input functions
export function insertChar(key, settings) {
    settings.inputText = settings.inputText.slice(0, settings.cursorIdx)
        + key
        + settings.inputText.slice(settings.cursorIdx);
    settings.cursorIdx += 1;
}

export function deleteChar(settings) {
    settings.inputText = settings.inputText.slice(0, settings.cursorIdx - 1)
        + settings.inputText.slice(settings.cursorIdx);

    settings.cursorIdx = Math.max(settings.cursorIdx - 1, 0);
}

export function cursorLeft(settings) {
    settings.cursorIdx = Math.max(settings.cursorIdx - 1, 0);
}

export function cursorRight(settings) {
    settings.cursorIdx = Math.min(settings.cursorIdx + 1, settings.inputText.length);
}

// Creating elements for terminal output
function createOutputBlock() {
    const newDiv = document.createElement("div");
    newDiv.classList.add("output-block");
    return newDiv;
}

function createTextEleFromInput(settings) {
    const terminal = getTerminalContainer();
    const inputContainer = getInputContainer();
    const input1 = getInput1();
    const input2 = getInput2();
    const caret = getCaret();

    const newDiv = document.createElement("div");
    newDiv.classList.add("input-block");

    const outputPrompt = document.createElement("span");
    outputPrompt.classList.add("prompt");
    outputPrompt.classList.add("emphasis");
    outputPrompt.innerHTML = settings.dir + ':$';
    const outputInput = document.createElement("span");
    outputInput.innerHTML = escapeHtml(settings.inputText);
    newDiv.appendChild(outputPrompt);
    newDiv.appendChild(outputInput);

    terminal.insertBefore(newDiv, inputContainer);

    input1.innerHTML = "";
    input2.innerHTML = "";
    caret.innerHTML = " ";
    settings.inputText = "";
    settings.cursorIdx = 0;
}

function outputText(outputString) {
    const terminal = getTerminalContainer();
    const inputContainer = getInputContainer();

    const outputBlock = createOutputBlock();
    outputBlock.innerHTML = outputString;
    terminal.insertBefore(outputBlock, inputContainer);
}

// Commands
function clear_fn() {
    getOutputBlocks().forEach(el => el.remove());
    getInputBlocks().forEach(el => el.remove());
}

function help_fn() {
   outputText(helpText); 
}

function welcome_fn() {
   outputText(welcomeText); 
}

function about_fn() {
   outputText(aboutText); 
}

function skills_fn() {
    outputText(skillsText);
}

function experience_fn() {
    outputText(experienceText);
}

function credits_fn() {
    outputText(creditsText);
}

function resume_fn() {
    outputText(resumeText);
}

function contact_fn() {
    outputText(contactText);
}

function sudo_fn() {
    outputText(sudoText);
}

function echo_fn(...args) {
    outputText(args.join(" "));
}

function theme_fn(settings) {
    const toggle_fn = toggleTheme(settings);
    return function(arg) {
        if (arg === settings.theme) {
            return;
        }
        toggle_fn();
    }
}

function standard_site_fn(settings) {
    const toggle_fn = toggleMode(settings);
    const inputContainer = getInputContainer();
    const terminal = getTerminalContainer();

    return function() {
        toggle_fn();
        setTimeout(() => {
            clear_fn();
            const outputBlock = createOutputBlock();
            outputBlock.innerHTML = welcomeText;
            terminal.insertBefore(outputBlock, inputContainer);
        }, 600);
    }
}

function build_command_map(settings) {
    return {
        clear: clear_fn,
    
        // Prints constant text 
        help: help_fn,
        welcome: welcome_fn,
        about: about_fn,
        skills: skills_fn,
        experience: experience_fn,
        credits: credits_fn,
        sudo: sudo_fn,
        
        // Prints constant text but including links
        resume: resume_fn,
        contact: contact_fn,
        
        // // Functional in site
        theme: theme_fn(settings),
        exit: standard_site_fn(settings),
        switch: standard_site_fn(settings),
        quit: standard_site_fn(settings),
    
        echo: echo_fn,
        // projects: projects_fn, // TODO
    };
}


function commandNotFound(commandString) {
    const outputString = "command not found: " + commandString.split(" ")[0];
    outputText(escapeHtml(outputString));
}

function processCommand(commandMap, commandString) {
    if (commandString.length === 0) {
        return;
    }
    const [cmd, ...args] = commandString.split(" ");
    if (cmd in commandMap) {
        commandMap[cmd](...args);
    } else {
        commandNotFound(commandString);
    }
}

// UI function runs on enter
export function buildRunCommand(settings) {
    return function() {
        let commandString = settings.inputText.trim();

        const commandMap = build_command_map(settings);
        
        createTextEleFromInput(settings);
        processCommand(commandMap, commandString);
    }
}
