import { welcomeText } from "./constants";
import { getOutputBlocks } from "./selectors";

export function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

export function setupWelcomeMessage() {
    const ele = getOutputBlocks()[0];
    ele.innerHTML = welcomeText;
}

export function tradeClasses(ele, classToRemove, classToAdd) {
    ele.classList.remove(classToRemove);
    ele.classList.add(classToAdd);
}

export function renderInput(input1, input2, caret, { inputText, cursorIdx }) {
    let pt1 = escapeHtml(inputText.slice(0,cursorIdx));
    let pt2 = escapeHtml(inputText.slice(cursorIdx + 1));
    let cursorChar = inputText[cursorIdx];

    input1.innerHTML = pt1;
    input2.innerHTML = pt2;
    caret.innerHTML = cursorChar ? escapeHtml(cursorChar) : " ";
}

