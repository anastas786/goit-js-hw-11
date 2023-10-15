
import axios from 'axios';
import Notiflix from 'notiflix';


// Отримання елементів форми та поля вводу
const form = document.getElementById('search-form');
const input = form.querySelector('input[name="searchQuery"]');
const imageContainer = document.querySelector('.gallery');
const imageModal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const modalClose = document.getElementById('modal-close');

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

// Обробка події подачі форми
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const searchQuery = input.value.trim();

    if (searchQuery === '') {
        Notiflix.Notify.failure('Please enter a search query.');
        return;
    }

    // Основний код для виконання HTTP-запиту
    try {
        const apiKey = '40003919-9e959b48e473cb3c5dd9e8581';
        const response = await axios.get('https://pixabay.com/api/', {
            params: {
                key: apiKey,
                q: searchQuery,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: true,
            },
        });

        const data = response.data;
        const images = data.hits;

        if (images.length === 0) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            showForm();
        } else {
            // Очистити галерею перед відображенням нових зображень
            clearGallery();

            // Створити та додати картки зображень в галерею
            createImageCards(images);

            // Показати галерею
            imageContainer.style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
        Notiflix.Notify.failure('An error occurred while fetching images. Please try again later.');
        showForm();
    }
});

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

