const API_KEY = "276d77cca2d9b10d8c1db2f9c8ca6f26";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  name: string;
}

interface ITv {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  name: string;
}

interface ISearch {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  name: string;
  vote_average: number;
  media_type: string;
  release_date: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IGetTvsResult {
  page: number;
  results: ITv[];
  total_pages: number;
  total_results: number;
}

export interface IGetSearch {
  page: number;
  results: ISearch[];
  total_pages: number;
  total_results: number;
}

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko`).then((response) =>
    response.json()
  );
}

export function getMovieDetail(movieId: string | undefined) {
  return fetch(`${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}&language=ko`).then((response) =>
    response.json()
  );
}

export function getUpcomingMovies() {
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}

export function getTvs() {
  return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}&language=ko`).then((response) =>
    response.json()
  );
}

export function getTvDetail(tvId: string | undefined) {
  return fetch(`${BASE_PATH}/tv/${tvId}?api_key=${API_KEY}&language=ko`).then((response) =>
    response.json()
  );
}

export function getSearch(keyword: string) {
  return fetch(
    `${BASE_PATH}/search/multi?api_key=${API_KEY}&language=ko&query=${keyword}&page=1&include_adult=false`
  ).then((response) => response.json());
}
