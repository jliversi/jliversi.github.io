import { scrollSections, selectSection, submitContactForm, toggleMode, toggleTheme, typeChar } from "./listener_callbacks";
import { getAboutBtn, getContactBtn, getContactForm, getExperienceBtn, getModeButton, getProjectsBtn, getSkillsBtn, getStandardContainer, getTerminal, getThemeButton } from "./selectors";
import { setupWelcomeMessage } from "./ui";

// TODO check if on mobile and in that case only go to non-terminal site

// Create default settings
const settings = {
    mode: "terminal",
    theme: "dark",
    animating: false,
    // terminal settings
    inputText: "",
    cursorIdx: 0,
    dir: "/Users/jliversi",
    // standard site settings
    selected: "about",
    contactSubmitted: false,
}

// Run setup functions
setupWelcomeMessage();

// Attach listeners
// Stop animation on window resize
let resizeTimer;
window.addEventListener("resize", () => {
  document.body.classList.add("resize-animation-stopper");
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    document.body.classList.remove("resize-animation-stopper");
  }, 400);
});

// General
const modeButton = getModeButton();
modeButton.addEventListener("click", toggleMode(settings));

const themeButton = getThemeButton();
themeButton.addEventListener("click", toggleTheme(settings));

//Terminal
const terminalContainer = getTerminal();
terminalContainer.addEventListener('keydown', typeChar(settings));

// Section buttons in standard
const aboutBtn = getAboutBtn();
aboutBtn.addEventListener("click", selectSection(settings,"about"));
const skillsBtn = getSkillsBtn();
skillsBtn.addEventListener("click", selectSection(settings,"skills"));
const experienceBtn = getExperienceBtn();
experienceBtn.addEventListener("click", selectSection(settings,"experience"));
// const projectsBtn = getProjectsBtn(); // TODO
// projectsBtn.addEventListener("click", selectSection(settings,"projects")); // TODO
const contactBtn = getContactBtn();
contactBtn.addEventListener("click", selectSection(settings,"contact"));

// Scroll in standard
const standardContainer = getStandardContainer();
standardContainer.addEventListener("wheel", scrollSections(settings));

// Submit for contact form
const contactForm = getContactForm();
contactForm.addEventListener("submit", submitContactForm(settings));

// Focus terminal to allow user to type
terminalContainer.focus();

// TODO: REMOVE THIS 
window.josh = settings;
