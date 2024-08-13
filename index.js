// create elements game
import Words from "./words.js";

function buildGame() {
  document.body.classList.add("body");

  // create wrapper and childs
  const wrapper = document.createElement("div");
  wrapper.classList.add("wrapper");
  document.body.append(wrapper);

  const arrClasses = ["gallows", "quiz", "modal__wrappper"];
  arrClasses.forEach((item) => {
    const div = document.createElement("div");
    div.classList.add(item);
    wrapper.append(div);
  });

  // add elem in gallows block
  const gallows = document.querySelector(".gallows");
  gallows.insertAdjacentHTML(
    "beforeend",
    '<img class="gallows__img" src="assets/img/hangman-0.svg" alt="">'
  );
  gallows.insertAdjacentHTML(
    "beforeend",
    '<h1 class="gallows__title"><span>Hangman</span> Game</h1>'
  );

  // add elem in quiz block
  const quiz = document.querySelector(".quiz");
  quiz.insertAdjacentHTML("beforeend", '<ul class="quiz__word">');
  quiz.insertAdjacentHTML(
    "beforeend",
    '<h3 class="quiz__guesses">Hint: <b></b>'
  );
  quiz.insertAdjacentHTML(
    "beforeend",
    '<h3 class="quiz__guesses">Incorrect guesses: <b>0 / 6</b>'
  );
  quiz.insertAdjacentHTML("beforeend", '<div class="quiz__keyboard">');

  // add modal
  const modalWrapper = document.querySelector(".modal__wrappper");
  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.insertAdjacentHTML("beforeend", '<h3 class="modal__title">');
  modal.insertAdjacentHTML("beforeend", '<div class="modal__text"></div>');
  modal.insertAdjacentHTML(
    "beforeend",
    '<button class="modal__btn">Play Again</button>'
  );
  modalWrapper.append(modal);
}
// end buildGame()
buildGame();

window.addEventListener("load", () => {
  const keyboard = document.querySelector(".quiz__keyboard");
  const imgMan = document.querySelector(".gallows__img");
  let curWord;
  let count;
  let correctLetters;
  const maxCount = 6;
  const wordShow = document.querySelector(".quiz__word");
  const incorrectCounter = document.querySelectorAll(".quiz__guesses b")[1];
  const modal = document.querySelector(".modal__wrappper");
  const modalContent = document.querySelector(".modal");
  const playAgainBtn = document.querySelector(".modal__btn");

  // reset game
  const resetGame = () => {
    correctLetters = [];
    count = 0;
    modal.classList.remove("active");
    modalContent.classList.remove("active");
    wordShow.innerHTML = curWord
      .split("")
      .map(() => '<li class="quiz__letter"></li>')
      .join("");
    imgMan.src = `assets/img/hangman-${count}.svg`;
    incorrectCounter.innerText = `${count} / ${maxCount}`;
    keyboard
      .querySelectorAll("button")
      .forEach((btn) => (btn.disabled = false));
  };

  const gameOver = (isVictory) => {
    setTimeout(() => {
      const modalText = isVictory
        ? "You found the word:"
        : "The correct word was:";
      modal.classList.add("active");
      modalContent.classList.add("active");
      modal.querySelector(".modal__title").innerText = `${
        isVictory ? "You win" : "Game Over"
      }`;
      modal.querySelector(
        ".modal__text"
      ).innerHTML = `${modalText}  <b>${curWord}</b>`;
    }, 300);
  };

  const startGame = (btn, letter) => {
    if (curWord.includes(letter)) {
      [...curWord].forEach((curletter, i) => {
        if (curletter === letter) {
          correctLetters.push(curletter);
          wordShow.querySelectorAll("li")[i].innerText = curletter;
          wordShow.querySelectorAll("li")[i].classList.add("guessed");
        }
      });
    } else {
      count++;
      imgMan.src = `assets/img/hangman-${count}.svg`;
    }
    btn.disabled = true;
    incorrectCounter.innerText = `${count} / ${maxCount}`;

    if (count === maxCount) return gameOver(false);
    if (correctLetters.length === curWord.length) return gameOver(true);
  };

  // create keyboard
  for (let i = 97; i <= 122; i++) {
    const btn = document.createElement("button");
    btn.innerText = String.fromCharCode(i);
    keyboard.append(btn);
    btn.addEventListener("click", (e) =>
      startGame(e.target, String.fromCharCode(i))
    );
  }

  // Get random words
  const getRandomWord = () => {
    const { word, hint } = Words[Math.floor(Math.random() * Words.length)];
    console.log(word);
    curWord = word;
    document.querySelector(".quiz__guesses b").innerText = hint;
    resetGame();
  };

  getRandomWord();

  playAgainBtn.addEventListener("click", getRandomWord);
});
