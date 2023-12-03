/* -----------------------------------------------
/* JS script to get weather info from qWeather API
/* By LtgX
/* 
/* v1.0.1  2023.12.1
/* ----------------------------------------------- */

let userKeyLock = false;
let RefreshBtn = true;
let AutoDelayRefresh = 18000000;
let UserDelayRefresh = 300000;
let WeatherData = {
    apiKey: 'a5055cffdd594c968fe0b78cd9f652d3',
    cityName: '海珠',
    UpDataTime: '',
    cityNameStr: '',
    cityCode: '',
    latLon: '',
};
const NowTemp = document.getElementById('NowTemp');
const NowIcon = document.getElementById('NowIcon');
const NowWeather = document.getElementById('NowWeather');
const feelsLike = document.getElementById('feelsLike');
//const Speed = document.getElementById('Speed');
//const Humidity = document.getElementById('Humidity');
//const Visibility = document.getElementById('Visibility');
//const bar = document.getElementById('bar');
//const dew = document.getElementById('dew');
const timeCity = document.getElementById('timeCity');
const watCity = document.getElementById('watCity');
//const AirQuality = document.getElementById('AirQuality');
const hitokoto_author = document.getElementById('hitokoto_author');

// Check LocalStorage Data
checkLocalStorageData();
new Vue({
    el: '#but',
    methods: {
        showAlert() {
            if (RefreshBtn) {
                RefreshBtn = false;
                const nowTime = Date.now(); // Record time
                if ((nowTime - WeatherData.UpDataTime > UserDelayRefresh) || userKeyLock) {
                    getNowWeather(); // Get weather infomation

                } else {
                    const remainingTime = Math.floor((UserDelayRefresh - (nowTime - WeatherData.UpDataTime)) / 1000 / 60);
                    RefreshBtn = true;
                }
            }
        },
        showWarningAlert(message) {
            this.$message({
                showClose: true,
                dangerouslyUseHTMLString: true,
                message: message,
                type: 'warning',
            });
        },
    }
});
function getNowWeather() { // Request
    console.log(`Requesting weather information...`)
    but.classList.add('move');
    fetch(`https://geoapi.qweather.com/v2/city/lookup?location=广州&key=${WeatherData.apiKey}&lang=en`) // Update ciey id
        .then(response => response.json())
        .then(UpDataCityName)
        .then(() => fetch(`https://devapi.qweather.com/v7/weather/now?location=101280101&key=${WeatherData.apiKey}&lang=en`)) // Get Realtime weather
        .then(response => response.json())
        .then(updateWeatherData)
        .then(() => fetch(`https://devapi.qweather.com/v7/air/now?location=101280101&key=${WeatherData.apiKey}&lang=en`)) // Get AQ
        .then(response => response.json())
        .then(updateAirQualityData)
        .then(() => fetch('https://v1.hitokoto.cn/?&c=d&c=k&c=i')) // By LtgX
        .then(response => response.json())
        .then(updateHitokotoData)
        .then(DataRequestOver)
        .catch(error => {
            but.classList.remove('move');
            console.error('Error when requesting weather information:', error);
            app2.click();
            RefreshBtn = true;
        });
}
function DataRequestOver() {
    LocalCache(); // Data storage
    RenderData();
    but.classList.remove('move');
    app4.click();
    clearInterval(downTimeUpData);
    downTimeUpData = setInterval(getNowWeather, AutoDelayRefresh);
    RefreshBtn = true;
}
function UpDataCityName(data) {
    console.log(`Updating city...`)
    if (data.code != 200 || data.code != "200") { console.log(`Error:\n${data.code}`); }
    WeatherData.cityNameStr = `${data.location[0].adm1} - ${data.location[0].name}`;
    WeatherData.cityCode = data.location[0].id;
    WeatherData.latLon = `${data.location[0].lon},${data.location[0].lat}`;
}
function updateWeatherData(data) {
    console.log(`Updating realtime weather information...`)
    if (data.code == 402 || data.code == '402') { app5.click(); }
    if (data.code != "200" || data.code != 200) { console.log(`Realtime weather Error:${data.code}:\n`); return; }
    WeatherData.temp = data.now.temp;
    WeatherData.icon = data.now.icon;
    WeatherData.text = data.now.text;
    WeatherData.feelsLike = data.now.feelsLike;
    //WeatherData.windSpeed = data.now.windSpeed;
    //WeatherData.humidity = data.now.humidity;
    //WeatherData.vis = data.now.vis;
    //WeatherData.pressure = data.now.pressure;
    //WeatherData.dew = data.now.dew;
    WeatherData.obsTime = data.now.obsTime;
}
function updateAirQualityData(data) { // Update AQ
    console.log(`Updating Air Quality`)
    WeatherData.aqi = data.now.aqi;
    WeatherData.category = data.now.category;
}
function updateHitokotoData(data) { // By LtgX
    console.log(`By LtgX`)
    const from_who = (data.from_who || '');
    WeatherData.hitokotoData = data.hitokoto;
    WeatherData.hitokotoData_who = from_who;
    WeatherData.hitokotoData_from = data.from;
    WeatherData.UpDataTime = Date.now();
    console.log(`Finished data update!!!`)
}
function RenderData() {
    console.log(`Rendering Data...`)
    NowTemp.textContent = WeatherData.temp;
    NowIcon.innerHTML = `<i class="qi-${WeatherData.icon}" style="color: #fff; font-size: 64px;"></i>`;
    NowWeather.textContent = WeatherData.text;
    feelsLike.textContent = `Feels like ${WeatherData.feelsLike} ℃`;
    //Speed.textContent = `${WeatherData.windSpeed}KM/h`;
    //Humidity.textContent = `${WeatherData.humidity}%`;
    //Visibility.textContent = `${WeatherData.vis}KM`;
    //bar.textContent = `${WeatherData.pressure}hPa`;
    //dew.textContent = `${WeatherData.dew}℃`;
    timeCity.textContent = `${extractTimestamp(WeatherData.obsTime)}`;
    watCity.textContent = ` ${WeatherData.cityNameStr}`;
    //AirQuality.innerHTML = `${WeatherData.aqi}<span style="font-size:10px; background-color: var(--items-bgcolor); border-radius: 50%; margin-left: 5px; padding:5px 5px;">${WeatherData.category}</span>`;
    hitokoto_author.textContent = `By LtgX`;
    console.log(`Data rendering finished!!!`)
}
function LocalCache() {
    console.log(`Updating local storage...`);
    const dataString = JSON.stringify(WeatherData);
    localStorage.setItem('weatherData2', dataString);
    console.log(`Finished update local data!!!`);
}
function checkLocalStorageData() {
    if (localStorage.getItem('weatherData2')) {
        // Exist local data
        console.log('Data existed, start loading local data\n');
        const storedDataString = localStorage.getItem('weatherData2');
        const storedWeatherData = JSON.parse(storedDataString);
        const storedUpDataTime = storedWeatherData.UpDataTime;
        const nowTime = Date.now();
        if ((nowTime - storedUpDataTime) > 1800000) { console.log(`Local data is timeouted，starting update`); getNowWeather(); return; }// Update weather data every 30 min
        console.log(`Good Local data，Loading...`);
        WeatherData = storedWeatherData;
        RenderData();
    } else {
        // Local data NOT exist
        console.log('Data is not existed，starting update\n');
        getNowWeather();
    }
}
function extractTimestamp(str) {
    const regex = /(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/;
    const match = str.match(regex);
    const date = +new Date();
    if (match) {
        const [_, dateStr, timeStr] = match;
        const [year, month, day] = dateStr.split('-');
        const [hour, minute] = timeStr.split(':');
        const timestamp = new Date(date - (new Date(year, month - 1, day, hour, minute).getTime())).getMinutes();
        return 'Updated ' + timestamp + ' minutes ago';
    }
    return null;
}

function checkAPIKeyValidity(userApiKey) { // Verify qWeather API key
    const url = `https://devapi.qweather.com/v7/air/now?location=101010100&key=${userApiKey}`;
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('API request FAILED');
            }
        })
        .then(data => {
            const code = data.code;
            if (code == 200 || code == '200') {
                WeatherData.apiKey = userApiKey;
                userKeyLock = true;
                app3.click();
            } else {
                userKeyLock = false;
                app.click();
            }
        })
        .catch(error);
}
new Vue({
    el: '#app',
    methods: {
        showAlert() {

        },
        showWarningAlert(message) {
            this.$message({
                showClose: true,
                dangerouslyUseHTMLString: true,
                message: message,
                type: 'warning',
            });
        },
    }
});
new Vue({
    el: '#app2',
    methods: {
        showAlert() {
            
        },
        showWarningAlert(message) {
            this.$message({
                showClose: true,
                dangerouslyUseHTMLString: true,
                message: message,
                type: 'error',
            });
        },
    }
});
new Vue({
    el: '#app3',
    methods: {
        showAlert() {
            
        },
        showWarningAlert(message) {
            this.$message({
                showClose: true,
                dangerouslyUseHTMLString: true,
                message: message,
                type: 'success',
            });
        },
    }
});
new Vue({
    el: '#app4',
    methods: {
        showAlert() {
            
        },
        showWarningAlert(message) {
            this.$message({
                showClose: true,
                dangerouslyUseHTMLString: true,
                message: message,
                type: 'success',
            });
        },
    }
});
new Vue({
    el: '#app5',
    methods: {
        showAlert() {
           
        },
        showWarningAlert(message) {
            this.$message({
                showClose: true,
                dangerouslyUseHTMLString: true,
                message: message,
                type: 'success',
            });
        },
    }
});
let downTimeUpData = setInterval(getNowWeather, AutoDelayRefresh);
window.addEventListener('online', getNowWeather);
hitokoto_author.addEventListener('click', () => {
    fetch(`https://v1.hitokoto.cn/?&c=d&c=k&c=i`)
        .then(response => response.json())
        .then((data) => {
            hitokoto_author.textContent = `By LtgX`;
        })
        .catch(error => {
            console.log('Error', error);
        })
});
