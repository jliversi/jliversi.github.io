import { typableCharacters } from "./constants";
import { getAboutBtn,
    getCaret,
    getInput1,
    getInput2,
    getMain,
    getToStandardButton,
    getToTerminalButton,
    getProjectsBtn,
    getExperienceBtn,
    getSectionButtons,
    getSkillsBtn,
    getStandardContent,
    getTerminal,
    getThemeButton,
    getContactLinks
} from "./selectors";

import { buildRunCommand, cursorLeft, cursorRight, deleteChar, insertChar, prevCommand, nextCommand } from "./terminal_logic";
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
            prevCommand(settings);
            renderInput(inputEle1, inputEle2, caretEle, settings);
        } else if (e.key === "ArrowDown") {
            nextCommand(settings);
            renderInput(inputEle1, inputEle2, caretEle, settings);
        } else if (e.key === "Enter") {
            runCommand();
        } else if (e.key === "Tab") {
            e.preventDefault();
        }
    }
}

export function toggleModeToTerminal(settings) {
    const main = getMain();
    const terminal = getTerminal();

    const linkContainer = getContactLinks();
    const themeButton = getThemeButton();

    return function() {
        if (settings.animating) return;
        settings.animating = true;
        terminal.focus();
        tradeClasses(main, "standard-showing", "terminal-showing");

        tradeClasses(linkContainer, "standard", "standard-to-terminal");
        tradeClasses(themeButton, "standard", "terminal");
        
        setTimeout(() => {
            tradeClasses(linkContainer, "standard-to-terminal", "terminal");
            settings.mode = "terminal";
            settings.animating = false;
        },  600);
    }
}

export function toggleModeToStandard(settings) {
    const button = getToStandardButton();
    const main = getMain();

    const linkContainer = getContactLinks();
    const themeButton = getThemeButton();

    return function() {
        if (settings.animating) return;
        settings.animating = true;
        document.activeElement.blur();
        tradeClasses(main, "terminal-showing", "standard-showing");

        tradeClasses(linkContainer, "terminal", "standard");
        tradeClasses(themeButton, "terminal", "standard");
        
        setTimeout(() => {
            settings.mode = "standard";
            settings.animating = false;
        },  600);
    }
}

export function toggleTheme(settings) {
    const button = getThemeButton();
    const icon = button.children[0];
    const main = getMain();
    const terminal = getTerminal();
    const contactLinks = getContactLinks();

    return function() {
        if (settings.animating) return;
        settings.animating = true;
        if (settings.theme === "dark") {
            tradeClasses(main, "dark", "light");
            tradeClasses(button, "dark", "light");
            tradeClasses(contactLinks, "dark", "light");
            
            settings.theme = "light";
            setTimeout(() => {
                tradeClasses(icon, "fa-sun", "fa-moon");
                settings.animating = false;
            },  200);
        } else {
            tradeClasses(main, "light", "dark");
            tradeClasses(button, "light", "dark");
            tradeClasses(contactLinks, "light", "dark");

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
        default:
            throw "unknown section: " + section;
    }
}

export function selectSection(settings, section) {
    const btn = findBtn(section);
    const allButtons = getSectionButtons();
    const contentBox = getStandardContent();

    return function() {
        if (settings.animating) return;
        settings.animating = true;
        contentBox.setAttribute("class", "");
        contentBox.classList.add(section);
        allButtons.forEach((btn) => btn.classList.remove("selected"));
        btn.classList.add("selected");
        settings.selected = section;
        settings.animating = false;
    }
}

export function scrollSections(settings) {
    // const sections = ["about", "skills", "experience", "projects"];
    const sections = ["about", "skills", "experience"];
    const allButtons = getSectionButtons();
    const contentBox = getStandardContent();

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

        settings.selected = nextSection;
        
        timeoutId = setTimeout(() => {
            scrolling = false;
            timeoutId = null;
        }, 30);
    }
}
