var body = document.querySelector('body');
var html = document.querySelector('html');
var nav = document.querySelector('.nav');
var navToggle = document.querySelector('.nav__toggle');
var navContainer = nav.parentNode;
var navLinks = nav.querySelectorAll('.nav__link');
var firstNavLink = document.querySelector('.nav__item:first-child .nav__link');
var sections = document.querySelectorAll('.content__section');
var topSection = document.querySelector('#top-section');
var sectionActiveClass = 'content__section--active';
var profile = document.querySelector('.profile');

var mobileQuery = window.matchMedia('(max-width: 575.98px)');
var isMobile = mobileQuery.matches;
var isMenuOpen = nav.classList.contains('nav--open');

var scrollOffset = nav.getBoundingClientRect().height + 10;

var scrollSpyOptions = {
  navClass: 'nav__item--active',
  reflow: true,
  offset: function () {
    return isMobile ? 0 : scrollOffset;
  },
  events: false,
};

var smoothScrollOptions = {
  speed: 300,
  speedAsDuration: true,
  offset: function () {
    return isMobile ? 0 : scrollOffset;
  },
};

var stickyProfileOptions = {
  noStyles: true,
  useStickyClasses: true,
  stickyClass: 'profile--sticky',
  stuckClass: 'profile--sticky-stuck',
  stickyChangeClass: 'profile--sticky-change',
  useGetBoundingClientRect: true
};

var stickyNavOptions = {
  noStyles: true,
  useStickyClasses: true,
  stickyClass: 'nav--sticky',
  stuckClass: 'nav--sticky-stuck',
  stickyChangeClass: 'nav--sticky-change',
  useGetBoundingClientRect: true
};

var scrollSpy = new Gumshoe('.nav__link', scrollSpyOptions);
var smoothScroll = new SmoothScroll('.nav__link', smoothScrollOptions);
var stickyProfile = stickybits('.profile', stickyProfileOptions);
var stickyNav = stickybits('.nav', stickyNavOptions);

function setActiveSection(event) {
  var toggleHash = event.detail.toggle.getAttribute('href');
  var firstNavLinkHash = firstNavLink.getAttribute('href');
  var targetSection = (toggleHash !== firstNavLinkHash) ? event.detail.anchor : topSection;

  for (var i = 0; i < sections.length; i++) {
    sections[i].classList.remove(sectionActiveClass);
  }
  targetSection.classList.add(sectionActiveClass);
}

function toggleNav() {
  nav.classList.toggle('nav--open');
  body.classList.toggle('no-scroll');
  html.classList.toggle('no-scroll');
  isMenuOpen = !isMenuOpen;
}

function setNavWidth() {
  if (isMobile) return;
  var navWidth = navContainer.offsetWidth;
  nav.style.width = navWidth + 'px';
  stickyNav.update();
}

if (!Modernizr.csspositionsticky) {
  setNavWidth();
  window.addEventListener('resize', setNavWidth);
}

function linksEvents() {
  for (var j = 0; j < navLinks.length; j++) {
    var link = navLinks[j];
    link.addEventListener('click', function () {
      if (isMobile) {
        var linkTarget = link.getAttribute('href');
        link.blur();
        if (isMenuOpen) {
          toggleNav();
        }
        smoothScroll.animateScroll(linkTarget);
      }
    });
  }
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

linksEvents();

navToggle.addEventListener('click', toggleNav);
document.addEventListener('scrollStop', setActiveSection, false);
mobileQuery.addListener(screenTest);
window.addEventListener('resize', stickyNav.update());

svg4everybody();