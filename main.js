var xhrRequest= new XMLHttpRequest();
var Marvel={
render:function(){
var url="https://gateway.marvel.com/v1/public/characters?ts=1&apikey=3c363594810db7c93043db43924370f4&hash=720f3c8716c24db91a63403c475994e9";
var MarvelContainer = document.getElementById("marvelContainer");


xhrRequest.onload = function(){
var responseJSON = JSON.parse(xhrRequest.response);
var string = "";
string+= "<div class='row'>";
for(var i=0; i<responseJSON.data.results.length; i++)
{
  var element=responseJSON.data.results[i];
  

  string+="<div class='col-md-3'>";
  string+=" <a href='"+element.urls[0].url+"'target='_blank'>"
  string+=" <img src='"+element.thumbnail.path+"/portrait_fantastic."+element.thumbnail.extension+"'/>";
  string+=" </a>";
  string+="<h3>" +element.name + "</h3>";
  string+="</div>";
  
  if((i+1)%4 == 0)
  {
   string+="</div>";
   string+= "<div class='row'>";
  }
}

 MarvelContainer.innerHTML = string;
   }
}
};
xhrRequest.open('get','https://gateway.marvel.com/v1/public/characters?ts=1&apikey=3c363594810db7c93043db43924370f4&hash=720f3c8716c24db91a63403c475994e9');
xhrRequest.send('');
Marvel.render();

// ********  Selecting the element from DOM *******
let searchBar = document.getElementById("search-bar");
let searchResults = document.getElementById("search-results");

// Adding eventListener to search bar
searchBar.addEventListener("input", () => searchHeros(searchBar.value));

// function for API call
async function searchHeros(textSearched) {
  // if there is no text written in the search bar then nothing is displayed
  if (textSearched.length == 0) {
    searchResults.innerHTML = ``;
    return;
  }

  // API call to get the data
  await fetch(
    `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${textSearched}&apikey=3c363594810db7c93043db43924370f4&hash=720f3c8716c24db91a63403c475994e9&ts=1`
  )
    .then((res) => res.json()) //Converting the data into JSON format
    .then((data) => showSearchedResults(data.data.results));
  //sending the searched results characters to show in HTML
}

// Function for displaying the searched results in DOM

function showSearchedResults(searchedHero) {
  
  let favouritesCharacterIDs = localStorage.getItem("favouritesCharacterIDs");
  if (favouritesCharacterIDs == null) {
    favouritesCharacterIDs = new Map();
  } else if (favouritesCharacterIDs != null) {
    
    favouritesCharacterIDs = new Map(
      JSON.parse(localStorage.getItem("favouritesCharacterIDs"))
    );
  }

  searchResults.innerHTML = ``;
  // count is used to count the result displayed in DOM
  let count = 1;

  // iterating the searchedHero array using for loop
  for (const key in searchedHero) {
    // if count <= 5 then only we display it in dom other results are discarded
    if (count <= 15) {
      let hero = searchedHero[key];
      // Appending the element into DOM
      searchResults.innerHTML += `
               <li class="flex-row single-search-result">
                    <div class="flex-row img-info">
                         <img src="${
                           hero.thumbnail.path +
                           "/portrait_medium." +
                           hero.thumbnail.extension
                         }" alt="">
                         <div class="hero-info">
                              <a class="character-info" href="moreinfo.html">
                                   <span class="hero-name">${hero.name}</span>
                              </a>
                         </div>
                    </div>
                    <div class="flex-col buttons">
                         <!-- <button class="btn"><i class="fa-solid fa-circle-info"></i> &nbsp; More Info</button> -->
                         <button class="btn add-to-fav-btn">${
                           favouritesCharacterIDs.has(`${hero.id}`)
                             ? '<i class="fa-solid fa-heart-circle-minus"></i>'
                             : '<i class="fa-solid fa-heart fav-icon"></i></button>'
                         }
                    </div>
                    <div style="display:none;">
                         <span>${hero.name}</span>
                         <span>${hero.description}</span>
                         <span>${hero.comics.available}</span>
                         <span>${hero.series.available}</span>
                         <span>${hero.stories.available}</span>
                         <span>${
                           hero.thumbnail.path +
                           "/portrait_uncanny." +
                           hero.thumbnail.extension
                         }</span>
                         <span>${hero.id}</span>
                         <span>${
                           hero.thumbnail.path +
                           "/landscape_incredible." +
                           hero.thumbnail.extension
                         }</span>
                         <span>${
                           hero.thumbnail.path +
                           "/standard_fantastic." +
                           hero.thumbnail.extension
                         }</span>
                    </div>
               </li>
               `;
    }
    count++;
  }
  // Adding the appropritate events to the buttons after they are inserted in dom
  events();
}

// Function for attacthing eventListener to buttons
function events() {
  let favouriteButton = document.querySelectorAll(".add-to-fav-btn");
  favouriteButton.forEach((btn) =>
    btn.addEventListener("click", addToFavourites)
  );

  let characterInfo = document.querySelectorAll(".character-info");
  characterInfo.forEach((character) =>
    character.addEventListener("click", addInfoInLocalStorage)
  );
}

// "Add to Favourites" button or "Remvove from favourites" button is clicked

function addToFavourites() {
  
  if (this.innerHTML == '<i class="fa-solid fa-heart fav-icon"></i>') {
    
    let heroInfo = {
      name: this.parentElement.parentElement.children[2].children[0].innerHTML,
      description: this.parentElement.parentElement.children[2].children[1]
        .innerHTML,
      comics: this.parentElement.parentElement.children[2].children[2]
        .innerHTML,
      series: this.parentElement.parentElement.children[2].children[3]
        .innerHTML,
      stories: this.parentElement.parentElement.children[2].children[4]
        .innerHTML,
      portraitImage: this.parentElement.parentElement.children[2].children[5]
        .innerHTML,
      id: this.parentElement.parentElement.children[2].children[6].innerHTML,
      landscapeImage: this.parentElement.parentElement.children[2].children[7]
        .innerHTML,
      squareImage: this.parentElement.parentElement.children[2].children[8]
        .innerHTML
    };

    
    let favouritesArray = localStorage.getItem("favouriteCharacters");

    
    if (favouritesArray == null) {
      
      favouritesArray = [];
    } else {
      
      favouritesArray = JSON.parse(localStorage.getItem("favouriteCharacters"));
    }

    let favouritesCharacterIDs = localStorage.getItem("favouritesCharacterIDs");

    if (favouritesCharacterIDs == null) {
      favouritesCharacterIDs = new Map();
    } else {
      
      favouritesCharacterIDs = new Map(
        JSON.parse(localStorage.getItem("favouritesCharacterIDs"))
      );
      // favouritesCharacterIDs = new Map(Object.entries(favouritesCharacterIDs));
    }

    
    favouritesCharacterIDs.set(heroInfo.id, true);
    

    // adding the above created heroInfo object to favouritesArray
    favouritesArray.push(heroInfo);

    // Storing the new favouritesCharactersID map to localStorage after converting to string
    localStorage.setItem(
      "favouritesCharacterIDs",
      JSON.stringify([...favouritesCharacterIDs])
    );
    // Setting the new favouritesCharacters array which now has the new character
    localStorage.setItem(
      "favouriteCharacters",
      JSON.stringify(favouritesArray)
    );

    // Convering the "Add to Favourites" button to "Remove from Favourites"
    this.innerHTML = '<i class="fa-solid fa-heart-circle-minus"></i>';

    // Displaying the "Added to Favourites" toast to DOM
    document.querySelector(".fav-toast").setAttribute("data-visiblity", "show");
    // Deleting the "Added to Favourites" toast from DOM after 1 seconds
    setTimeout(function () {
      document
        .querySelector(".fav-toast")
        .setAttribute("data-visiblity", "hide");
    }, 1000);
  }
  // For removing the character form favourites array
  else {
    // storing the id of character in a variable
    let idOfCharacterToBeRemoveFromFavourites = this.parentElement.parentElement
      .children[2].children[6].innerHTML;

    // getting the favourites array from localStorage for removing the character object which is to be removed
    let favouritesArray = JSON.parse(
      localStorage.getItem("favouriteCharacters")
    );

    // getting the favaourites character ids array for deleting the character id from favouritesCharacterIDs also
    let favouritesCharacterIDs = new Map(
      JSON.parse(localStorage.getItem("favouritesCharacterIDs"))
    );

    // will contain the characters which should be present after the deletion of the character to be removed
    let newFavouritesArray = [];
    // let newFavouritesCharacterIDs = [];

    // deleting the character from map using delete function where id of character acts as key
    favouritesCharacterIDs.delete(`${idOfCharacterToBeRemoveFromFavourites}`);

    // creating the new array which does not include the deleted character
    // iterating each element of array
    favouritesArray.forEach((favourite) => {
      // if the id of the character doesn't matches the favourite (i.e a favourite character) then we append it in newFavourites array
      if (idOfCharacterToBeRemoveFromFavourites != favourite.id) {
        newFavouritesArray.push(favourite);
      }
    });

    // Updating the new array in localStorage
    localStorage.setItem(
      "favouriteCharacters",
      JSON.stringify(newFavouritesArray)
    );

    localStorage.setItem(
      "favouritesCharacterIDs",
      JSON.stringify([...favouritesCharacterIDs])
    );

    // Convering the "Remove from Favourites" icon to "Add to Favourites"
    this.innerHTML = '<i class="fa-solid fa-heart fav-icon"></i>';

    // Displaying the "Remove from Favourites" toast to DOM
    document
      .querySelector(".remove-toast")
      .setAttribute("data-visiblity", "show");
    // Deleting the "Remove from Favourites" toast from DOM after 1 seconds
    setTimeout(function () {
      document
        .querySelector(".remove-toast")
        .setAttribute("data-visiblity", "hide");
    }, 1000);
  }
}

// Function which stores the info object of character for which user want to see the info
function addInfoInLocalStorage() {
  // This function basically stores the data of character in localStorage.
  // When user clicks on the info button and when the info page is opened that page fetches the heroInfo and display the data
  let heroInfo = {
    name: this.parentElement.parentElement.parentElement.children[2].children[0]
      .innerHTML,
    description: this.parentElement.parentElement.parentElement.children[2]
      .children[1].innerHTML,
    comics: this.parentElement.parentElement.parentElement.children[2]
      .children[2].innerHTML,
    series: this.parentElement.parentElement.parentElement.children[2]
      .children[3].innerHTML,
    stories: this.parentElement.parentElement.parentElement.children[2]
      .children[4].innerHTML,
    portraitImage: this.parentElement.parentElement.parentElement.children[2]
      .children[5].innerHTML,
    id: this.parentElement.parentElement.parentElement.children[2].children[6]
      .innerHTML,
    landscapeImage: this.parentElement.parentElement.parentElement.children[2]
      .children[7].innerHTML,
    squareImage: this.parentElement.parentElement.parentElement.children[2]
      .children[8].innerHTML
  };
  localStorage.setItem("heroInfo", JSON.stringify(heroInfo));
}