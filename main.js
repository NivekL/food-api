let keyWords = document.getElementById("keywords");
let ingredients = document.getElementById("ingredients");
let searchButton = document.getElementById("search");
let prevButton = document.getElementById("prev-button");
let nextButton = document.getElementById("next-button");
let content = document.getElementById("container");
let loadingImg = document.querySelector(".loading");
let paginationContent = document.getElementById("pagination");
let currentPage = document.getElementById("current-page");
let pageNum = 1;

searchButton.addEventListener("click", function() {
    pageNum = 1;
    fetchData(pageNum);
    prevButton.setAttribute("disabled", "true");
});
prevButton.addEventListener("click", prev);
nextButton.addEventListener("click", next);


async function fetchData() {
    try {
        loadingImg.classList.toggle("hidden");

        let response = await fetch("http://cors-anywhere.herokuapp.com/http://www.recipepuppy.com/api/?q=" + keyWords.value + "&i=" + ingredients.value.split(' ').join('+') + "&p=" + pageNum);
        if(!response.ok) {
            throw new Error("there was an error with the response " + response.status);
        } else {
            let data = await response.json();

            if(keyWords.value.trim() === "" && ingredients.value.trim() === "") {
                content.innerHTML = emptyResult();
                currentPage.innerText = pageNum;
            } else {
                content.innerHTML = displaySearchData(data);
                pagination(pageNum);
            }
            loadingImg.classList.toggle("hidden");
        }
    } catch (e) {
        console.log("error occured " + e);

        content.innerHTML = "<h2>Could not find what you are looking for or there are no more recipes. Try something else.</h2>"; 
    }
}

function displaySearchData(data) {
    let displayResults = "";
    let foods = data['results'];
    for(let food of foods) {
        displayResults += "<div class='food-container'>";
            displayResults += `
                <div class='food-thumbnail-container'>
                    <img src='${food.thumbnail}' >
                </div>
                <div class='food-info-container'>
                    <h2><a href='${food.href}' target='_blank'>${food.title}</a></h2>
                    <i>Ingredients: ${food.ingredients}</i>
                </div>`;
        displayResults += "</div>";
    }

    if(foods.length === 0) {
        nextButton.setAttribute("disabled", "true");
        return "<h2>Could not find what you are looking for</h2>";
    } else if(foods.length < 2) {
        nextButton.setAttribute("disabled", "true");
        return "<h2>You've reached the end of the results</h2>";
    } else {
        nextButton.removeAttribute("disabled");
    }

    return displayResults;
}

function emptyResult() {
    nextButton.setAttribute("disabled", "true");
    return "<h2>Type in ingredients (comma separated) or a keyword to get results.</h2>";
}

function prev() {
    pageNum--;

    if(pageNum === 1) {
        prevButton.setAttribute("disabled", "true");
    } else if(pageNum > 1 && prevButton.hasAttribute("disabled")) {
        prevButton.removeAttribute("disabled");
    }
    fetchData(pageNum);
}

function next() {
    pageNum++;

    if(pageNum === 1) {
        prevButton.setAttribute("disabled", "true");
    } else if(pageNum > 1 && prevButton.hasAttribute("disabled")) {
        prevButton.removeAttribute("disabled");
    }
    fetchData(pageNum);
}

function pagination(currentNum) {
    paginationContent.classList.remove("hidden");
    currentPage.innerText = currentNum;

}