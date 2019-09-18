var nav = document.querySelector('.nav');
var firstNavLink = document.querySelector('.nav__item:first-child .nav__link');
var sections = document.querySelectorAll('.content__section');
var topSection = document.querySelector('#top-section');
var sectionActiveClass = 'content__section--active';
var scrollOffset = nav.getBoundingClientRect().height;

var scrollSpy = new Gumshoe('.nav__link', {
  navClass: 'nav__item--active',
  reflow: true,
  offset: function () {
    return scrollOffset;
  },
});

var smoothScroll = new SmoothScroll('.nav__link', {
  speed: 300,
  speedAsDuration: true,
  offset: function () {
    return scrollOffset;
  },
});

function setActiveSection(event) {
  var toggleHash = event.detail.toggle.getAttribute('href');
  var firstNavLinkHash = firstNavLink.getAttribute('href');
  var targetSection = (toggleHash !== firstNavLinkHash) ? event.detail.anchor : topSection;
  sections.forEach(function (section) {
    section.classList.remove(sectionActiveClass)
  });
  targetSection.classList.add(sectionActiveClass);
};

document.addEventListener('scrollStop', setActiveSection, false);
