const apiKey = 'bba86d1afde549aeb6b121307252406';

async function fetchWeather() {
    const city = document.getElementById('cityInput').value || 'Bengaluru'; // 'Bengaluru' will only be the default if the input is empty
    
    // You could also add a check here to ensure a city is entered before fetching:
    if (!city) {
        alert("Please enter a city name!");
        return; // Stop the function if no city is entered
    }

    const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3&aqi=no`);
    const data = await res.json();

    // Check for API errors (e.g., city not found)
    if (data.error) {
        alert(`Error: ${data.error.message}`);
        // Optionally clear previous data
        document.getElementById('temp').innerText = `--°C`;
        document.getElementById('condition').innerText = `--`;
        document.getElementById('icon').src = ``;
        document.getElementById('location').innerText = `--`;
        document.getElementById('humidity').innerText = `--%`;
        document.getElementById('pressure').innerText = `-- mb`;
        document.getElementById('wind').innerText = `-- km/h`;
        document.getElementById('windDir').innerText = `--`;
        document.getElementById('sunrise').innerText = `--`;
        document.getElementById('sunset').innerText = `--`;
        document.getElementById('windArrow').style.transform = `rotate(0deg)`;
        return; 
    }

    document.getElementById('temp').innerText = `${data.current.temp_c}°C`;
    document.getElementById('condition').innerText = data.current.condition.text;
    document.getElementById('icon').src = 'https:' + data.current.condition.icon;
    document.getElementById('location').innerText = `${data.location.name}, ${data.location.country}`;
    document.getElementById('humidity').innerText = `${data.current.humidity}%`;
    document.getElementById('pressure').innerText = `${data.current.pressure_mb} mb`;
    document.getElementById('wind').innerText = `${data.current.wind_kph} km/h`;
    document.getElementById('windDir').innerText = `${data.current.wind_dir} (${data.current.wind_degree}°)`;
    document.getElementById('sunrise').innerText = data.forecast.forecastday[0].astro.sunrise;
    document.getElementById('sunset').innerText = data.forecast.forecastday[0].astro.sunset;
    document.getElementById('windArrow').style.transform = `rotate(${data.current.wind_degree}deg)`;

    const labels = data.forecast.forecastday.map(day => day.date);
    const temps = data.forecast.forecastday.map(day => day.day.avgtemp_c);

    // Destroy existing chart before creating a new one to prevent conflicts
    const existingChart = Chart.getChart('forecastChart');
    if (existingChart) {
        existingChart.destroy();
    }

    new Chart(document.getElementById('forecastChart'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Avg Temp (°C)',
                data: temps,
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: false }
            },
            plugins: { legend: { display: false } }
        }
    });
}
