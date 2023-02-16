import { typableCharacters } from "./constants";
import { getAboutBtn, getCaret, getContactBtn, getInput1, getInput2, getMain, getModeButton, getProjectsBtn, getExperienceBtn, getSectionButtons, getSkillsBtn, getStandardContent, getTerminal, getThemeButton, getContactForm, getSubmittedMessage, getNameInput } from "./selectors";
import { buildRunCommand, cursorLeft, cursorRight, deleteChar, insertChar } from "./terminal_logic";
import { renderInput, tradeClasses } from "./ui";

export function typeChar(settings) {
    const inputEle1 = getInput1();
    const inputEle2 = getInput2();
    const caretEle = getCaret();

    const runCommand = buildRunCommand(settings);
    return (e) => {
        if (typableCharacters.includes(e.key)) {
            insertChar(e.key, settings);
            
            renderInput(inputEle1, inputEle2, caretEle, settings);
        } else if (e.key === "Backspace") {
            if (settings.cursorIdx === 0) return;
            deleteChar(settings);
            
            renderInput(inputEle1, inputEle2, caretEle, settings);
        } else if (e.key === "ArrowLeft") {
            cursorLeft(settings);
            renderInput(inputEle1, inputEle2, caretEle, settings);
        } else if (e.key === "ArrowRight") {
            cursorRight(settings);
            renderInput(inputEle1, inputEle2, caretEle, settings);
        } else if (e.key === "ArrowUp") {
        } else if (e.key === "ArrowDown") {
        } else if (e.key === "Enter") {
            // runCommand
            runCommand();
        } else if (e.key === "Tab") {
            e.preventDefault();
        }
    }
}

export function toggleMode(settings) {
    const button = getModeButton();
    const main = getMain();
    const terminal = getTerminal();

    return function() {
        if (settings.animating) return;
        settings.animating = true;
        if (settings.mode === "terminal") {
            document.activeElement.blur();
            tradeClasses(main, "terminal-showing", "standard-showing");
            tradeClasses(button, "terminal", "terminal-to-standard");
            
            setTimeout(() => {
                tradeClasses(button, "terminal-to-standard", "standard");
                settings.mode = "standard";
                settings.animating = false;
            },  1010);
        } else {
            terminal.focus();
            tradeClasses(main, "standard-showing", "terminal-showing");

            tradeClasses(button, "standard", "standard-to-terminal");
            setTimeout(() => {
                tradeClasses(button, "standard-to-terminal", "terminal");
                settings.mode = "terminal";
                settings.animating = false;
            },  1010);
        }
    }
}

export function toggleTheme(settings) {
    const button = getThemeButton();
    const icon = button.children[0];
    const main = getMain();
    const terminal = getTerminal();

    return function() {
        if (settings.animating) return;
        settings.animating = true;
        if (settings.theme === "dark") {
            tradeClasses(main, "dark", "light");
            tradeClasses(button, "dark", "light");
            
            settings.theme = "light";
            setTimeout(() => {
                tradeClasses(icon, "fa-sun", "fa-moon");
                settings.animating = false;
            },  200);
        } else {
            tradeClasses(main, "light", "dark");
            tradeClasses(button, "light", "dark");
            tradeClasses(button, "light", "dark");

            settings.theme = "dark";
            setTimeout(() => {
                settings.animating = false;
                tradeClasses(icon, "fa-moon", "fa-sun");
            },  200);
        }
        if (settings.mode === "terminal") {
            terminal.focus();
        }
    }
}

function findBtn(section) {
    switch (section) {
        case "about":
            return getAboutBtn();
        case "skills":
            return getSkillsBtn();
        case "experience":
            return getExperienceBtn();
        case "projects":
            return getProjectsBtn();
        case "contact":
            return getContactBtn();
        default:
            throw "unknown section: " + section;
    }
}

export function selectSection(settings, section) {
    const btn = findBtn(section);
    const allButtons = getSectionButtons();
    const contentBox = getStandardContent();
    const nameInput = getNameInput();

    return function() {
        if (settings.animating) return;
        settings.animating = true;
        contentBox.setAttribute("class", "");
        contentBox.classList.add(section);
        allButtons.forEach((btn) => btn.classList.remove("selected"));
        btn.classList.add("selected");
        settings.selected = section;
        settings.animating = false;
        if (section === 'contact') {
            setTimeout(() => {
                nameInput.focus();
            }, 700);
        } else {
            document.activeElement.blur();
        }
    }
}

export function scrollSections(settings) {
    // const sections = ["about", "skills", "experience", "projects", "contact"];
    const sections = ["about", "skills", "experience", "contact"];
    const allButtons = getSectionButtons();
    const contentBox = getStandardContent();
    const nameInput = getNameInput();

    let scrolling = false;
    let timeoutId = null;

    return function(e) {
        if (e.deltaY < 50 && e.deltaY > -50) return;
        if (scrolling) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                scrolling = false;
                timeoutId = null;
            }, 30);
            return;
        }
        scrolling = true;
        const scrollingDown = e.deltaY > 0;
        const curSection = settings.selected;
        const nextIdx = sections.indexOf(curSection) + (scrollingDown ? 1 : -1);
        if (nextIdx < 0 || nextIdx > 3) {
            scrolling = false;
            return;
        }
        const nextSection = sections[nextIdx];
        const btn = findBtn(nextSection);

        contentBox.setAttribute("class", "");
        contentBox.classList.add(nextSection);
        allButtons.forEach((btn) => btn.classList.remove("selected"));
        btn.classList.add("selected");

        if (nextSection === 'contact') {
            setTimeout(() => {
                nameInput.focus();
            }, 700);
        } else {
            document.activeElement.blur();
        }

        settings.selected = nextSection;
        
        timeoutId = setTimeout(() => {
            scrolling = false;
            timeoutId = null;
        }, 30);
    }
}

export function submitContactForm(settings) {

    const form = getContactForm();
    const submittedMessage = getSubmittedMessage();
    return function() {
    if (settings.contactSubmitted) return;
        settings.contactSubmitted = true;
        form.classList.add("hidden");
        submittedMessage.classList.remove("hidden");
    };
}