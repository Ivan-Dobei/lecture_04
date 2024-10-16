const characterList = document.querySelector(".character_list");
const loadingTitle = document.querySelector('.loading_text');
const previousBtn = document.querySelector(".previous_button");
const nextBtn = document.querySelector(".next_button");
const pagesCount = document.querySelector(".count_of_pages");
const modalBackground = document.querySelector(".modal_background");
const modalCloseBtn = document.querySelector(".modal_close_btn");
const modalImg = document.querySelector(".modal_img");
const modalName = document.querySelector(".modal_name");
const url = 'https://rickandmortyapi.com/api/character';
let nextPageUrl;
let previousPageUrl;

function getPageNumberFromUrl(url) {
    let position = url.indexOf('=');
    return parseInt(url.slice(position+1));
}

function showCharacterList(data) {
    let characterItems = '';
    data.results.forEach(character => {
        characterItems += `
        <li class="character_item" data-list=${character.id}>
            <img class="item_img" data-list=${character.id} src=${character.image}>
            <h3 class="item_name text" data-list=${character.id}>${character.name}</h3>
            <p class="item_description text" data-list=${character.id}>${character.status}</p>
        </li>
    `
    })
    characterList.innerHTML = characterItems;
}

function pagination (data) {
    const pageNumber = data.info.next ? getPageNumberFromUrl(data.info.next) - 1 : data.info.pages;
    pagesCount.innerHTML = `Page: ${pageNumber}`;

    if (data.info.next) {
        nextBtn.disabled = false;
        nextPageUrl = data.info.next;
        nextBtn.classList.remove("disabled_btn");
    } else {
        nextBtn.disabled = true;
        nextBtn.classList.add("disabled_btn");
    }

    if (data.info.prev) {
        previousBtn.disabled = false;
        previousPageUrl = data.info.prev;
        previousBtn.classList.remove("disabled_btn");
    } else {
        previousBtn.disabled = true;
        previousBtn.classList.add("disabled_btn");
    }
}

async function fetchCharacters(url) {
    characterList.classList.add("hide");
    loadingTitle.classList.remove("hide");

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        showCharacterList(data);
        pagination(data);

    } catch (error) {
        console.error('Fetch error:', error);
    } finally {
        loadingTitle.classList.add("hide");
        characterList.classList.remove("hide");
    }
}

async function modal(id) {
    modalBackground.classList.remove("hide");
    try {
        const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const user = await response.json();
        modalName.innerHTML = user.name;
        modalImg.src = user.image;


    } catch (error) {
        console.error('Fetch error:', error);
    }
}

fetchCharacters(url)
//fetchCharacter(url+'/2');
/*
nextBtn.addEventListener('click', () => {
    if (nextPageUrl) {
        fetchCharacters(nextPageUrl);
    }
});

previousBtn.addEventListener('click', () => {
    if (previousPageUrl) {
        fetchCharacters(previousPageUrl);
    }
});
*/

characterList.addEventListener('click', event => {
    event.stopPropagation();
    const item = event.target.dataset.list;
    item && modal(item);
})

modalCloseBtn.addEventListener('click', () => {
    modalBackground.classList.add("hide");
    console.log()
})

modalBackground.addEventListener('click', event => {
    let isBackground = event.target === modalBackground;
    isBackground && modalBackground.classList.add("hide");
})


