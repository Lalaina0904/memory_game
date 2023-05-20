let moves = document.getElementById("moves");
let time = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.getElementById("game_container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls");
let cards;
let interval;
let firstCard = false;
let secondCard = false;

const items = [
    {
        name: "panda",
        image: "/assets/imgs/panda.png",
    },
    {
        name: "chloe",
        image: "/assets/imgs/chloe.png",
    },
    {
        name: "grizz",
        image: "/assets/imgs/grizz.png",
    },
    {
        name: "sherif",
        image: "/assets/imgs/serif.png",
    },
    {
        name: "polaire",
        image: "/assets/imgs/polaire.png",
    },
    {
        name: "nom",
        image: "/assets/imgs/Nom-Nom.png",
    },
    {
        name: "babyPanda",
        image: "/assets/imgs/baby_panda.png",
    },
    {
        name: "babyGrizz",
        image: "/assets/imgs/baby_grizz.png",
    },
    {
        name: "babyPolaire",
        image: "/assets/imgs/baby_polaire.png",
    },
];

let seconds = 0,
    minutes = 0;

let movesCount = 0,
    winCount = 0;

/**
 * funct° which calculating time and reset format
 */
const timeGenerator = () => {
    //seconds
    seconds += 1;

    //minutes
    if (seconds >= 60) {
        minutes += 1;
        seconds = 0;
    }

    // time format
    let secondsValue = seconds < 10 ? `0${seconds}` : seconds;

    let minutesValues = minutes < 10 ? `0${minutes}` : minutes;

    time.innerHTML = `<span>Time: </span>${minutesValues}:${secondsValue}`;
};

/**
 * function calculating moves
 */
const movesCounter = () => {
    movesCount += 1;
    moves.innerHTML = `<span>Moves: </span>${movesCount}`;
};

//pick random objects from the items array
const generateRandom = (size = 4) => {
    //temporary array
    let tempArray = [...items];
    //initialize cardValues Array
    let cardValues = [];
    //size should be (4*4 matrix)/2 since pairs of objects would exist
    size = (size * size) / 2;
    //random objects selection
    for (let i = 0; i < size; i++) {
        const randomIndex = Math.floor(Math.random() * tempArray.length);
        cardValues.push(tempArray[randomIndex]);
        //once selected, remove the object from temporary array
        tempArray.splice(randomIndex, 1);
    }
    return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
    gameContainer.innerHTML = "";
    cardValues = [...cardValues, ...cardValues];
    //simple shuffle
    cardValues.sort(() => Math.random() - 0.5);
    for (let i = 0; i < size * size; i++) {
        /*
		 - 	create Cards
		 -	before => front side (contains question mark)
		 -	after => back side (contains actual image)
		 -	data-card-values is a custom attribute which stores the names of the cards to match later
		 */
        gameContainer.innerHTML += `
			<div class="card-container" data-card-value="${cardValues[i].name}">
				<div class="card-before">
					?
				</div>
				<div class="card-after">
					<img src="${cardValues[i].image}" />
				</div>
			</div>
		`;
    }

    //Grid
    gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

    //Cards
    cards = document.querySelectorAll(".card-container");

    cards.forEach((card) => {
        card.addEventListener("click", () => {
            //If selected card is not matched yet, then only run (i.e already matched card when clicked will be ignored)
            if (!card.classList.contains("matched")) {
                //flip the clicked card
                card.classList.add("flip");

                //if it is the firstCard (!firstCard since firstCard is initially false)
                if (!firstCard) {
                    //so current card will become firstCard
                    firstCard = card;
                    firstCardValue = card.getAttribute("data-card-value");
                } else {
                    //increment moves since user selected second card
                    movesCounter();
                    //secondCard and value
                    secondCard = card;
                    let secondCardValue = card.getAttribute("data-card-value");

                    if (firstCardValue == secondCardValue) {
                        //if both cards match and matched class, so these cards would be ignored next time
                        firstCard.classList.add("matched");
                        secondCard.classList.add("matched");
                        //set firstCard to false since next card would be first
                        firstCard = false;
                        //WinCount increment as user found a correct match
                        winCount += 1;

                        //Check if winCount  == half of cardValues
                        if (winCount == Math.floor(cardValues.length / 2)) {
                            result.innerHTML = `<h2>YOU WON</h2> <h4>Moves: ${movesCount}</h4>`;
                            stopGame();
                        }
                    } else {
                        //if the cards don't match
                        //flip the cards back to normal
                        let [tempFirst, tempSecond] = [firstCard, secondCard];
                        firstCard = false;
                        secondCard = false;
                        let delay = setTimeout(() => {
                            tempFirst.classList.remove("flip");
                            tempSecond.classList.remove("flip");
                        }, 800);
                    }
                }
            }
        });
    });
};

interval = setInterval(timeGenerator, 100);

//start game
startButton.addEventListener("click", () => {
    movesCount = 0;
    time = 0;

    //controls and buttons visibility
    controls.classList.add("hide");
    stopButton.classList.remove("hide");
    startButton.classList.add("hide");

    //Start timer
    // interval = setInterval(timeGenerator(), 100);

    //Initial moves
    moves.innerHTML = `<span>Moves: </span> ${movesCount}`;

    initializer();
});

//stop game
stopButton.addEventListener(
    "click",
    (stopGame = () => {
        controls.classList.remove("hide");
        stopButton.classList.add("hide");
        startButton.classList.remove("hide");
        clearInterval(interval);
    })
);

//Initialize values and func calls
const initializer = () => {
    result.innerText = "";
    winCount = 0;
    let cardValues = generateRandom();
    console.log(cardValues);
    matrixGenerator(cardValues);
};
