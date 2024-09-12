function fetchWeather() {
    const city = document.getElementById('locationInput').value;
    if (!city) {
        alert('Please enter a city name!');
        return;
    }

    fetch(`/weather?city=${city}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById('weatherResult').innerHTML = `<p>Error: ${data.error}</p>`;
            } else {
                document.getElementById('weatherResult').innerHTML = `
                    <h2>Weather in ${city}</h2>
                    <p>Temperature: ${data.temperature}°C</p>
                    <p>Condition: ${data.weatherText}</p>
                `;
            }
        })
        .catch(error => {
            console.error('Error fetching weather:', error);
            document.getElementById('weatherResult').innerHTML = '<p>Failed to fetch weather data.</p>';
        });
}
