export const bookmarkView = function (bookmark) {
  const bookmarkUl = document.querySelector(".bookmarks__list");
  bookmarkUl.innerHTML = "";
  bookmark.map((bm) => {
    const html = `
        <li class="preview">
            <a class="preview__link" href="#${bm.id}">
            <figure class="preview__fig">
                <img
                src="${bm.image_url}"
                alt="${bm.title}"
                style="height: 100px; width: 100px"
                />
            </figure>
            <div class="preview__data">
                <h4 class="preview__title">${bm.title}</h4>
                <p class="preview__publisher">${bm.publisher}</p>
            </div>
            </a>
        </li>
    `;

    bookmarkUl.insertAdjacentHTML("afterbegin", html);
  });
};

export const noBookmark = function () {
  const bookmarkUl = document.querySelector(".bookmarks__list");

  const html = `<li class='noBookmarkMsg'>No bookmark 🍒 found </li>`;
  bookmarkUl.insertAdjacentHTML("beforeend", html);
};
