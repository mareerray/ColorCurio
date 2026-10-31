// ColorCurio - Pagination helper

const PALETTES_PER_PAGE = 12;
let currentPage = 1;

export function resetPagination() {
    currentPage = 1;
}

export function paginate(items) {
    const totalPages = Math.max(
        1,
        Math.ceil(items.length / PALETTES_PER_PAGE)
    );

    if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    const startIndex = (currentPage - 1) * PALETTES_PER_PAGE;
    const itemsForPage = items.slice(
        startIndex,
        startIndex + PALETTES_PER_PAGE
    );

    return {
        items: itemsForPage,
        totalPages,
        currentPage
    };
}

export function renderPagination(totalItems, totalPages, onChange) {
    const pageNumbers = document.getElementById('page-numbers');
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');

    if (!pageNumbers || !prevButton || !nextButton) return;

    pageNumbers.innerHTML = '';

    for (let page = 1; page <= totalPages; page++) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `page-number ${page === currentPage ? 'is-active' : ''
            }`;
        button.textContent = page;
        button.setAttribute('aria-label', `Go to page ${page}`);
        button.setAttribute(
            'aria-current',
            page === currentPage ? 'page' : 'false'
        );

        button.addEventListener('click', () => {
            currentPage = page;
            onChange();
        });

        pageNumbers.appendChild(button);
    }

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;

    prevButton.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            onChange();
        }
    };

    nextButton.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            onChange();
        }
    };
}