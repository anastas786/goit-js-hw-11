import Notiflix from 'notiflix';
import { performImageSearch } from './api.js';


const form = document.getElementById('search-form');
const input = form.querySelector('input[name="searchQuery"]');
const imageContainer = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');


Notiflix.Notify.init({
    position: 'center-top',
    width: '280px',
    distance: '10px',
    opacity: 1,
    background: '#eebf31',
});

let currentPage = 1;
const per_page = 40;
let totalPages = 0;
let imagesLoaded = 0;


function showForm() {
    form.style.display = 'block';
    imageContainer.style.display = 'none';
}

toggleLoadMoreButton(false);


function clearGallery() {
    imageContainer.innerHTML = '';
}


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

    imageContainer.innerHTML += imageCards.join('');
    imagesLoaded += images.length;
}


function toggleLoadMoreButton(visible) {
    loadMoreButton.style.display = visible ? 'block' : 'none';
}


form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const searchQuery = input.value.trim();

    if (searchQuery) {
        currentPage = 1;
        imagesLoaded = 0;
        toggleLoadMoreButton(false);
        clearGallery();
        showForm();

        try {
            const searchData = await performImageSearch(searchQuery, currentPage);
            const images = searchData.hits;
            totalPages = Math.ceil(searchData.totalHits / per_page);

            if (images.length === 0) {
                Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            } else {
                createImageCards(images);
                imageContainer.style.display = 'block';

                if (imagesLoaded < searchData.totalHits) {
                    toggleLoadMoreButton(true);
                } else {
                    toggleLoadMoreButton(false);
                    Notiflix.Notify.info("You've reached the end of search results.");
                }
            }
        } catch (error) {
            console.error('Error:', error);
            Notiflix.Notify.failure('An error occurred while fetching images. Please try again later.');
        }
    } else {
        Notiflix.Notify.failure('Please enter a valid search query.');
    }
});


loadMoreButton.addEventListener('click', async () => {
    const searchQuery = input.value.trim();
    currentPage++;

    if (currentPage <= totalPages) {
        try {
            const searchData = await performImageSearch(searchQuery, currentPage);
            const images = searchData.hits;

            if (images.length > 0) {
                createImageCards(images);

                if (imagesLoaded >= searchData.totalHits) {
                    toggleLoadMoreButton(false);
                    Notiflix.Notify.info("You've reached the end of search results.");
                }
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
