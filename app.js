const main = document.getElementById("main");
const apiKey = "32a3d801fc0850da7106b3a8f93cb390";

const weatherBox = document.getElementById("weather");
const weatherIcon = document.getElementById("weather-icon");
const descriptionWeather = document.getElementById("description-weather");
const temperature = document.getElementById("temperature");
const locationEl = document.getElementById("location");
const minTemp = document.getElementById("minTemp");
const maxTemp = document.getElementById("maxTemp");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");
const cloudiness = document.getElementById("cloudiness");
const statusLine = document.getElementById("statusLine");

const modalBackground = document.getElementById("modal-background");
const closeButton = document.getElementById("close");

const todayDate = document.getElementById("todayDate");
const clockTime = document.getElementById("clockTime");

function formatClock() {
    const now = new Date();
    todayDate.textContent = now.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric"
    });
    clockTime.textContent = now.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function openPermissionModal() {
    modalBackground.style.display = "block";
}

function closePermissionModal() {
    modalBackground.style.display = "none";
}

closeButton.addEventListener("click", closePermissionModal);
window.addEventListener("click", (event) => {
    if (event.target === modalBackground) {
        closePermissionModal();
    }
});

function setThemeByWeather(mainWeather) {
    const weather = String(mainWeather || "").toLowerCase();
    const body = document.body;

    if (weather.includes("rain") || weather.includes("drizzle")) {
        body.dataset.theme = "rain";
        return;
    }

    if (weather.includes("storm") || weather.includes("thunder")) {
        body.dataset.theme = "storm";
        return;
    }

    if (weather.includes("cloud")) {
        body.dataset.theme = "clouds";
        return;
    }

    if (weather.includes("clear")) {
        body.dataset.theme = "sun";
        return;
    }

    body.dataset.theme = "clear";
}

function setErrorMessage(message) {
    const error = document.createElement("p");
    error.textContent = message;
    error.style.background = "rgba(255,255,255,0.14)";
    error.style.border = "1px solid rgba(255,255,255,0.3)";
    error.style.color = "#ffffff";
    error.style.padding = "12px 14px";
    error.style.borderRadius = "12px";
    main.appendChild(error);
}

async function getWeatherByCoordinates(latitude, longitude) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Could not fetch weather details from API.");
    }

    return response.json();
}

function kmVisibility(value) {
    return `${(value / 1000).toFixed(1)} km`;
}

function displayWeather(data) {
    const temp = Math.round(data.main.temp);
    const min = Math.round(data.main.temp_min);
    const max = Math.round(data.main.temp_max);
    const feel = Math.round(data.main.feels_like);
    const weatherMain = data.weather[0].main;
    const weatherDesc = data.weather[0].description;
    const weatherIconCode = data.weather[0].icon;

    weatherIcon.innerHTML = `<img src="icons/${weatherIconCode}.png" alt="${weatherDesc}" />`;
    descriptionWeather.textContent = weatherDesc;
    temperature.textContent = `${temp}°C`;
    locationEl.textContent = `${data.name}, ${data.sys.country}`;

    minTemp.textContent = `${min}°C`;
    maxTemp.textContent = `${max}°C`;
    feelsLike.textContent = `${feel}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    wind.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
    pressure.textContent = `${data.main.pressure} hPa`;
    visibility.textContent = typeof data.visibility === "number" ? kmVisibility(data.visibility) : "--";
    cloudiness.textContent = `${data.clouds.all}%`;

    statusLine.textContent = `${weatherMain} now. High ${max}°C, low ${min}°C.`;
    setThemeByWeather(weatherMain);

    weatherBox.style.display = "grid";
}

async function getLocationAndWeather() {
    formatClock();

    if (!navigator.geolocation) {
        openPermissionModal();
        setErrorMessage("Geolocation is not supported by this browser.");
        statusLine.textContent = "Geolocation unavailable in this browser.";
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            closePermissionModal();
            try {
                const data = await getWeatherByCoordinates(position.coords.latitude, position.coords.longitude);
                displayWeather(data);
            } catch (error) {
                statusLine.textContent = "Unable to fetch latest weather right now.";
                setErrorMessage("Weather API request failed. Please try again in a moment.");
                console.error(error);
            }
        },
        () => {
            openPermissionModal();
            statusLine.textContent = "Location access blocked. Please enable it and refresh.";
            setErrorMessage("Location permission denied. Clear site permissions and refresh the page.");
        }
    );
}

setInterval(formatClock, 1000 * 30);
getLocationAndWeather();
