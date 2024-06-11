const APIKEY = "04c35731a5ee918f014970082a0088b1";
const APIURL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${APIKEY}&page=1`;
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI = `https://api.themoviedb.org/3/search/movie?&api_key=${APIKEY}&query=`;
const movieBox = document.querySelector("#movie-box");

let currentPage = 1;
let currentSearchTerm = "";
let isFetching = false;

const getMovies = async (url) => {
    if (isFetching) return;
    isFetching = true;
    const response = await fetch(url);
    const data = await response.json();
    
    showMovies(data);
    isFetching = false;
};

const showMovies = (data) => {
    data.results.forEach((result) => {
        const imagePath = result.poster_path === null ? "img/image-missing.png" : IMGPATH + result.poster_path;
        const box = document.createElement("div");
        box.classList.add("box");
        box.innerHTML = `
            <img src="${imagePath}" alt="${result.original_title}" />
            <div class="overlay">
                <div class="title"> 
                    <h2>${result.original_title}</h2>
                    <span>${result.vote_average}</span>
                </div>
                <h3>Overview:</h3>
                <p>${result.overview}</p>
            </div>
        `;
        movieBox.appendChild(box);
    });
};

const debounce = (func, delay) => {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
};

const handleSearch = debounce((event) => {
    const searchTerm = event.target.value;
    if (searchTerm !== "") {
        currentSearchTerm = searchTerm;
        currentPage = 1;
        movieBox.innerHTML = "";
        getMovies(`${SEARCHAPI}${searchTerm}&page=${currentPage}`);
    } else {
        currentSearchTerm = "";
        currentPage = 1;
        movieBox.innerHTML = "";
        getMovies(APIURL);
    }
}, 500);

document.querySelector("#search").addEventListener("keyup", handleSearch);

const loadMoreMovies = () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100 && !isFetching) {
        currentPage++;
        if (currentSearchTerm) {
            getMovies(`${SEARCHAPI}${currentSearchTerm}&page=${currentPage}`);
        } else {
            getMovies(`${APIURL}&page=${currentPage}`);
        }
    }
};

window.addEventListener("scroll", loadMoreMovies);

// Initial load
getMovies(APIURL);
