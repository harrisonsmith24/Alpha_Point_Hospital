"use-strict";

var discover = document.getElementById("discoverMore");
var location = document.getElementById("locationContainer");
var learn = document.getElementById("learnContainer");


var learnBtn = document.getElementById("learnMore");
var discoverBtn = document.getElementById("disBtn");
var locationBtn = document.getElementById("locBtn");

discoverBtn.addEventListener("click", DisplayAndClear1);
locationBtn.addEventListener("click", DisplayAndClear2);
learnBtn.addEventListener("click", DisplayAndClear3);

function DisplayAndClear1() {
	
		if (discover.style.display == "block"){
			discover.style.display = "none";
		}
		else {
			discover.style.display = "block";
		};
	
};

function DisplayAndClear2() {
	
		if (location.style.display == "block"){
			location.style.display = "none";
		}
		else {
			location.style.display = "block";
		};
	
};

function DisplayAndClear3() {
	
		if (learn.style.display == "block"){
			learn.style.display = "none";
		}
		else {
			learn.style.display = "block";
		};
	
};