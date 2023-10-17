
import axios from 'axios';

export async function performImageSearch(searchQuery, page) {
    try {
        const apiKey = '40003919-9e959b48e473cb3c5dd9e8581';
        const response = await axios.get('https://pixabay.com/api/', {
            params: {
                key: apiKey,
                q: searchQuery,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: true,
                page: page,
                per_page: 40,
            },
        });

        const data = response.data;
        return {
            hits: data.hits,
            totalHits: data.totalHits
        };
    } catch (error) {
        throw error;
    }
}
