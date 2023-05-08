import icons from 'url:../../img/icons.svg';
import { addBookMark } from '../model';
import view from './view';
import previewView from './previewView.js';

class BookmarksView extends view {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No Bookmarks yet. Find a nice recipe and bookmark it';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    // console.log(this._data);
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}
export default new BookmarksView();
