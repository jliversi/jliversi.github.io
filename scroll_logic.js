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
let skillsHeight = skills.scrollHeight;
let experienceHeight = experience.scrollHeight;
// let projectsHeight = projects.scrollHeight;
window.addEventListener('resize', () => {
  aboutHeight = about.scrollHeight;
  skillsHeight = skills.scrollHeight;
  experienceHeight = experience.scrollHeight;
  // projectsHeight = projects.scrollHeight;
});


// const sections = ['about', 'skills', 'experience', 'projects'];
const sections = ['about', 'skills', 'experience'];

// function determineSectionIdx() {
//   const currentScroll = content.scrollTop;
//   if (currentScroll <  aboutHeight) {
//     return 0;
//   } else if (currentScroll < (aboutHeight + skillsHeight)) {
//     return 1;
//   } else if (currentScroll < (aboutHeight + skillsHeight + experienceHeight)) {
//     if (Math.floor(window.innerHeight + content.scrollTop) === content.scrollHeight) {
//       return 3;
//     }
//     return 2;
//   }
//   return 3;
// }

function determineSectionIdx() {
  const currentScroll = content.scrollTop;
  if (currentScroll <  aboutHeight) {
    return 0;
  } else if (currentScroll < (aboutHeight + skillsHeight)) {
    if (Math.floor(window.innerHeight + content.scrollTop) === content.scrollHeight) {
      return 2;
    }
    return 1;
  }
  return 2;
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
// const projects_btn = document.getElementById("projects-btn");

about_btn.addEventListener('click', () => {
  content.scrollTop = 0;
});
skills_btn.addEventListener('click', () => {
  content.scrollTop = aboutHeight;
});
experience_btn.addEventListener('click', () => {
  content.scrollTop = aboutHeight + skillsHeight;
});
// projects_btn.addEventListener('click', () => {
//   content.scrollTop = aboutHeight + skillsHeight + experienceHeight;
// });

