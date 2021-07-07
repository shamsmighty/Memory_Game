const gameContainer = document.getElementById("game");
const select = document.getElementById("menu");
const reset = document.getElementById("reset");
const highScore = document.getElementById("highscore");
highScore.textContent = parseInt(localStorage.getItem("score"));

const gifs = [
	"./gifs/1.gif",
	"./gifs/1.gif",
	"./gifs/2.gif",
	"./gifs/2.gif",
	"./gifs/3.gif",
	"./gifs/3.gif",
	"./gifs/4.gif",
	"./gifs/4.gif",
	"./gifs/5.gif",
	"./gifs/5.gif",
	"./gifs/6.gif",
	"./gifs/6.gif",
	"./gifs/7.gif",
	"./gifs/7.gif",
	"./gifs/8.gif",
	"./gifs/8.gif",
	"./gifs/9.gif",
	"./gifs/9.gif",
	"./gifs/10.gif",
	"./gifs/10.gif",
	"./gifs/11.gif",
	"./gifs/11.gif",
	"./gifs/12.gif",
	"./gifs/12.gif",
];

let shuffledGifs = [];

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

/**
 * Shuffle Gifs
 */
function createDivGifs(gifArray) {
	for (let gifs of gifArray) {
		const newDiv = document.createElement("div");

		newDiv.classList.add(gifs);
		const imgDiv = document.createElement("img");

		newDiv.appendChild(imgDiv);
		newDiv.addEventListener("click", handleCardClick);
		gameContainer.append(newDiv);
	}
}

let hasFlippedCard = false;
let firstClick, secondClick;
let lockBoard = false;
let numberOfMatchedDiv = 0;
let currentScore = 0;

// TODO: Implement this function!
function handleCardClick(event) {
	// you can use event.target to see which element was clicked

	if (lockBoard) return;

	//current score increment
	currentScore += 1;
	score.innerText = currentScore;

	if (!hasFlippedCard) {
		if (event.target.children[0].src == undefined) return;
		hasFlippedCard = true;
		firstClick = event.target.children[0];

		event.target.children[0].src = event.target.className;
		event.target.children[0].style.width = "100%";

		firstClick.style.display = "initial";

		//prevent double click on same div
		firstClick.parentNode.removeEventListener("click", handleCardClick);
		firstClick.removeEventListener("click", handleCardClick);

		//Reset button implementation
		reset.addEventListener("click", () => {
			location.reload();
		});
	} else {
		hasFlippedCard = false;
		secondClick = event.target.children[0];
		console.log(event.target.className);
		event.target.children[0].style.width = "100%";
		event.target.children[0].src = event.target.className;

		secondClick.style.display = "initial";

		//prevent double click on same div
		secondClick.parentNode.removeEventListener("click", handleCardClick);
		secondClick.removeEventListener("click", handleCardClick);

		checkMatch();
		if (numberOfMatchedDiv == shuffledGifs.length) {
			highScoreCheck();
			highScore.innerHTML = localStorage.getItem("highScore");
			popUpMessage("Game Over and Click Anywhere!!!!!");
			reset.addEventListener("click", () => {
				location.reload();
			});
		}
	}
}

/**
 * checkMatch() will make background white and add eventListeners back to firstClick and SecondClick
 */
function checkMatch() {
	if (secondClick.parentNode.className != firstClick.parentNode.className) {
		lockBoard = true;

		setTimeout(() => {
			firstClick.style.display = "none";
			secondClick.style.display = "none";

			firstClick.addEventListener("click", handleCardClick);
			firstClick.parentElement.addEventListener("click", handleCardClick);

			secondClick.parentElement.addEventListener("click", handleCardClick);

			secondClick.addEventListener("click", handleCardClick);
			lockBoard = false;
		}, 1000);
	} else {
		numberOfMatchedDiv += 2;
	}
}

/**
 * generate function will addListener to select element
 */
function generate() {
	highScore.innerHTML = localStorage.getItem("highScore");
	select.addEventListener("change", runEvent);
}

function runEvent(e) {
	if (e.target.value.toLowerCase() == "easy") {
		shuffledGifs = shuffle(easy());
		removeAllChildNodes(gameContainer);
		createDivGifs(shuffledGifs);
	} else if (e.target.value.toLowerCase() == "medium") {
		shuffledGifs = shuffle(medium());
		removeAllChildNodes(gameContainer);
		createDivGifs(shuffledGifs);
	} else {
		shuffledGifs = shuffle(hard());
		removeAllChildNodes(gameContainer);
		createDivGifs(shuffledGifs);
	}
}
//pop us message function
function popUpMessage(message) {
	document.querySelector("#popUp-info p").innerText = message;
	document.querySelector("#popUp").style.display = "block";
	window.addEventListener("click", (event) => {
		if (event.target == document.querySelector("#popUp")) {
			document.querySelector("#popUp").style.display = "none";
		}
	});
}

/**
 * check and compute highScore.
 */
function highScoreCheck() {
	if (
		localStorage.getItem("highScore") == undefined ||
		localStorage.getItem("highScore") == 0
	) {
		localStorage.setItem("highScore", JSON.stringify(currentScore));
	} else if (currentScore < localStorage.getItem("highScore")) {
		localStorage.setItem("highScore", JSON.stringify(currentScore));
	}
}

function easy() {
	return gifs.filter((card, index) => {
		return index < 12;
	});
}

function medium() {
	return gifs.filter((card, index) => {
		return index < 16;
	});
}

function hard() {
	return gifs.filter((card, index) => {
		return index < 24;
	});
}

function removeAllChildNodes(parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
}

generate();
