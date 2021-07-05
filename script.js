const lowestScore = document.getElementById("bestScore");
const score = document.getElementById("score");
const gameContainer = document.getElementById("game");
lowestScore.textContent = JSON.parse(localStorage.getItem("score"));
let hasFirstClickedCard = false;
let firstCard = null;
let secondCard = null;
score.innerHTML = 0;
let noClicking = false;
let cardsFlipped = 0;
let totalScore = undefined;
const COLORS = [
	"red",
	"blue",
	"green",
	"orange",
	"purple",
	"red",
	"blue",
	"green",
	"orange",
	"purple",
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
	let counter = array.length;

	// While there are elements in the array
	while (counter > 0) {
		// Pick a random index
		let index = Math.floor(Math.random() * counter);

		// Decrease counter by 1
		counter--;

		// And swap the last element with it
		let temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
	}

	return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
	for (let color of colorArray) {
		// create a new div
		const newDiv = document.createElement("div");

		// give it a class attribute for the value we are looping over
		newDiv.classList.add(color);

		// call a function handleCardClick when a div is clicked on
		newDiv.addEventListener("click", handleCardClick);

		// append the div to the element with an id of game
		gameContainer.append(newDiv);
	}
}

// TODO: Implement this function!
function handleCardClick(event) {
	// you can use event.target to see which element was clicked
	//console.log(event.target);
	//console.log(event.target.classList);

	if (noClicking) return;

	// if the card has been clicked, nothing will happen
	if (event.target.classList.contains("firstCardColor")) return;

	score.innerHTML = parseInt(score.innerHTML) + 1;
	//change background color of card
	let color = event.target.className;
	event.target.style.backgroundColor = color;

	// adding class name of firstCardColor to 1st and 2nd clicked card's
	event.target.classList.add("firstCardColor");

	//creating variable holding the total number of cards clicked (with class name firstCardColor)
	let clickCount = document.querySelectorAll("div .firstCardColor").length;
	//console.log(clickCount);

	//define firstCard and secondCard
	if (!hasFirstClickedCard) {
		hasFirstClickedCard = true;
		firstCard = event.target;
	} else {
		hasFirstClickedCard = false;
		secondCard = event.target;
	}

	//  if two cards have clicked and the classes do not match.
	//  Make no change to background-color
	if (clickCount < 2) return;
	if (clickCount == 2 && firstCard.className == secondCard.className) {
		cardsFlipped += 2;
		firstCard.classList.remove("firstCardColor");
		secondCard.classList.remove("firstCardColor");
		setTimeout(function () {
			if (cardsFlipped === COLORS.length) {
				// Storing the score in Local Storage only when the score is less then localStorage.
				if (
					parseInt(score.innerHTML) < JSON.parse(localStorage.getItem("score"))
				)
					localStorage.setItem("score", JSON.stringify(score.innerHTML));
				alert("Game over!");
			}
			document.getElementById("buttonLogo").style.pointerEvents = "auto";
		}, 1000);
	} else {
		noClicking = true;
		setTimeout(() => {
			firstCard.classList.remove("firstCardColor");
			secondCard.classList.remove("firstCardColor");
			firstCard.style.backgroundColor = "";
			secondCard.style.backgroundColor = "";
			noClicking = false;
		}, 1000);
	}
}

// when the DOM loads
document
	.getElementsByClassName("container")[0]
	.addEventListener("click", () => {
		createDivsForColors(shuffledColors);
		document.getElementsByClassName("container")[0].style.display = "none";
		document.getElementById("scoreBoard").style.display = "block";
		document.getElementById("buttonLogo").style.display = "block";
		document.getElementById("buttonLogo").style.pointerEvents = "none";
	});
