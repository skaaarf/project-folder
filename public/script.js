let map;
let selectedPoint;
let markerA;
let userMarkers = [];
let locations = {
    1: { lat: 37.7749, lng: -122.4194 }, // サンフランシスコ
    2: { lat: 35.6895, lng: 139.6917 },  // 東京
    3: { lat: 48.8566, lng: 2.3522 },    // パリ
};
let geocoder;

// 地図を初期化
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 20, lng: 0 },
        zoom: 2,
        mapTypeId: 'satellite'
    });

    geocoder = new google.maps.Geocoder();

    map.addListener("click", (event) => {
        if (selectedPoint) {
            addUserMarker(event.latLng);
        } else {
            alert("Please confirm a location number first.");
        }
    });
}

// ユーザーが番号を指定した際にランダム地点を設定
function setLocation() {
    const selectedNumber = document.getElementById("location-number").value;
    selectedPoint = locations[selectedNumber];

    if (markerA) {
        markerA.setMap(null);
    }
    markerA = new google.maps.Marker({
        position: selectedPoint,
        map: null,
        title: `Point ${selectedNumber}`
    });
}

function addUserMarker(latLng) {
    const marker = new google.maps.Marker({
        position: latLng,
        map: map,
        title: `User Selected Point`,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 5,
            fillColor: "#FF0000",
            fillOpacity: 0.8,
            strokeColor: "#FF0000",
            strokeWeight: 2,
        },
    });
    userMarkers.push(marker);
}

function confirmLocations() {
    if (userMarkers.length === 0) {
        alert("Please select at least one location by clicking on the map.");
        return;
    }
    if (!selectedPoint) {
        alert("Please confirm a location number first.");
        return;
    }

    const lastUserMarker = userMarkers[userMarkers.length - 1].getPosition();
    const distance = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(selectedPoint),
        lastUserMarker
    );

    document.getElementById("distance-output").textContent =
        `The distance from your last selected point to the target point is ${Math.round(distance / 1000)} kilometers.`;

    markerA.setMap(map);
}

async function searchLocation() {
    const address = document.getElementById("search-input").value;
    try {
        const response = await fetch(`/api/myapi?address=${address}`);
        const data = await response.json();
        if (data.status === 'OK') {
            const location = data.results[0].geometry.location;
            map.setCenter(location);
            map.setZoom(8);
        } else {
            alert("Location not found.");
        }
    } catch (error) {
        console.error("Error fetching location:", error);
    }
}
