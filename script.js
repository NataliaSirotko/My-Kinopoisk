// fetch

const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');
const urlPoster= 'https://image.tmdb.org/t/p/w500';

function apiSearch(event) { // функция поиска
    event.preventDefault();
    const searchText = document.querySelector('.form-control').value,
    server = 'https://api.themoviedb.org/3/search/multi?api_key=f81cdc3b33a949b56cd7d29a04d3129d&language=ru&query=' + searchText;
    
    if (searchText.trim().length === 0) { // убираем пробелы
        movie.innerHTML = '<h2 class="col-12 text-center text-danger">Поле поиска не должно быть пустым</h2>';
        return;
    }
    movie.innerHTML = '<div class="spinner"></div>';

    fetch(server)
        .then(function(value) {//response
            console.log(value.status);
            if (value.status !== 200) { // response.status
               // return Promise.reject(new Error('Ошибка'));
                return Promise.reject(value);
            }
            return value.json();
        })
        .then(function(output) {
            console.log(output);

            let inner ='';
            if (output.results.length === 0) {
                inner = '<h2 class="col-12 text-center text-info">По вашему запросу ничего не найдено</h2>';
            } // когда ерунду вводишь, чтоб выдало текст
            
            
            output.results.forEach(item => {
                let nameItem = item.name ||item.title;
                console.log(nameItem); 
                let dateItem = item.first_air_date || item.release_date || 'Информация отсутствует'; // все в массиве  есть results
                console.log(dateItem);
                const poster = item.poster_path ? urlPoster + item.poster_path : './noposter.png';
                let dataInfo = '';
                if (item.media_type !== 'person') dataInfo = `data-id="${item.id}" data-type="${item.media_type}"`;
                inner += `<div class="col-12 col-md-6 col-xl-3 item">
                            <img src="${poster}" class="img_poster img-fluid img-thumbnail" alt="${nameItem}" ${dataInfo}>
                            <h5>${nameItem}</h5>
                            <div><b>Дата выхода:</b> ${dateItem}</div>
                        </div>`;              
            });
            movie.innerHTML = inner;

            addEventMedia();
            
        })
        .catch(function(reason) {
            movie.innerHTML = 'Упс, что-то пошло не так';
            // console.log('error: ' + reason);
            console.error('error: ' + reason.status);
        });

}

searchForm.addEventListener('submit', apiSearch);

function addEventMedia() {
    const media = movie.querySelectorAll('img[data-id]');
    media.forEach((item) => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', showFullInfo);
    });
}

function showFullInfo() {
    console.log(this.dataset.type); // определить tv or movie
    let url ='';
    if (this.dataset.type === 'movie') {
        url = 'https://api.themoviedb.org/3/movie/' + this.dataset.id + '?api_key=f81cdc3b33a949b56cd7d29a04d3129d&language=ru';
    } else if (this.dataset.type === 'tv') {
        url = 'https://api.themoviedb.org/3/tv/' + this.dataset.id + '?api_key=f81cdc3b33a949b56cd7d29a04d3129d&language=ru';
    } else {
        movie.innerHTML = '<h2 class="col-12 text-center text-danger">Произошла ошибка, попробуйте позже</h2>';
    }

    console.log(url);

    fetch(url)
        .then(function(value) {
            console.log(value.status);
            if (value.status !== 200) { // response.status
               // return Promise.reject(new Error('Ошибка'));
                return Promise.reject(value);
            }
            return value.json();
        })
        .then((output) => { //function(output) - тогда не работает
            console.log(output);
            movie.innerHTML = `
            <h4 class="col-12 text-center text-info">${output.name || output.title}</h4>
            <div class="col-4 p-5">
                <img src="${urlPoster + output.poster_path}" class="img-fluid img-thumbnail mb-2" alt="${output.name || output.title}"></img>
                ${(output.homepage) ? `<p class='text-center'><a href="${output.homepage}" target="_blanc">Официаольная страница</a></p>` : ''}
                ${(output.imdb_id) ? `<p class='text-center'><a href="https://imdb.com/title/${output.imdb_id} "target="_blanc">Cтраница на IMDB.com</a></p>` : ''}
            </div>
            <div class="col-8">
                <p class="badge badge-danger p-3">Рейтинг: ${output.vote_average}</p>
                <p class="badge badge-info p-3">Статус: ${output.status}</p>
                <p class="badge badge-success p-3">Премьера: ${output.first_air_date || output.release_date}</p>

                ${(output.last_episode_to_air) ? `<p class="badge badge-warning p-3">${output.number_of_seasons} сезон ${output.last_episode_to_air.episode_number} серий вышло</p>` : ''}

                <p>Описание: ${output.overview}</p>
                <br>
                <div class='youtube'></div>
            </div>
            `;
           
           //getVideo(this.dataset.type, this.dataset.id);

        })
        .catch(function(reason) {
            movie.innerHTML = 'Упс, что-то пошло не так';
            // console.log('error: ' + reason);
            console.error('error: ' + reason.status);
            //console.error(reason || reason.status);
        });
        //console.log(this.dataset.type); 
        //getVideo(this.dataset.type, this.dataset.id);
}

document.addEventListener('DOMContentLoaded', function() { //функция для трендов
    fetch('https://api.themoviedb.org/3/trending/all/week?api_key=f81cdc3b33a949b56cd7d29a04d3129d&language=ru')  // day or week можно писать. это тренды фильмов
        .then(function(value) {
            console.log(value.status);
            if (value.status !== 200) { // response.status
               // return Promise.reject(new Error('Ошибка'));
                return Promise.reject(value);
            }
            return value.json();
        })
        .then(function(output) {
            console.log('output: ', output);

            let inner ='<h4 class="col-12 text-center text-info">Популярное за неделю</h4>';
            if (output.results.length === 0) {
                inner = '<h2 class="col-12 text-center text-info">По вашему запросу ничего не найдено</h2>';
            } // когда ерунду вводишь, чтоб выдало текст
            output.results.forEach(item => {
                let nameItem = item.name ||item.title;
                let mediaType = item.title ? 'movie' : 'tv';
                let dateItem = item.first_air_date || item.release_date || 'Информация отсутствует'; // все в массиве  есть results
                const poster = item.poster_path ? urlPoster + item.poster_path : './noposter.png';
                let dataInfo = `data-id="${item.id}" data-type="${mediaType}"`;
                inner += `<div class="col-12 col-md-6 col-xl-3 item">
                            <img src="${poster}" class="img_poster img-fluid img-thumbnail" alt="${nameItem}" ${dataInfo}>
                            <h5>${nameItem}</h5>
                            <div><b>Дата выхода:</b> ${dateItem}</div>
                        </div>`;
                });
            movie.innerHTML = inner;

            addEventMedia();
            
        })
        .catch(function(reason) {
            movie.innerHTML = 'Упс, что-то пошло не так';
            // console.log('error: ' + reason);
            console.error('error: ' + reason.status);
        });

});
