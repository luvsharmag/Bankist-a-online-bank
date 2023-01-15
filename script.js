'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click',openModal))
  

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
///////////////////////////////////////////////////////////

btnScrollTo.addEventListener('click',function(e){
  e.preventDefault();
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());

  console.log('current scroll (x/y)', window.pageXOffset,window.pageYOffset);

  console.log(document.documentElement.clientHeight,document.documentElement.clientWidth);

  // window.scrollTo(
  //   s1coords.left+ window.pageXOffset ,
  //   window.pageYOffset+s1coords.top
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset ,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });
  section1.scrollIntoView({behavior:"smooth"});

});

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
// page Navigation

// document.querySelectorAll('.nav__link').forEach(function(ele){
//   ele.addEventListener('click',function(e){
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({behavior:"smooth"});
//   });
// });
//event delegation
document.querySelector('.nav__links').addEventListener('click',function(e){
  e.preventDefault();
  console.log(e.target);
  if(e.target.classList.contains('nav__link')){
    const id = e.target.getAttribute('href');    
    console.log(id);
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  }
});
///////////////////////////////////////////////////////
//tabbed component

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click',function(e){
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);

  //guard clause
  if(!clicked)return;

  //remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(tc => tc.remove('operations__content--active'));

  //active tab
  clicked.classList.add('operations__tab--active');

  console.log(clicked.dataset.tab);
  // active content
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});
////////////////////////////////////////////////////////
//menu fade animation
const navlinks = document.querySelector('.nav__links');
const navitem = document.querySelector('.nav__item');

const handlehover = function(e){
  if(e.target.classList.contains('nav__link')){
    const link = e.target;
    console.log(link);
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo  = link.closest('.nav').querySelector('img');

    siblings.forEach(ele => {
      if(ele !== link)ele.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
navlinks.addEventListener('mouseover',handlehover.bind(0.5));

navlinks.addEventListener('mouseout',handlehover.bind(1));

//sticky navigation
// const initialCoords = section1.getBoundingClientRect();
const nav = document.querySelector('.nav');
// window.addEventListener('scroll',function(){
//   if(this.window.scrollY > initialCoords.top){
//     nav.classList.add('sticky');
//   }else{
//     nav.classList.remove('sticky');
//   }
// });

//sticky navigation observere api


// const obsCallback = function(entries,observer){
//   entries.forEach(entry => 
//     console.log(entry)
//   );
// };
// const obsOptions = {
//   root: null,
//   threshold: [0,0.2],
// };

// const observer = new IntersectionObserver(obsCallback,obsOptions);
// observer.observe(section1);
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const obsCallback = function(entries){
  const [entry] = entries;
  console.log(entry);
  if(!entry.isIntersecting)nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,//90px before end of viewport of target element the callback function is called
};

const observer = new IntersectionObserver(obsCallback,obsOptions);
observer.observe(header);
////////////////////////////////////////////////////////
//reveal section

const allsection = document.querySelectorAll('.section');
//callback function
const revealSection = function(entries,observer){
  const [entry] = entries;
  console.log(entry);
  //gaurd clause
  if(!entry.isIntersecting)return;
  entry.target.classList.remove('section--hidden');

  observer.unobserve(entry.target);
};

const sectionobserver = new IntersectionObserver
(revealSection,{
  root: null,
  threshold: 0.15,
});
//target element
allsection.forEach(function(section){
  sectionobserver.observe(section);
  // section.classList.add('section--hidden');
});
////////////////////////////////////////////////////////
//lazy images
const imgTargets = document.querySelectorAll('img[data-src]');

const loading = function(entries,observer){
  const [entry] = entries;

  if(!entry.isIntersecting)return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load',function(){
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loading,{
  root: null,
  threshold: 0,  
});
imgTargets.forEach(img=>imgObserver.observe(img));

////////////////////////////////////////////////////////
//slider component
const slider = function(){
  const slides = document.querySelectorAll('.slide');
  const slider = document.querySelector('.slider');
  const btnleft = document.querySelector('.slider__btn--left');
  const btnright = document.querySelector('.slider__btn--right');

  // slider.style.overflow = 'visible';
  // slider.style.transform = 'scale(0.4) translateX(-800px)';

  let curSlide = 0;
  const maxSlide = slides.length;

  const goToSlide = function(slide){
    slides.forEach((s,i)=>{
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  };


  //next slide
  const nextSlide = function(){
    if(curSlide === maxSlide-1){
      curSlide = 0;
    }else{
      curSlide++;
    }
    goToSlide(curSlide);
    activateDots(curSlide);
  };
  const prevSlide = function(){
    curSlide = curSlide === 0? maxSlide - 1: curSlide - 1;
    goToSlide(curSlide);
    activateDots(curSlide);
  };
  btnright.addEventListener('click',nextSlide);
  btnleft.addEventListener('click',prevSlide);
  //using keyboard arrows
  document.addEventListener('keydown',function(e){
    e.key === 'ArrowRight' && nextSlide();
    e.key === 'ArrowLeft' && prevSlide();
  });

  // using dots
  const dotsContainer = document.querySelector('.dots');

  //insert dots using js
  const createDots = function(){
    slides.forEach((_,i)=>{
      dotsContainer.insertAdjacentHTML('beforeend',
      `<button class="dots__dot dots__dot--active" data-slide="${i}"></button>`);
    });
  };



  const activateDots = function(slide){
    document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));
    document.querySelector(`.dots__dot[data-slide = "${slide}"]`).classList.add('dots__dot--active');
  };

  //using event delegation find dots
  dotsContainer.addEventListener('click',function(e){
    if(e.target.classList.contains('dots__dot')){
      const {slide} = e.target.dataset;
      goToSlide(slide);
      activateDots(slide);
    }
  });

  const init = function(){
    goToSlide(0);
    createDots();
    activateDots(0);
  };
  init();
};
slider();
////////////////////////////////////////////////////////
/*

console.log(document.documentElement);
console.log(document.head);                               
console.log(document.body);                 
                                                     
const header = document.querySelector('.header');       
const allsection = document.querySelectorAll('.section');
console.log(allsection);  
 
document.getElementById('section--1');
                                                                               
const allbuttons = document.getElementsByTagName('button');
 
console.log(allbuttons);
           
console.log(document.getElementsByClassName('btn'));
     

///////////create and delete element
    
const message = document.createElement('div');
message.classList.add('cookie-message');
message.textContent = 'We use cooked for improved functionality and analytics';

message.innerHTML = `We use cooked for improved functionality and analytics.
<button class="btn btn--close-cookie">Got it!</button>`;
                             
header.prepend(message);
// header.append(message);

// header.append(message.cloneNode(true));

// header.before(message);
// header.after(message);

//remove element
document.querySelector('.btn--close-cookie').addEventListener('click',function(){
  // message.remove();
  message.parentElement.removeChild(message);
});


//styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(message.style.color);
console.log(getComputedStyle(message).height);

message.style.height = Number.parseFloat(getComputedStyle(message).height) + 30 +'px';

//attribute     
const logo = document.querySelector('.nav__logo');
console.log(logo.src);
console.log(logo.alt);

console.log(logo.getAttribute('src'));

logo.setAttribute('company','bankist');

//data attribute
console.log(logo.dataset.versionNumber);
//classes

logo.classList.add('c','j');
logo.classList.remove('c','j');
logo.classList.toggle('c','j');
logo.classList.contains('c','j');
//bad it will override classes
logo.className = 'c';

const h1 = document.querySelector('h1');

const alerth1 = function(e){
  alert('tadada! ');
};
// h1.addEventListener("mouseenter",alerth1);
// h1.removeEventListener('mouseenter',alerth1);

// setTimeout(() => {
//   h1.removeEventListener('mouseenter',alerth1);
// }, 5500);

// h1.onmouseenter = function(e){
//   alert('tadada! ');
// };
///event bubbling phase
const randomInt = (min,max)=> Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () =>`rgb(${randomInt(0,255)},${randomInt(0,255)},${randomInt(0,255)})`

document.querySelector('.nav').addEventListener('click',function(e){
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER',e.target,e.currentTarget);
});

document.querySelector('.nav__links').addEventListener('click',function(e){
  this.style.backgroundColor = randomColor();
  console.log('NAV',e.target,e.currentTarget);
},true);
document.querySelector('.nav__link').addEventListener('click',function(e){
  this.style.backgroundColor = randomColor();
  console.log('LINK',e.target,e.currentTarget);
  e.stopPropagation();
});
*/
const h1 = document.querySelector('h1');
//going downwards: child
console.log(h1.querySelectorAll('.highlight'));

console.log(h1.children);
console.log(h1.childNodes);

h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

//going upward
console.log(h1.parentNode);
console.log(h1.parentElement);

// h1.closest('.header').style.background = "orange";

// sideways
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

//all siblings
console.log(h1.parentElement.children);

//events

//DOMContentLoaded
document.addEventListener('DOMContentLoaded',function(e){
  console.log(e);
});
//load event
window.addEventListener('load',function(e){
  console.log(e);
});
//unload event
window.addEventListener('beforeunload',function(e){
  e.preventDefault();
  e.returnValue = '';
});