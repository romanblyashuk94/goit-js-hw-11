import axios from 'axios';

const API_KEY = '27706383-91c8b42ba8d974d916db19321';

axios.defaults.baseURL = 'https://pixabay.com/api/';

export default {
  searchQuery: '',
  currentPage: 1,
  pageSize: 40,

  fetchImages() {
    return axios
      .get(
        `?key=${API_KEY}&q=${this.searchQuery}&page=${this.currentPage}&per_page=${this.pageSize}&image_type=photo&orientation=horizontal`,
      )
      .then(responce => responce.data);
  },
};
