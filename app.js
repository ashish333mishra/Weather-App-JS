const apiKey = '32a3d801fc0850da7106b3a8f93cb390';
getLocation();
function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( position =>
            {
                //Geolocation Found 
                console.log(position.coords.latitude);
                console.log(position.coords.longitude);
                getWeatherByCoordinates(position.coords.latitude,position.coords.longitude);
            },
            () => {
                //Error finding Geolocation
                console.log("Error Finding Geolocation");
            });
    }
}
function getWeatherByCoordinates(latitude,longitude) {
    url = 'https://api.openweathermap.org/data/2.5/weather?lat='+latitude+'&lon='+longitude+'&appid='+apiKey;
    fetch(url)
    .then( response =>
    {
        let data = response.json();
        return data;
    })
    .then( data =>
    {
        displayWeather(data);
    });
}
function displayWeather(data) {
    console.log(data);
    let temperature = Math.floor(data.main.temp -273);
    let cityName = data.name;
    document.getElementById('temperature').innerHTML = temperature+'°C';
    document.getElementById('location').innerHTML = cityName;
    document.getElementById('weather-icon').innerHTML = `<img src="icons/${data.weather[0].icon}.png"/>`
    document.getElementById('description-weather').innerHTML =  data.weather[0].description;
}
