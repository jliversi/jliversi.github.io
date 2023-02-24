// Get all html elements once
const content = document.getElementById('standard-content');
const sidebarLinks = Array.from(document.querySelector('#nav-links').querySelectorAll('button'));
const label = document.getElementById('section-label');

const about = document.getElementById("about");
const skills = document.getElementById("skills");
const experience = document.getElementById("experience");
const projects = document.getElementById("projects");

// Store initial heights and re-store after any resize
let aboutHeight = about.scrollHeight;
if (window.innerWidth < 1024) {
  aboutHeight -= 55;
}
let skillsHeight = skills.scrollHeight;
let experienceHeight = experience.scrollHeight;
let projectsHeight = projects.scrollHeight;
window.addEventListener('resize', () => {
  aboutHeight = about.scrollHeight;
  if (window.innerWidth < 1024) {
    aboutHeight -= 55;
  }
  skillsHeight = skills.scrollHeight;
  experienceHeight = experience.scrollHeight;
  projectsHeight = projects.scrollHeight;
});


const sections = ['about', 'skills', 'experience', 'projects'];

function determineSectionIdx() {
  const currentScroll = content.scrollTop;
  if (currentScroll <  aboutHeight) {
    return 0;
  } else if (currentScroll < (aboutHeight + skillsHeight)) {
    return 1;
  } else if (currentScroll < (aboutHeight + skillsHeight + experienceHeight)) {
    return 2;
  } else {
    return 3;
  }
}

let sectionIdx = 0;
  
content.addEventListener('scroll', () => {
  const currentSectionIdx = determineSectionIdx();

  if (currentSectionIdx === sectionIdx) {
    return;
  } else {
    sidebarLinks[sectionIdx].classList.remove('selected');
    sectionIdx = currentSectionIdx;
    sidebarLinks[currentSectionIdx].classList.add('selected');
    changeSectionBox();
  }
});

function changeSectionBox() {
  label.className = '';
  label.classList.add(sections[sectionIdx]);
}

const about_btn = document.getElementById("about-btn");
const skills_btn = document.getElementById("skills-btn");
const experience_btn = document.getElementById("experience-btn");
const projects_btn = document.getElementById("projects-btn");

about_btn.addEventListener('click', () => {
  content.scrollTop = 0;
});
skills_btn.addEventListener('click', () => {
  content.scrollTop = aboutHeight;
});
experience_btn.addEventListener('click', () => {
  content.scrollTop = aboutHeight + skillsHeight;
});
projects_btn.addEventListener('click', () => {
  content.scrollTop = aboutHeight + skillsHeight + experienceHeight;
});