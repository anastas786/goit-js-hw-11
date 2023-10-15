import axios from 'axios';
import Notiflix from 'notiflix';

// Отримання елементів форми та поля вводу
const form = document.getElementById('search-form');
const input = form.querySelector('input[name="searchQuery"]');
const imageContainer = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

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

// Функція для показу/приховування кнопки "Load more"
function toggleLoadMoreButton(visible) {
    loadMoreButton.style.display = visible ? 'block' : 'none';
}

// Приховати кнопку "Load more" при запуску
toggleLoadMoreButton(false);

// Обробка події подачі форми
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const searchQuery = input.value.trim();
    currentPage = 1; // Скинути значення сторінки при новому пошуку
    toggleLoadMoreButton(false); // Приховати кнопку "Load more"
    performImageSearch(searchQuery);
});

// Обробник кліку на кнопку "Load more"
loadMoreButton.addEventListener('click', () => {
    form.dispatchEvent(new Event('submit'));
});

// Функція для виконання HTTP-запиту
async function performImageSearch(searchQuery) {
    try {
        const apiKey = '40003919-9e959b48e473cb3c5dd9e8581';
        const response = await axios.get('https://pixabay.com/api/', {
            params: {
                key: apiKey,
                q: searchQuery,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: true,
                page: currentPage,
                per_page: 40,
            },
        });

        const data = response.data;
        const images = data.hits;

        if (images.length === 0) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            showForm();
        } else {
            if (currentPage === 1) {
                clearGallery();
            }

            createImageCards(images);

            imageContainer.style.display = 'block';

            currentPage++;

            toggleLoadMoreButton(images.length === 40);
        }
    } catch (error) {
        console.error('Error:', error);
        Notiflix.Notify.failure('An error occurred while fetching images. Please try again later.');
        showForm();
    }
}

// Функція для очищення галереї
function clearGallery() {
    imageContainer.innerHTML = '';
}

// Функція для створення та додавання карток зображень в галерею
function createImageCards(images) {
    images.forEach((image) => {
        const photoCard = document.createElement('div');
        photoCard.classList.add('photo-card');

        const imgElement = document.createElement('img');
        imgElement.src = image.webformatURL;
        imgElement.alt = image.tags;
        imgElement.loading = 'lazy';

        const info = document.createElement('div');
        info.classList.add('info');

        const likes = document.createElement('p');
        likes.classList.add('info-item');
        likes.innerHTML = `<b>Likes:</b> ${image.likes}`;

        const views = document.createElement('p');
        views.classList.add('info-item');
        views.innerHTML = `<b>Views:</b> ${image.views}`;

        const comments = document.createElement('p');
        comments.classList.add('info-item');
        comments.innerHTML = `<b>Comments:</b> ${image.comments}`;

        const downloads = document.createElement('p');
        downloads.classList.add('info-item');
        downloads.innerHTML = `<b>Downloads:</b> ${image.downloads}`;

        info.appendChild(likes);
        info.appendChild(views);
        info.appendChild(comments);
        info.appendChild(downloads);

        photoCard.appendChild(imgElement);
        photoCard.appendChild(info);

        imageContainer.appendChild(photoCard);
    });
}
