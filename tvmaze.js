/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(q) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  const res = await axios.get("https://api.tvmaze.com/search/shows", { params: { q } });
  const showArray = new Array;
  for (let showObj of res.data) {
    const show = showObj.show;
    const { id, name, summary } = show;
    const image = show.image.medium;
    showArray.push({ id, name, summary, image });
  }
  return showArray;
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    if (show.image === null) {
      show.image = "https://tinyurl.com/tv-missing";
    }

    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <img class="card-img-top" src="${show.image}">
             <p class="card-text">${show.summary}</p>
             <button class="episodeBtn" data-show-id="${show.id}">Episodes</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);

    $(`.episodeBtn[data-show-id="${show.id}"]`).on('click', handleClick);
  }
}

function populateEpisodes(episodes) {
  const $episodeList = $('#episodes-list');
  $episodeList.empty();
  for (let epiObj of episodes) {
    const { id, name, season, number } = epiObj;
    const $item = $(`<li>${name} (Season ${season}, number ${number})</li>`);
    $episodeList.append($item);
  }
  $('#episodes-area').show();
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  const res = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
  const episodeArray = new Array;
  for (let episodeObj of res.data) {
    const { id, name, season, number } = episodeObj;
    episodeArray.push({ id, name, season, number });
  }
  return episodeArray;
  // TODO: return array-of-episode-info, as described in docstring above
}

async function handleClick(event) {
  const showID = event.target.getAttribute('data-show-id');
  const episodeArray = await getEpisodes(showID);
  populateEpisodes(episodeArray);
}
