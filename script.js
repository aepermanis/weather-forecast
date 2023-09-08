
var ApiKey = 'bd1994739b70818283f6715e59b28bd9';

const searchBtn = document.querySelector('.search-btn');

const weatherFiveDays = document.querySelector('.weather-cards')

const mainWeather = document.querySelector('.data')

const shistory = document.querySelector('.search-history')

//this will return the HTML for the current day in the searched city
function mainDisplay(w, f) {
    return `<h3>City Name: ${f}</h3>
    <h5>Date:${w.dt_txt.split(" ")[0]} </h5>
    <h5>Temperature:${Math.round((w.main.temp -273.15)*(9/5)+ 32)}°F</h5>
    <h5>Wind:${Math.round(w.wind.speed * 2.237)} MPH</h5>
    <h5>Humidity:${w.main.humidity} %</h5>`

};

//this will return the HTML for the future forcasts
function createCard(w) {
    return `<li class = "day">
    <h3>Date:${w.dt_txt.split(" ")[0]}</h3>
    <h5>Temperature:${Math.round((w.main.temp -273.15)*(9/5)+ 32)} °F</h5>
    <h5>Wind:${Math.round(w.wind.speed * 2.237)} MPH</h5>
    <h5>Humidity:${w.main.humidity} %</h5>
    </li>`
};

//this will return the HTML for the search history buttons as they are being populated
function newSearch(c) {
   return `<div class = "history">
            <button class = "search">${c}</button>
            </div>`
};

//this will retrive the search history of a local user
let searchHist = [];
if(localStorage.getItem('history')){
searchHist = JSON.parse(localStorage.getItem('history'));
} 


function localData(z) {
    //this is the api call
    fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${z}&appid=${ApiKey}`).then(res => res.json()).then( (data) => {
        console.log(data);
        const forecasts = [];
        //this will add the uniue days of forecasts to an array
        const dayforecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!forecasts.includes(forecastDate)) {
                return forecasts.push(forecastDate);
            }
        })
        //this will add the search to the search history if it is not already included
        if(!searchHist.includes(z)){
            searchHist.push(z)
        }

        //this will clear an lingering HTML in the sections we want to populate
        weatherFiveDays.innerHTML = "";
        mainWeather.innerHTML = ""
        //we will save z as text
        let f = '' + z;
        //populates the first day and then the days ahead
        dayforecast.forEach(weather => {
        if(weather === dayforecast[0]){
            mainWeather.insertAdjacentHTML('beforeend', mainDisplay(weather, f))
        }else {
            weatherFiveDays.insertAdjacentHTML('beforeend', createCard(weather));
        };
        })
        //returns the search history to local storage
        localStorage.setItem('history', JSON.stringify(searchHist));
    });
}

//this is the same function as above but with out interacting with search history
function reLocalData(x) {
    fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${x}&appid=${ApiKey}`).then(res => res.json()).then( (data) => {
        console.log(data);
        const forecasts = [];
        const dayforecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!forecasts.includes(forecastDate)) {
                return forecasts.push(forecastDate);
            }
        })
        weatherFiveDays.innerHTML = "";
        mainWeather.innerHTML = ""

        dayforecast.forEach(weather => {
            if(weather === dayforecast[0]){
                mainWeather.insertAdjacentHTML('beforeend', mainDisplay(weather, x))
            }else {
                weatherFiveDays.insertAdjacentHTML('beforeend', createCard(weather));
            };
            })
}
)};

//populates the search history
shistory.innerHTML = ""
searchHist.forEach(city =>{
    shistory.insertAdjacentHTML('beforeend', newSearch(city));
})

//allows the search history to populate results
shistory.addEventListener("click", (event)=> {
    if(event.target.className === "search"){
        console.log(event.target.innerHTML);
        reLocalData(event.target.innerHTML)
    }
});

//populates results when user clicks search after input
searchBtn.addEventListener('click', ()=>{
    const input = document.getElementById('city-text').value.trim();
    console.log(input);
    localData(input);
    document.getElementById('city-text').value = '';
 }); 

