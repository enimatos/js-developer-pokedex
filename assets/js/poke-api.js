
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name
    pokemon.height = pokeDetail.height
    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

 
    // Captura as habilidades
    pokemon.abilities = pokeDetail.abilities.map((abilitySlot) => abilitySlot.ability.name);

    // Captura os movimentos (pega apenas alguns para evitar excesso de informações)
    pokemon.moves = pokeDetail.moves.slice(0, 3).map((moveSlot) => moveSlot.move.name);
    
    // Captura a espécie
    pokemon.species = pokeDetail.species.name;

    // Captura a imagem do Pokémon
    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;

    // Captura a home (outra versão da imagem do Pokémon)
    pokemon.home = pokeDetail.sprites.other.home.front_default;
    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default; 

    return pokemon;
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}
