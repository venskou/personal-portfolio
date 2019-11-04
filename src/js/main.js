const html = document.documentElement;
const {body} = document;
const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav__toggle');
const navToggleText = navToggle.querySelector('.nav__toggle-text');
const navContainer = nav.parentNode;
const navLinks = nav.querySelectorAll('.nav__link');
const firstNavLink = document.querySelector('.nav__item:first-child .nav__link');
const sections = document.querySelectorAll('.content__section');
const topSection = document.querySelector('#top-section');
const sectionActiveClass = 'content__section--active';

const mobileQuery = window.matchMedia('(max-width: 575.98px)');
let isMobile = mobileQuery.matches;
let isMenuOpen = nav.classList.contains('nav--open');

function getScrollOffset() {
  return nav.getBoundingClientRect().height + 10;
}

const scrollSpyOptions = {
  navClass: 'nav__item--active',
  reflow: true,
  offset: () => (isMobile ? 0 : getScrollOffset()),
  events: false,
};

const smoothScrollOptions = {
  speed: 300,
  speedAsDuration: true,
  offset: () => (isMobile ? 0 : getScrollOffset()),
};

const stickyProfileOptions = {
  noStyles: true,
  useStickyClasses: true,
  stickyClass: 'profile--sticky',
  stuckClass: 'profile--sticky-stuck',
  stickyChangeClass: 'profile--sticky-change',
  useGetBoundingClientRect: true,
};

const stickyNavOptions = {
  noStyles: true,
  useStickyClasses: true,
  stickyClass: 'nav--sticky',
  stuckClass: 'nav--sticky-stuck',
  stickyChangeClass: 'nav--sticky-change',
  useGetBoundingClientRect: true,
};

// eslint-disable-next-line no-unused-vars
const scrollSpy = new Gumshoe('.nav__link', scrollSpyOptions);
const smoothScroll = new SmoothScroll('.nav__link', smoothScrollOptions);
// eslint-disable-next-line no-unused-vars
const stickyProfile = stickybits('.profile', stickyProfileOptions);
const stickyNav = stickybits('.nav', stickyNavOptions);

function setActiveSection(event) {
  const toggleHash = event.detail.toggle.getAttribute('href');
  const firstNavLinkHash = firstNavLink.getAttribute('href');
  const targetSection = toggleHash !== firstNavLinkHash ? event.detail.anchor : topSection;

  sections.forEach(section => section.classList.remove(sectionActiveClass));
  targetSection.classList.add(sectionActiveClass);
}

function toggleNav() {
  nav.classList.toggle('nav--open');
  body.classList.toggle('no-scroll');
  html.classList.toggle('no-scroll');
  isMenuOpen = !isMenuOpen;
  navToggleText.textContent = isMenuOpen ? 'Close menu' : 'Open menu';
}

function setNavWidth() {
  if (isMobile) return;
  const navWidth = navContainer.offsetWidth;
  nav.style.width = `${navWidth}px`;
  stickyNav.update();
}

if (!Modernizr.csspositionsticky) {
  setNavWidth();
  window.addEventListener('resize', setNavWidth);
}

function linksEvents() {
  const lastLinkIndex = navLinks.length - 1;
  let focusedLinkIndex = 0;

  navLinks.forEach((link, index) => {
    link.addEventListener('click', () => {
      if (!isMobile) return;
      const linkTarget = link.getAttribute('href');
      link.blur();
      if (isMenuOpen) {
        toggleNav();
      }
      smoothScroll.animateScroll(linkTarget);
    });

    link.addEventListener('keyup', e => {
      if (!isMobile && e.keyCode !== 9) return;
      focusedLinkIndex = index;
    });

    link.addEventListener('blur', e => {
      if (!isMobile && e.keyCode !== 9) return;
      if (focusedLinkIndex === lastLinkIndex) {
        toggleNav();
      }
    });
  });
}

function screenTest(query) {
  stickyNav.update();

  isMobile = query.matches;
  if (!isMobile && isMenuOpen) {
    toggleNav();
  }

  linksEvents();

  if (isMobile && !Modernizr.csspositionsticky) {
    nav.style.width = 'auto';
  }

  if (!isMobile && !Modernizr.csspositionsticky) {
    setNavWidth();
  }
}

navToggle.addEventListener('click', toggleNav);
document.addEventListener('scrollStop', setActiveSection, false);
mobileQuery.addListener(screenTest);
window.addEventListener('resize', stickyNav.update());

linksEvents();
svg4everybody();
