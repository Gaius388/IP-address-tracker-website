'use strict'
const addressContainer = document.querySelector('.info__section');
const inputText = document.querySelector('.input');
const btn = document.querySelector('.btn');

const renderIpAddress = (data) => {
    const html = `
    <div class="info__1">
        <small>ip address</small>
        <p>${data.ip}</p>
    </div>
    <div class="info__2">
        <small>location</small>
        <p>${data.location.city} ${data.location.country}, ${data.location.postalCode || '110001'}</p>
    </div>
        <div class="info__3">
        <small>timezone</small>
    <p>UTC ${data.location.timezone}</p>
    </div>
    <div class="info__4">
        <small>isp</small>
        <p>${data.isp}</p>
    </div>
`
    addressContainer.insertAdjacentHTML('afterbegin', html);
}
const renderError = function(msg) {
    addressContainer.insertAdjacentText('beforeend', msg);
    addressContainer.style.opacity = 1;
};

let map;
const mapDetails = (lat, lng, data) => {
    map = L.map('map').setView([lat, lng], 16);
    
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    L.marker([lat, lng]).addTo(map)
        .bindPopup(L.popup({minWidth: 100,})
        ).setPopupContent(`You are currently in ${data.location.city}, ${data.location.country}.`)
        .openPopup();
};

const getIpAddress = function(address) {
    fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_f0ebEvOiz1WirhNs0M7nRUyvltt6o&ipAddress=${address}`)
    .then(response => response.json()).then(data => {
        console.log(data);
        renderIpAddress(data);
        mapDetails(data.location.lat, data.location.lng, data);
    }).catch(err => renderError(`Please check IP Address inputted or your internet connection🙂: ${err.message}`));
};
getIpAddress(inputText.value);
btn.addEventListener('click', () => {
    getIpAddress(inputText.value);
    addressContainer.textContent = '';
    inputText.value = '';
    map?.remove();
});

