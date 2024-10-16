const body = document.querySelector('#root');
const characterList = document.querySelector(".character_list");
const modalLoading = document.querySelector('#modal_loading');
const modalBackground = document.querySelector(".modal_background");
const modalCloseBtn = document.querySelector(".modal_close_btn");
const modalContent = document.querySelector('.modal');
const itemImg = document.querySelector(".modal__item_img");
const itemName = document.querySelector(".modal__item_name");
const itemStatus = document.querySelector(".modal__item_status");
const url = 'https://rickandmortyapi.com/api/character';
let nextPageUrl = url;

function showCharacterList(data) {
    let characterItems = '';
    console.log(data.results)
    data.results.forEach(character => {
        characterItems += `
        <li class="character_item" data-list=${character.id}>
            <img class="item_img" data-list=${character.id} src=${character.image}>
            <h3 class="item_name text" data-list=${character.id}>${character.name}</h3>
            <p class="item_description text" data-list=${character.id}>${character.status}</p>
        </li>
    `;
    });
    characterList.innerHTML += characterItems;
}

async function fetchCharacters(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        showCharacterList(data);
        nextPageUrl = data.info.next;

    } catch (error) {
        console.error('Fetch error:', error);
    }
}

async function modal(id) {
    modalBackground.classList.remove("hide");
    body.classList.add("overflow");
    modalContent.classList.add("hide");
    modalLoading.classList.remove("hide");
    try {
        const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const user = await response.json();
        itemName.innerHTML = user.name;
        itemStatus.innerHTML = user.status;
        itemImg.src = user.image;

    } catch (error) {
        console.error('Fetch error:', error);
    } finally {
        modalContent.classList.remove("hide");
        modalLoading.classList.add("hide");
    }
}

fetchCharacters(url);

characterList.addEventListener('click', event => {
    event.stopPropagation();
    const item = event.target.dataset.list;
    item && modal(item);
});

modalCloseBtn.addEventListener('click', () => {
    modalBackground.classList.add("hide");
    body.classList.remove("overflow");
});

modalBackground.addEventListener('click', event => {
    if (event.target === modalBackground) {
        modalBackground.classList.add("hide");
        body.classList.remove("overflow");
    }
});

window.addEventListener('scroll', () => {
    let isEndOfScroll = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;

    if (isEndOfScroll) {
        fetchCharacters(nextPageUrl);
    }
});

