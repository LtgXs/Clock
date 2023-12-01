/* -----------------------------------------------
/* JS script to support Clock Rotation feature
/* By LtgX
/* 
/* v1.0.1  2023.12.1
/* ----------------------------------------------- */

const toggleClass = () => {
  const body = document.querySelector('body');
  body.classList.toggle('light');
};

const deg = 6;
const hr = document.querySelector('#hr');
const mn = document.querySelector('#mn');
const sc = document.querySelector('#sc');

setInterval(() => {
  let day = new Date();
  let hh = day.getHours() * 30;
  let mm = day.getMinutes() * deg;
  let ss = day.getSeconds() * deg;

  hr.style.transform = `rotateZ(${hh + mm / 12}deg)`;
  mn.style.transform = `rotateZ(${mm}deg)`;
  sc.style.transform = `rotateZ(${ss}deg)`;
}, 1000);

//Console output
var styleTitle1 = `
font-size: 20px;
font-weight: 600;
color: rgb(244,167,89);
`
var styleTitle2 = `
font-size:12px;
color: rgb(244,167,89);
`
var styleContent = `
color: rgb(30,152,255);
`
var title1 = 'Clock'
var title2 = `

/$$               /$$            /$$$$$$ 
| $$              | $$           /$$__  $$
| $$             /$$$$$$        | $$  \__/
| $$            |_  $$_/        | $$ /$$$$
| $$              | $$          | $$|_  $$
| $$              | $$ /$$      | $$  \ $$
| $$$$$$$$        |  $$$$/      |  $$$$$$/
|________/         \___/         \______/ 
                                                                                                                                              
`
var content = `
Github:  https://github.com/LittleGaoFX/Clock
`
console.log(`%c${title1} %c${title2}
%c${content}`, styleTitle1, styleTitle2, styleContent)