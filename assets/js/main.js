const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');

const maxRecords = 151;
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" data-number="${pokemon.number}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>
            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map(type => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
                <img class="imgLink" src="${pokemon.photo}" alt="${pokemon.name}" data-number="${pokemon.number}">
            </div>
        </li>
    `;
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('');
        pokemonList.innerHTML += newHtml;
    });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordsWithNextPage = offset + limit;

    if (qtdRecordsWithNextPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItens(offset, newLimit);
        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItens(offset, limit);
    }
});

async function openPopup(pokemonNumber) {
    try {
        const pokemon = await pokeApi.getPokemonDetail({ url: `https://pokeapi.co/api/v2/pokemon/${pokemonNumber}` });
        
        if (!pokemon) return;
        
        const popup = document.createElement('div');
        popup.className = 'popup';
        popup.innerHTML = `
            <div class="popup-content">
                <div class="principal">
                    <h2>${pokemon.name}</h2>
                    <span class="number">#${pokemon.number}</span>
                </div>
                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map(type => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>
                </div>
                <div class="height"><strong>Altura:</strong> ${pokemon.height}</div>
                <div class="moves">
                    <strong>Movimentos:</strong>
                    <ul class="ul-lista">
                    ${pokemon.moves.length ? pokemon.moves.map(move => `<li class="move">${move}</li>`).join('') : 'Sem dados'}</ul>
                </div>
                <div class="abilities">
                    <strong>Habilidades:</strong> 
                    <ul class="ul-lista">
                    ${pokemon.abilities.length ? pokemon.abilities.map(ability => `<li class="ability">${ability}</li>`).join('') : 'Sem dados'}</ul>
                </div>
                <div class="home">${pokemon.home ? `<img src="${pokemon.home}" alt="Home ${pokemon.name}" class="homeImage">` : 'Não disponível'}</div>
                <button class="closeButton">Fechar</button>
            </div>
        `;
        
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        
        document.body.append(popup, overlay);
        
        const close = () => closePopup(popup, overlay);
        popup.querySelector('.closeButton').addEventListener('click', close);
        overlay.addEventListener('click', close);
    } catch (error) {
        console.error("Erro ao carregar detalhes do Pokémon:", error);
    }
}

function closePopup(popup, overlay) {
    popup.remove();
    overlay.remove();
}

document.addEventListener('click', event => {
    if (event.target.classList.contains('imgLink')) {
        const pokemonElement = event.target.closest('.pokemon');
        const pokemonNumber = pokemonElement.dataset.number;
        
        if (pokemonNumber) {
            openPopup(pokemonNumber);
        }
    }
});
