
var ApiKey = 'bd1994739b70818283f6715e59b28bd9';

const searchBtn = document.querySelector('.search-btn');

const weatherFiveDays = document.querySelector('.weather-cards')

const mainWeather = document.querySelector('.data')

const shistory = document.querySelector('.search-history')


function mainDisplay(w, f) {
    return `<h3>City Name: ${f}</h3>
    <h5>Date:${w.dt_txt.split(" ")[0]} </h5>
    <h5>Temperature:${Math.round((w.main.temp -273.15)*(9/5)+ 32)}°F</h5>
    <h5>Wind:${Math.round(w.wind.speed * 2.237)} MPH</h5>
    <h5>Humidity:${w.main.humidity} %</h5>`

};


function createCard(w) {
    return `<li class = "day">
    <h3>Date:${w.dt_txt.split(" ")[0]}</h3>
    <h5>Temperature:${Math.round((w.main.temp -273.15)*(9/5)+ 32)} °F</h5>
    <h5>Wind:${Math.round(w.wind.speed * 2.237)} MPH</h5>
    <h5>Humidity:${w.main.humidity} %</h5>
    </li>`
};

function newSearch(c) {
   return `<div class = "history">
            <button class = "search">${c}</button>
            </div>`
};

let searchHist = [];
if(localStorage.getItem('history')){
searchHist = JSON.parse(localStorage.getItem('history'));
} 


function localData(z) {
    fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${z}&appid=${ApiKey}`).then(res => res.json()).then(data => {
        console.log(data);
        const forecasts = [];
        const dayforecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!forecasts.includes(forecastDate)) {
                return forecasts.push(forecastDate);
            }
        })

        if(!searchHist.includes(z)){
            searchHist.push(z)
        }
        weatherFiveDays.innerHTML = "";
        mainWeather.innerHTML = ""
        let f = '' + z;
        z.value = '';
        dayforecast.forEach(weather => {
        if(weather === dayforecast[0]){
            mainWeather.insertAdjacentHTML('beforeend', mainDisplay(weather, f))
        }else {
            weatherFiveDays.insertAdjacentHTML('beforeend', createCard(weather));
        };
        })
        localStorage.setItem('history', JSON.stringify(searchHist));
    });
}

shistory.innerHTML = ""
searchHist.forEach(city =>{
    shistory.insertAdjacentHTML('beforeend', newSearch(city));
})



searchBtn.addEventListener('click', ()=>{
    const input = document.getElementById('city-text').value.trim();
    console.log(input);
    localData(input);
 }); 


 const recentSearch = document.querySelectorAll('.search');

 for(let i = 0; i > recentSearch.length; i++) {
   recentSearch[i].addEventListener('click', (event) => {
    const oldSearch = event.target.innerText;
    console.log(oldSearch);
    localData(oldSearch); 
});
 }