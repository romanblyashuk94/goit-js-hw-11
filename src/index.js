import searchImagesAPI from './js/api';
import createGalleryItemTl from './hbs/galleryItemTl.hbs';
import './scss/styles.scss';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import refs from './js/refs';

var lightbox = new SimpleLightbox('.gallery a');

const { searchFormRef, galleryContainerRef, loadMoreBtnRef } = refs;

searchFormRef.addEventListener('submit', onSearhFormSubmit);
loadMoreBtnRef.addEventListener('click', onLoadMoreBtnClick);

async function onSearhFormSubmit(e) {
  try {
    e.preventDefault();

    if (!e.target.elements.searchQuery.value) {
      Notify.failure('Search from is empty.');
      return;
    }

    searchImagesAPI.searchQuery = e.target.elements.searchQuery.value;
    searchImagesAPI.currentPage = 1;

    const responce = await searchImagesAPI.fetchImages();

    if (responce.hits.length === 0) {
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return;
    }

    Notify.success(`Hooray! We found ${responce.totalHits} images.`);

    galleryContainerRef.innerHTML = createGalleryItemTl(responce.hits);
    lightbox.refresh();
    loadMoreBtnRef.classList.remove('is-hidden');

    e.target.reset();
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMoreBtnClick() {
  try {
    searchImagesAPI.currentPage += 1;

    loadMoreBtnRef.classList.add('is-hidden');

    const responce = await searchImagesAPI.fetchImages();

    if (responce.hits.length !== 0) {
      galleryContainerRef.insertAdjacentHTML('beforeend', createGalleryItemTl(responce.hits));
      lightbox.refresh();

      loadMoreBtnRef.classList.remove('is-hidden');
    } else {
      Notify.failure("We're sorry, but you've reached the end of search results.");
    }
  } catch (error) {
    console.log(error);
  }
}
