
import Notiflix from 'notiflix';
import { performImageSearch } from './api.js';

// Отримання елементів форми та поля вводу
const form = document.getElementById('search-form');
const input = form.querySelector('input[name="searchQuery"]');
const imageContainer = document.querySelector('.gallery');


// Ініціалізація Notiflix
Notiflix.Notify.init({
    position: 'center-top',
    width: '280px',
    distance: '10px',
    opacity: 1,
    background: '#eebf31',
});

// Функція для показу форми та схову контейнера з зображеннями
function showForm() {
    form.style.display = 'block';
    imageContainer.style.display = 'none';
}

// При завантаженні сторінки показати форму
showForm();

let currentPage = 1;
const loadMoreButton = document.querySelector('.load-more');

// Функція для показу/приховування кнопки "Load more"
function toggleLoadMoreButton(visible) {
    loadMoreButton.style.display = visible ? 'block' : 'none';
}

// Приховати кнопку "Load more" при запуску
toggleLoadMoreButton(false);

// Функція для очищення галереї
function clearGallery() {
    imageContainer.innerHTML = '';
}

// Функція для створення та додавання карток зображень в галерею
function createImageCards(images) {
    const imageCards = images.map((image) => {
        return `
            <div class="photo-card">
                <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy">
                <div class="info">
                    <p class="info-item"><b>Likes:</b> ${image.likes}</p>
                    <p class="info-item"><b>Views:</b> ${image.views}</p>
                    <p class="info-item"><b>Comments:</b> ${image.comments}</p>
                    <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
                </div>
            </div>
        `;
    });

    imageContainer.innerHTML = imageCards.join('');
}


let totalHits = 0; // Инициализируем totalHits
const per_page = 40; // Задаем количество изображений на страницу
let totalPages = 0; // Инициализируем totalPages

// Обработчик формы
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const searchQuery = input.value.trim();

    if (searchQuery) {
        currentPage = 1;
        toggleLoadMoreButton(false);

        try {
            const searchData = await performImageSearch(searchQuery, currentPage);
            const images = searchData.hits;
            totalHits = searchData.totalHits; // Обновляем totalHits

            if (images.length === 0) {
                Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
                showForm();
            } else {
                if (currentPage === 1) {
                    clearGallery();
                }

                createImageCards(images);

                imageContainer.style.display = 'block';

                totalPages = Math.ceil(totalHits / per_page); // Обновляем totalPages

                if (images.length < 40) {
                    toggleLoadMoreButton(false);
                    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
                } else {
                    toggleLoadMoreButton(true);
                }
            }
        } catch (error) {
            console.error('Error:', error);
            Notiflix.Notify.failure('An error occurred while fetching images. Please try again later.');
            showForm();
        }
    } else {
        Notiflix.Notify.failure('Please enter a valid search query.');
    }
});

// Обработчик кнопки "Load more"
loadMoreButton.addEventListener('click', async () => {
    const searchQuery = input.value.trim();
    currentPage++;

    if (currentPage <= totalPages) {
        try {
            const searchData = await performImageSearch(searchQuery, currentPage);
            const images = searchData.hits;

            if (images.length > 0) {
                createImageCards(images);
                imageContainer.style.display = 'block';
            } else {
                toggleLoadMoreButton(false);
                Notiflix.Notify.info("You've reached the end of search results.");
            }
        } catch (error) {
            console.error('Error:', error);
            Notiflix.Notify.failure('An error occurred while fetching images. Please try again later.');
        }
    } else {
        toggleLoadMoreButton(false);
        Notiflix.Notify.info("You've reached the end of search results.");
    }
});

// ...




// Обработчик кліку на кнопку "Load more"
loadMoreButton.addEventListener('click', async () => {
    const searchQuery = input.value.trim();
    currentPage++;

    if (currentPage <= totalPages) {
        try {
            const searchData = await performImageSearch(searchQuery, currentPage);
            const images = searchData.hits;

            if (images.length > 0) {
                createImageCards(images);
                imageContainer.style.display = 'block';
            } else {
                toggleLoadMoreButton(false);
                Notiflix.Notify.info("You've reached the end of search results.");
            }
        } catch (error) {
            console.error('Error:', error);
            Notiflix.Notify.failure('An error occurred while fetching images. Please try again later.');
        }
    } else {
        toggleLoadMoreButton(false);
        Notiflix.Notify.info("You've reached the end of search results.");
    }
});
