import images from './images/*.svg';
import { jobListings } from './data';

let filters = [];

function getHeading({ company, statuses }) {
  return `
    <div class="job-heading">
      <h2>${company}</h2>
      ${statuses.length > 0 ? statuses.map(status => {
        if (status === 'New!') {
          return `<span class="status new">${status.toUpperCase()}</span>`;
        }
        if (status === 'Featured') {
          return `<span class="status featured">${status.toUpperCase()}</span>`;
        }
      }).join('') : ''}
    </div>
  `;
}

function getPostDetails({ postDate, type }) {
  const details = [ postDate, ...type ];

  if (!details.length) {
    return;
  }

  return `
    <ul class="job-details">
      ${details.map(detail => (
        `<li><span>${detail}</span></li>`
      )).join('<span>&bull;</span>')}
    </ul>
  `;
}

function getSecondaryDetails({ role, level, languages }) {
  const details = [role, level, ...languages];

  if (!details.length) {
    return;
  }

  return `
  <ul class="secondary-details">
    ${details.map(detail => (
      `<li><button type="button" class="detail-button" name="${detail}">${detail}</button></li>`
    )).join('')}
  </ul>
  `;
}

function handleFilterSelect(event) {
  filters.push(event.target.name);
  
  renderElements();
}

function removeFilter(event) {
  filters = filters.filter(item => item !== event.target.value);

  renderElements();
}

function clearAllFilters() {
  filters.length = 0;
  renderElements();
}

function getJobPostings() {
  const mainDiv = document.querySelector('.main');

  const jobs = jobListings.filter(job => {
      if (filters.length === 0) {
        return true;
      }
      let show = true;
      const details = [job.role, job.level, ...job.languages];
      filters.forEach(filter => {
        if (!details.includes(filter)) {
          show = false;
        }
      });
      return show;
    })
    .map(job => {
    return `
      <article class="job-posting">
        <img src="./${images[job.logo]}" alt="${job.company} logo" />
        <section class="main-section">
          ${getHeading(job)}
          <a href="#" aria-label=${job.title}><h3>${job.title}</h3></a>
          ${getPostDetails(job)}
        </section>
        <hr />
        <section class="secondary-section">
          ${getSecondaryDetails(job)}
        </section>
      </article>
    `;
  })

  mainDiv.innerHTML = jobs.join('');
}

function addSelectListeners() {
  const buttons = document.querySelectorAll('.detail-button');
  buttons.forEach(btn => {
    btn.onclick = handleFilterSelect;
  });
}

function addFiltersBar() {
  const mainContent = document.querySelector('.main');
  if (!mainContent) {
    return;
  }

  const filterBar = document.createElement('div');
  filterBar.classList.add('filter-bar');

  const filtersContainer = document.createElement('div');
  filtersContainer.classList.add('filters-container');

  filters.forEach(item => {
    const button = document.createElement('button');
    button.classList.add('filter-button')
    button.textContent = item;

    const remove = document.createElement('span');
    remove.classList.add('filter-remove');
    remove.textContent = 'X';
    remove.value = item;

    button.onclick = removeFilter;

    button.appendChild(remove);

    filtersContainer.appendChild(button);
  })

  filterBar.appendChild(filtersContainer);

  const clearButton = document.createElement('button');
  clearButton.classList.add('clear-button');
  clearButton.textContent = 'Clear';
  clearButton.onclick = clearAllFilters;
  filterBar.appendChild(clearButton);

  mainContent.insertAdjacentElement('afterbegin', filterBar);
}

function renderElements() {
  getJobPostings();
  addSelectListeners()
  if (filters.length > 0){
    addFiltersBar();
  }
}

renderElements();