import icons from 'url:../../img/icons.svg';
import recipeView from './recipeView';
import view from './view';

class paginationView extends view {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    //page 1, and there are other pages
    if (curPage == 1 && numPages > 1) {
      return `
          <button data-goto="${
            curPage + 1
          }" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
         </button>
      `;
    }
    //last page
    if (curPage === numPages && numPages > 1) {
      return `
      <button data-goto="${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span> Page ${curPage - 1}</span>
      </button>
    `;
    }
    //other page
    if (curPage > 1 && curPage < numPages) {
      return `
        <button data-goto="${
          curPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span> Page ${curPage - 1}</span>
        </button>
        <button data-goto="${
          curPage + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
   `;
    }
    //page 1, and these are no other pages
    return '';
  }
  addHandlerClick(hanler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      // console.log(btn);
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      // console.log(goToPage);
      hanler(goToPage);
    });
  }
}

export default new paginationView();
