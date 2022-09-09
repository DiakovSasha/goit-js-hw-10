import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';

const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};

const DEBOUNCE_DELAY = 300;
const debounce = require('lodash.debounce');

refs.input.addEventListener('input', debounce(onEnter, DEBOUNCE_DELAY));

function onEnter(event) {
  event.preventDefault();

  const searchQuery = event.target.value.trim();

  console.log(searchQuery);
  if (searchQuery === '') {
    clear();
    clearCountry();
    return;
  }

  fetchCountries(searchQuery)
    .then(data => {
      console.log(data);
      if (data.length > 10) {
        clear();
        clearCountry();
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      if (data.length === 1) {
        clear();
        data.map(renderCountry);
        return;
      }
      if (data.length >= 2 && data.length <= 10) {
        clearCountry();
        data.map(allFindedCountries);
      }
    })
    .catch(error => {
      clear();
      clearCountry();
      Notiflix.Notify.failure(error);
    });
}

function renderCountry(country) {
  const languagesEl = country.languages.map(language => language.name).join();
  const markUp = `<div class="wrapper">
    <img
      src="${country.flags.svg}"
      class="country__img"
      alt="${country.name}"
    />
  <div class="inner">
  <h1 class="country__title">${country.name}</h1>
    <p>Capital: <span class="country__span">${country.capital}</span></p>
    <p>Population: <span class="country__span"> ${country.population}</span></p>
    <p>Languages: <span class="country__span"> ${languagesEl}</span></p>
  </div>
</div>
;`;
  refs.info.innerHTML = markUp;
}
function allFindedCountries(country) {
  const markUpCoutries = `<li class = "country_item"><img src=${country.flags.svg} class='country__img--min' alt=${country.name} /><h2>${country.name}</h2></li>`;
  refs.list.innerHTML += markUpCoutries;
}

function clear() {
  refs.list.innerHTML = '';
}

function clearCountry() {
  refs.info.innerHTML = '';
}
