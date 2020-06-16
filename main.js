//ZMIENNE GLOBALNE
const cardsDeal = []; //wylosowana tablica kart
const cardsDivs = document.querySelectorAll(".card"); //divy kart
const activeCards = []; //2 aktywne karty
let firstCardNr;
let turnCounter = 0;
let pairsLeft = 9;
let lock = false; //blokuje klikanie po kliknieciu w 2 karty
let score = 0;
const hpaudio = new Audio("audio/hpaudio.wav")

//FUNKCJE

const countScore = () => {

  if (turnCounter < 10) {
    score += 10;
  } else if (turnCounter < 20) {
    score += 5;
  } else if (turnCounter < 30) {
    score += 2;
  } else {
    score += 1;
  }

  document.querySelector(".game-score").textContent = `Game score: ${score}`;
}

const hide2Cards = (nr1, nr2) => {
  cardsDivs[nr1].style.opacity = "0";
  cardsDivs[nr2].style.opacity = "0";
  pairsLeft--;

  if (pairsLeft === 0) {
    document.querySelector(".board").innerHTML = `<div class="end-message"><p>Congratulations!</p>
    <p>You won and earned ${score} points! </p><div class="reset" style="cursor:pointer;" onclick="location.reload()"><a>Again?</a></span></div>`;
    document.querySelector(".score").innerHTML = "";
  }

  lock = false;
  firstCardNr = ""; //zeruje z pamieci numer karty

}

const restore2Cards = (nr1, nr2) => {
  cardsDivs[nr1].style.backgroundImage = "url(img/cover.png)";
  cardsDivs[nr2].style.backgroundImage = "url(img/cover.png)";
  cardsDivs[nr1].classList.add("card");
  cardsDivs[nr2].classList.add("card");
  cardsDivs[nr1].classList.remove("cardA");
  cardsDivs[nr2].classList.remove("cardA");

  lock = false;
  firstCardNr = "";
}

const revealCard = function (nr) {
  let cardOpacity = cardsDivs[nr].style.opacity;

  if (lock === false && cardOpacity !== "0") { //zabezpiecza przed klikaniem w wiecej niz 2 karty

    if (firstCardNr === nr) return; //przy podwojnym kliknieciu w 1 karte

    //pobranie ściezki kliknietej karty
    const imgPath = `url("img/${cardsDeal[nr]}")`;

    cardsDivs[nr].style.backgroundImage = imgPath;
    cardsDivs[nr].classList.add("cardA");
    cardsDivs[nr].classList.remove("card");

    if (activeCards.length === 0) {

      //pierwsza karta
      activeCards[0] = cardsDeal[nr];
      firstCardNr = nr;

    } else {

      //druga karta
      lock = true;
      activeCards[1] = cardsDeal[nr];

      if (activeCards[0] === activeCards[1]) {
        //odkryto identyczne karty
        setTimeout(function () {
          hide2Cards(firstCardNr, nr)
        }, 1000)
        countScore();
      } else {
        //odkryto różne karty
        setTimeout(function () {
          restore2Cards(firstCardNr, nr)
        }, 1000)
      }

      activeCards.length = 0; //zerowanie tablicy
      turnCounter++; //update countera
      document.querySelector(".turn-counter").textContent = `Turn counter: ${turnCounter}`;
    }
  }
}

const prepareCards = function () {
  const cards = [];

  //generowanie generowanie tablicy ["c0.png", "c0.png", "c1.png", "c1.png"...itd]
  for (let i = 0, j = 0; i < cardsDivs.length / 2; i++, j = j + 2) {
    let cardName = `c${i}.png`;
    cards[j] = cardName;
    cards[j + 1] = cardName;
  }

  //losowanie kart
  let maxIndex = 17;
  for (let i = 0; i < cardsDivs.length; i++) {
    const index = Math.floor(Math.random() * maxIndex);
    cardsDeal[i] = cards[index];
    cards[index] = cards[maxIndex];
    maxIndex--
  }
}

const playMusic = function () {
  this.classList.toggle('pause-btn');
  if (this.classList.contains('pause-btn')) {
    // music plays
    console.log('pauza');
    hpaudio.play();
    hpaudio.loop = true;
  } else {
    //music pause
    hpaudio.currentTime = 0;
    hpaudio.pause();
  }
}

const playGame = function () {
  prepareCards();
}
playGame();

//przydzielanie div'om numeru
cardsDivs.forEach((card, i) => {
  card.addEventListener("click", function () {
    revealCard(i)
  })
});

// button animation
document.querySelector('.button').addEventListener('click', playMusic)