
import axios from 'axios';
import Notiflix from 'notiflix';

// Отримання елементів форми та поля вводу
const form = document.getElementById('search-form');
const input = form.querySelector('input[name="searchQuery"]');
const imageContainer = document.getElementById('gallery');
const data = response.data;
const images = data.hits;

// Ініціалізація Notiflix
Notiflix.Notify.init({
    position: 'center-top',
    width: '280px',
    distance: '10px',
    opacity: 1,
    background: '#eebf31',

});

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
        const apiKey = '40003919-9e959b48e473cb3c5dd9e8581'; // Замініть це на свій унікальний ключ доступу
        const response = await axios.get('https://pixabay.com/api/', {
            params: {
                key: apiKey,
                q: searchQuery,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: true,
            },
        });

        // 

        if (images.length === 0) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        } else {

            // Відображення результатів та показ контейнера з зображеннями

            imageContainer.innerHTML = ''; //Очистити контейнер перед виведенням нових зображень

            images.forEach((image) => {
                const imgElement = document.createElement('img');
                imgElement.src = image.webformatURL;
                imgElement.alt = image.tags;
                imageContainer.appendChild(imgElement);
            });
            imageContainer.style.display = 'block'; // Показати контейнер
            form.style.display = 'none'; // Сховати форму
        }
    } catch (error) {
        console.error('Error:', error);
        Notiflix.Notify.failure('An error occurred while fetching images. Please try again later.');
    }
});
