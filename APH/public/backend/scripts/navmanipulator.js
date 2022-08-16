"use strict";

var inserts = document.getElementById("arrow1");
var searchs = document.getElementById("arrow2");
var updates = document.getElementById("arrow3");

var insertTabs = document.getElementById("insertsTabs");
var searchTabs = document.getElementById("searchTabs");
var updateTabs = document.getElementById("updateTabs");

inserts.addEventListener("click", DisplayAndClear1);
searchs.addEventListener("click", DisplayAndClear2);
updates.addEventListener("click", DisplayAndClear3);

function DisplayAndClear1() {
	{
		if (insertTabs.style.display == "block"){
			insertTabs.style.display = "none";
            inserts.style.transform = "rotate(270deg)";
		}
		else {
			insertTabs.style.display = "block";
            inserts.style.transform = "rotate(0deg)";
		};
	};
};

function DisplayAndClear2() {
	{
		if (searchTabs.style.display == "block"){
			searchTabs.style.display = "none";
            searchs.style.transform = "rotate(270deg)";
		}
		else {
			searchTabs.style.display = "block";
            searchs.style.transform = "rotate(0deg)";
		};
	};
};

function DisplayAndClear3() {
	{
		if (updateTabs.style.display == "block"){
			updateTabs.style.display = "none";
            updates.style.transform = "rotate(270deg)";
		}
		else {
			updateTabs.style.display = "block";
            updates.style.transform = "rotate(0deg)";
		};
	};
};