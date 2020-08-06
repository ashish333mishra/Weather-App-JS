let main = document.getElementById("main");
const apiKey = '32a3d801fc0850da7106b3a8f93cb390';

getLocation();

function geoLocationPrompt(){
    let background = document.getElementById("modal-background");
    var close = document.getElementById("close");

    window.onload = function() {
        // background.classList.add("modal-background");
        background.style.display = "block";
    }

    close.onclick = function() {
        // background.classList.remove("modal-background");
        background.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == background) {
            // background.classList.remove("modal-background");
            background.style.display = "none";
        }
    }

    return;
}



function getLocation(){

    geoLocationPrompt();

    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( async (position) =>
            {
                console.log(position.coords.latitude);
                console.log(position.coords.longitude);
                let data = await getWeatherByCoordinates(position.coords.latitude,position.coords.longitude);
                displayWeather(data);
            },
            () => {
                console.log("Error Finding Geolocation");
                let error = document.createElement("p");
                let message = document.createTextNode("This application did not receive permission to use location data and as a result will not work as intended. Please clear permissions and refresh");
                error.appendChild(message);
                main.appendChild(error);
                error.style.backgroundColor = "white";
                error.style.padding = "10px";

            });
    }
}

//converted function to async await syntax
async function getWeatherByCoordinates(latitude,longitude) {
    url = 'https://api.openweathermap.org/data/2.5/weather?lat='+latitude+'&lon='+longitude+'&appid='+apiKey;
    let response = await fetch(url);
    let data = await response.json();
    console.log("Data :", data)
    return data;
}
function displayWeather(data) {
    let weatherBox = document.getElementById('weather'); //to only render the weather container when the user gives location permission
    let temperature = Math.floor(data.main.temp - 273);
    let minTemp = Math.floor(data.main.temp_min - 273);
    let maxTemp = Math.floor(data.main.temp_max - 273);
    let cityName = data.name;
    weatherBox.style.display = "flex";
    document.getElementById('temperature').textContent = temperature+'°C';
    document.getElementById('location').textContent = cityName;
    document.getElementById('weather-icon').innerHTML = `<img src="icons/${data.weather[0].icon}.png"/>`
    console.log(document.getElementById('description-weather'))
    document.getElementById('description-weather').textContent =  data.weather[0].description;
    document.getElementById("minTemp").textContent = `Min Tempurature : ${minTemp}°C`;
    document.getElementById("maxTemp").textContent = `Max Tempurature : ${maxTemp}°C`;
    return;
}
