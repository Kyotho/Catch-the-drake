const trees = document.querySelectorAll('.tree');
const scoreBoard = document.querySelector('.score');
const drakes = document.querySelectorAll('.drake');
const timerDisplay = document.querySelector('#time');
const startButton = document.querySelector('#startButton');
const scoreForm = document.querySelector('#score');
const scoreSubmit = document.querySelector('#submit');
const name = document.querySelector('#name');
const itemsList = document.querySelector('.ranking--plates');
const items = JSON.parse(localStorage.getItem('items')) || [];
var game;

let score = 0;
let lastTree;
let timeUp = false;
let buttonClicked = false;
function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function randomtree(trees) {
  const index = Math.floor(Math.random() * trees.length);
  const tree = trees[index];
  if (lastTree === tree) {
    return randomtree(trees);
  }

  lastTree = tree;
  return tree;
}

function peep(a, b) {
  const time = randomTime(a, b);
  const tree = randomtree(trees);
  tree.classList.add('up');
  setTimeout(() => {
    tree.classList.remove('up');
    if (!timeUp) peep(a, b);
  }, time);
}

function timer() {
  let sec = 20;

  countdown = setInterval(() => {
    if (sec <= 0) {
      return;
    }

    sec--;
    timerDisplay.textContent = `0:${sec < 10 ? '0' : ''}${sec}`;
  }, 1000);
}

function displayTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = seconds % 60;
  const display = `${minutes}:${
    remainderSeconds < 10 ? '0' : ''
  }${remainderSeconds}`;
  timerDisplay.textContent = display;
}

function startGame() {
  if (buttonClicked) return;
  sort(items);
  scoreBoard.textContent = 0;
  score = 0;
  timeUp = false;
  peep(400, 1200);
  timer();
  buttonClicked = true;
  startButton.classList.add('disabled');
  scoreSubmit.classList.add('disabled');
  game = setTimeout(() => {
    timeUp = true;
    timerDisplay.textContent = `0:20`;
    buttonClicked = false;
    startButton.classList.remove('disabled');
    scoreSubmit.classList.remove('disabled');
  }, 21000);
}

function bonk(e) {
  if (!e.isTrusted) return;
  score++;
  this.parentNode.classList.remove('up');
  scoreBoard.textContent = score;
}

function saveTheScore(e) {
  sort(items);
  e.preventDefault();
  const name = document.querySelector('[name=name]').value;
  const user = {
    name,
    score
  };

  items.push(user);
  populateList(items, itemsList);
  localStorage.setItem('items', JSON.stringify(items));
  this.reset();
}

function populateList(plates = [], platesList) {
  sort(items);
  platesList.innerHTML = plates
    .map((plate, i) => {
      if (i < 10)
        return `
    <li>
    <p >${1 + i}</p><p >${plate.name}</p><p >${plate.score}</p>
  </li>
  `;
    })
    .join('');
}
function sort(items) {
  items.sort((a, b) => (a.score < b.score ? 1 : -1));
}

sort(items);
populateList(items, itemsList);

drakes.forEach(drake => drake.addEventListener('click', bonk));
scoreForm.addEventListener('submit', saveTheScore);
