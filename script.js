const wrapper = document.querySelector(".wrapper");
let searchInput = document.querySelector("input");
let removeIcon = document.querySelector(".search span");
let infoText = document.querySelector(".info-text");
let volume = document.querySelector(".word i");
let synonyms = document.querySelector(".synonyms .list");
let audio;
function data(result, word) {
  if (result.title) {
    infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
  } else {
    wrapper.classList.add("active");
    let definitions = result[0].meanings[0].definitions[0];
    let phontetics = `${result[0].meanings[0].partOfSpeech}    /${result[0].phonetics[0].text}/`;
    document.querySelector(".word p").innerText = word;
    document.querySelector(".word span").innerText = phontetics;
    document.querySelector(".meaning span").innerText = definitions.definition;
    document.querySelector(".example span").innerText = definitions.example;
    audio = new Audio("https:" + result[0].phonetics[0].audio);
    if (definitions.synonyms[0] === undefined) {
      synonyms.parentElement.style.display = "none";
    } else {
      synonyms.parentElement.style.display = "block";
      synonyms.innerHTML = "";
      for (let i = 0; i < 5; i++) {
        let tag = `<span onclick="search('${definitions.synonyms[i]}')">${definitions.synonyms[i]},</span>`;
        tag =
          i == 4
            ? (tag = `<span onclick="search('${definitions.synonyms[i]}')">${definitions.synonyms[4]}</span>`)
            : tag;
        synonyms.insertAdjacentHTML("beforeend", tag);
      }
    }
  }
}
function search(word) {
  fetchApi(word);
  searchInput.value = word;
}
function fetchApi(word) {
  wrapper.classList.remove("active");
  infoText.style.color = "#000";
  infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;

  let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  fetch(url)
    .then((response) => response.json())
    .then((result) => data(result, word))
    .catch(() => {
      infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
    });
}

searchInput.addEventListener("keyup", (e) => {
  let word = e.target.value.replace(/\s+/g, " ");
  if (e.key == "Enter" && word) {
    fetchApi(word);
  }
});
volume.addEventListener("click", (e) => {
  e.target.style.color = "#4D59FB";
  setTimeout(() => {
    e.target.style.color = "#999";
  }, 1000);
});

removeIcon.addEventListener("click", () => {
  searchInput.value = " ";
  searchInput.focus();
  wrapper.classList.remove("active");
  infoText.style.color = "#9a9a9a";
  infoText.innerText =
    "Type any existing word and press enter to get meaning, example, synonyms, etc.";
});
