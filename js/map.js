/**
 * EcoCollect Telangana - Map Management & Real-Time GPS Tracking
 * Features search and filter bar, Leaflet visibility assurance,
 * and live distance calculations.
 */

const TELANGANA_CENTERS = [
  {
    id: 'tg-01',
    name: 'HITEC City EcoRecycle Hub',
    city: 'Hyderabad',
    district: 'Hyderabad / Cyberabad',
    region: 'cyberabad',
    address: 'Phase 2, HITEC City, Madhapur, Hyderabad, Telangana 500081',
    lat: 17.4474,
    lng: 78.3762,
    phone: '+91 40 2311 8840',
    timing: 'Mon-Sat: 09:00 AM - 07:00 PM',
    rating: 4.9,
    categories: ['smartphones', 'laptops', 'batteries', 'cables_pcbs'],
    capacity: '88% Capacity (Active Collection)',
    badge: 'Premier Hub'
  },
  {
    id: 'tg-02',
    name: 'Gachibowli Green Drop Zone',
    city: 'Hyderabad',
    district: 'Financial District / Cyberabad',
    region: 'cyberabad',
    address: 'Near WaveRock, Nanakramguda, Gachibowli, Telangana 500032',
    lat: 17.4215,
    lng: 78.3426,
    phone: '+91 40 2988 5510',
    timing: 'All Days: 08:30 AM - 08:00 PM',
    rating: 4.8,
    categories: ['smartphones', 'laptops', 'appliances', 'batteries'],
    capacity: '65% Capacity',
    badge: 'Solar Powered'
  },
  {
    id: 'tg-03',
    name: 'Secunderabad Cantonment E-Waste Center',
    city: 'Secunderabad',
    district: 'Secunderabad Urban',
    region: 'secunderabad',
    address: 'MG Road, Near Clock Tower, Secunderabad, Telangana 500003',
    lat: 17.4399,
    lng: 78.4983,
    phone: '+91 40 2780 1219',
    timing: 'Mon-Sat: 09:30 AM - 06:30 PM',
    rating: 4.7,
    categories: ['appliances', 'screens_monitors', 'cables_pcbs'],
    capacity: '50% Capacity',
    badge: 'Govt Certified'
  },
  {
    id: 'tg-04',
    name: 'Begumpet Smart Recovery Facility',
    city: 'Hyderabad',
    district: 'Hyderabad Central',
    region: 'hyderabad_central',
    address: 'Sardar Patel Rd, Prakash Nagar, Begumpet, Hyderabad, Telangana 500016',
    lat: 17.4440,
    lng: 78.4682,
    phone: '+91 40 2776 4302',
    timing: 'Mon-Sat: 09:00 AM - 07:00 PM',
    rating: 4.8,
    categories: ['smartphones', 'laptops', 'screens_monitors', 'batteries'],
    capacity: '72% Capacity',
    badge: 'Express Drop'
  },
  {
    id: 'tg-05',
    name: 'Warangal Urban E-Waste Facility',
    city: 'Warangal',
    district: 'Hanamkonda / Warangal Urban',
    region: 'warangal',
    address: 'Collectorate Junction, Subedari, Hanamkonda, Telangana 506001',
    lat: 17.9784,
    lng: 79.5941,
    phone: '+91 870 245 6112',
    timing: 'Mon-Sat: 09:30 AM - 06:00 PM',
    rating: 4.6,
    categories: ['smartphones', 'laptops', 'appliances', 'batteries', 'cables_pcbs'],
    capacity: '40% Capacity',
    badge: 'Regional Center'
  },
  {
    id: 'tg-06',
    name: 'Karimnagar Green Depot',
    city: 'Karimnagar',
    district: 'Karimnagar',
    region: 'north_telangana',
    address: 'Court Road, Near Collector Office, Karimnagar, Telangana 505001',
    lat: 18.4386,
    lng: 79.1288,
    phone: '+91 878 223 9084',
    timing: 'Mon-Fri: 10:00 AM - 05:30 PM',
    rating: 4.7,
    categories: ['smartphones', 'appliances', 'batteries'],
    capacity: '55% Capacity',
    badge: 'Municipal Partner'
  },
  {
    id: 'tg-07',
    name: 'Nizamabad Resource Recovery Plant',
    city: 'Nizamabad',
    district: 'Nizamabad',
    region: 'north_telangana',
    address: 'Khaleelwadi Main Road, Nizamabad, Telangana 503001',
    lat: 18.6725,
    lng: 78.0941,
    phone: '+91 8462 231 400',
    timing: 'Mon-Sat: 09:00 AM - 06:00 PM',
    rating: 4.5,
    categories: ['laptops', 'appliances', 'cables_pcbs'],
    capacity: '38% Capacity',
    badge: 'Industrial Unit'
  }
];

class EcoMapManager {
  constructor() {
    this.map = null;
    this.userMarker = null;
    this.centerMarkers = [];
    this.submissionMarkers = [];
    this.activeFilter = 'all';
    this.activeRegion = 'all';
    this.searchQuery = '';
    this.watchId = null;

    this.currentLocation = {
      lat: 17.4474,
      lng: 78.3762,
      accuracy: 12,
      address: 'HITEC City, Hyderabad, Telangana 500081, India',
      isLiveGps: false
    };
  }

  initMap() {
    const mapContainer = document.getElementById('leafletMap');
    if (!mapContainer || this.map) return;

    this.map = L.map('leafletMap', {
      center: [this.currentLocation.lat, this.currentLocation.lng],
      zoom: 12,
      minZoom: 6,
      maxZoom: 19,
      zoomControl: true,
      fadeAnimation: true
    });

    const cartoVoyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(this.map);

    cartoVoyager.on('tileerror', () => {
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap'
      }).addTo(this.map);
    });

    this.setupMapResizeHandling();
    this.bindSearchAndFilterEvents();
    this.renderCollectionCenters();
    this.startLiveGpsTracking();
    this.renderUserSubmissions();
  }

  setupMapResizeHandling() {
    setTimeout(() => {
      if (this.map) this.map.invalidateSize();
    }, 250);

    const container = document.getElementById('leafletMap');
    if (window.ResizeObserver && container) {
      const resizeObserver = new ResizeObserver(() => {
        if (this.map) this.map.invalidateSize();
      });
      resizeObserver.observe(container);
    }

    window.addEventListener('resize', () => {
      if (this.map) this.map.invalidateSize();
    });
  }

  forceRefresh() {
    if (this.map) {
      setTimeout(() => {
        this.map.invalidateSize(true);
      }, 150);
    }
  }

  bindSearchAndFilterEvents() {
    const searchInput = document.getElementById('centerSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderCollectionCenters();
      });

      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.focusFirstSearchResult();
        }
      });
    }

    const clearBtn = document.getElementById('clearSearchBtn');
    if (clearBtn && searchInput) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        this.searchQuery = '';
        this.renderCollectionCenters();
      });
    }
  }

  setRegionFilter(regionKey, targetButton) {
    this.activeRegion = regionKey;

    const buttons = document.querySelectorAll('.region-pill-filter');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (targetButton) {
      targetButton.classList.add('active');
    }

    this.renderCollectionCenters();
  }

  setFilter(categoryKey, targetButton) {
    this.activeFilter = categoryKey;

    const buttons = document.querySelectorAll('.map-filter-group .filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (targetButton) {
      targetButton.classList.add('active');
    }

    this.renderCollectionCenters();
  }

  getFilteredCenters() {
    return TELANGANA_CENTERS.filter(center => {
      // 1. Text Search Filter
      if (this.searchQuery) {
        const fullSearchTarget = `${center.name} ${center.city} ${center.district} ${center.address}`.toLowerCase();
        if (!fullSearchTarget.includes(this.searchQuery)) {
          return false;
        }
      }

      // 2. Region Filter
      if (this.activeRegion !== 'all' && center.region !== this.activeRegion) {
        return false;
      }

      // 3. Category Filter
      if (this.activeFilter !== 'all' && !center.categories.includes(this.activeFilter)) {
        return false;
      }

      return true;
    });
  }

  focusFirstSearchResult() {
    const filtered = this.getFilteredCenters();
    if (filtered.length > 0) {
      this.focusCenter(filtered[0].id);
    }
  }

  renderCollectionCenters() {
    if (!this.map) return;

    // Clear old markers
    this.centerMarkers.forEach(m => this.map.removeLayer(m));
    this.centerMarkers = [];

    const filtered = this.getFilteredCenters();

    // Update count indicator
    const countIndicator = document.getElementById('centersFoundCount');
    if (countIndicator) {
      countIndicator.textContent = `${filtered.length} Centers in Telangana`;
    }

    filtered.forEach(center => {
      const dist = this.calculateDistanceKm(this.currentLocation.lat, this.currentLocation.lng, center.lat, center.lng);

      const centerPinHtml = `
        <div class="center-marker-pin" title="${center.name}">
          <i class="fa-solid fa-recycle"></i>
        </div>
      `;

      const centerIcon = L.divIcon({
        className: 'custom-center-icon',
        html: centerPinHtml,
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38]
      });

      const popupHtml = `
        <div class="popup-card">
          <span class="popup-badge">${center.badge}</span>
          <div class="popup-title">${center.name}</div>
          <div class="popup-address"><i class="fa-solid fa-map-pin"></i> ${center.address}</div>
          <div class="popup-distance-tag"><i class="fa-solid fa-route"></i> ${dist} km away from your location</div>
          <div class="popup-meta-row">
            <span><i class="fa-regular fa-clock"></i> ${center.timing}</span>
            <span style="color: #fbbf24;"><i class="fa-solid fa-star"></i> ${center.rating}</span>
          </div>
          <div class="popup-meta-row">
            <span><i class="fa-solid fa-phone"></i> ${center.phone}</span>
            <span style="color: #34d399;">${center.capacity}</span>
          </div>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}" target="_blank" class="popup-btn-directions">
            <i class="fa-solid fa-diamond-turn-right"></i> Open in Google Maps
          </a>
        </div>
      `;

      const marker = L.marker([center.lat, center.lng], { icon: centerIcon }).addTo(this.map);
      marker.bindPopup(popupHtml);
      marker.centerData = center;
      this.centerMarkers.push(marker);
    });

    this.renderSidebarCenters(filtered);
  }

  renderSidebarCenters(centers) {
    const listContainer = document.getElementById('centersListContainer');
    if (!listContainer) return;

    if (centers.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align: center; padding: 2.5rem 1rem; color: #94a3b8;">
          <i class="fa-solid fa-magnifying-glass" style="font-size: 2rem; color: #64748b; margin-bottom: 0.5rem;"></i>
          <p style="font-size: 0.9rem; font-weight: 600;">No collection centers match your search</p>
          <p style="font-size: 0.75rem; color: #64748b;">Try searching "Hyderabad", "Warangal", or select "All Centers"</p>
        </div>
      `;
      return;
    }

    const withDistance = centers.map(c => ({
      ...c,
      distanceKm: this.calculateDistanceKm(this.currentLocation.lat, this.currentLocation.lng, c.lat, c.lng)
    })).sort((a, b) => a.distanceKm - b.distanceKm);

    listContainer.innerHTML = withDistance.map(c => `
      <div class="center-card" data-center-id="${c.id}" onclick="window.EcoMap.focusCenter('${c.id}')">
        <div class="center-header">
          <div class="center-name">${c.name}</div>
          <span class="center-distance"><i class="fa-solid fa-location-arrow"></i> ${c.distanceKm} km</span>
        </div>
        <div class="center-location"><i class="fa-solid fa-location-dot"></i> ${c.address}</div>
        <div class="center-tags">
          <span class="mini-tag" style="color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3);"><i class="fa-solid fa-clock"></i> ${c.timing}</span>
          <span class="mini-tag"><i class="fa-solid fa-phone"></i> ${c.phone}</span>
        </div>
      </div>
    `).join('');
  }

  focusCenter(centerId) {
    const foundMarker = this.centerMarkers.find(m => m.centerData && m.centerData.id === centerId);
    if (foundMarker && this.map) {
      this.map.flyTo(foundMarker.getLatLng(), 15, { duration: 1 });
      foundMarker.openPopup();
    }
  }

  startLiveGpsTracking() {
    if (!('geolocation' in navigator)) {
      this.updateGpsStatusUI('GPS not supported, using Telangana Default', false);
      this.setUserLocationMarker(this.currentLocation.lat, this.currentLocation.lng, false);
      return;
    }

    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 10000
    };

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        this.currentLocation.lat = latitude;
        this.currentLocation.lng = longitude;
        this.currentLocation.accuracy = accuracy;
        this.currentLocation.isLiveGps = true;

        this.setUserLocationMarker(latitude, longitude, true);
        this.reverseGeocode(latitude, longitude);
        this.renderCollectionCenters();
      },
      (error) => {
        console.warn('Live GPS acquisition note:', error.message);
        this.updateGpsStatusUI('Using Telangana Default (GPS Permission Optional)', false);
        this.setUserLocationMarker(this.currentLocation.lat, this.currentLocation.lng, false);
        this.renderCollectionCenters();
      },
      geoOptions
    );
  }

  requestLocationPin() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          this.currentLocation.lat = lat;
          this.currentLocation.lng = lng;
          this.currentLocation.isLiveGps = true;
          this.setUserLocationMarker(lat, lng, true);
          this.reverseGeocode(lat, lng);
          this.map.flyTo([lat, lng], 14, { duration: 1.2 });
          window.App?.showToast('GPS Location locked successfully!', 'success');
        },
        () => {
          this.map.flyTo([this.currentLocation.lat, this.currentLocation.lng], 13);
          window.App?.showToast('Centered on Telangana, India', 'info');
        },
        { enableHighAccuracy: true }
      );
    }
  }

  setUserLocationMarker(lat, lng, isLive) {
    if (!this.map) return;

    const userPulseHtml = `
      <div class="user-gps-marker" title="Your Live GPS Location">
        <div class="gps-pulse-wave"></div>
        <div class="gps-pulse-core"></div>
      </div>
    `;

    const userPulseIcon = L.divIcon({
      className: 'custom-user-gps-icon',
      html: userPulseHtml,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    if (this.userMarker) {
      this.userMarker.setLatLng([lat, lng]);
    } else {
      this.userMarker = L.marker([lat, lng], { icon: userPulseIcon, zIndexOffset: 1000 }).addTo(this.map);
      this.userMarker.bindPopup(`
        <div class="popup-card">
          <span class="popup-badge" style="background: rgba(56, 189, 248, 0.2); color: #38bdf8; border-color: rgba(56, 189, 248, 0.4);">
            <i class="fa-solid fa-satellite-dish"></i> ${isLive ? 'Real-Time GPS Location' : 'Current Center'}
          </span>
          <div class="popup-title">Your Present Location</div>
          <div class="popup-address"><i class="fa-solid fa-location-dot"></i> <span id="popupUserAddress">${this.currentLocation.address}</span></div>
          <div class="popup-distance-tag"><i class="fa-solid fa-crosshairs"></i> ${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E</div>
        </div>
      `);
    }

    this.updateGpsStatusUI(this.currentLocation.address, isLive);
  }

  async reverseGeocode(lat, lng) {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
        headers: { 'Accept-Language': 'en' }
      });
      if (response.ok) {
        const data = await response.json();
        const suburb = data.address?.suburb || data.address?.neighbourhood || data.address?.residential || 'Telangana Zone';
        const city = data.address?.city || data.address?.state_district || 'Hyderabad';
        const state = data.address?.state || 'Telangana';
        const postcode = data.address?.postcode ? `, ${data.address.postcode}` : '';
        const fullAddr = `${suburb}, ${city}, ${state}${postcode}, India`;

        this.currentLocation.address = fullAddr;
        this.updateGpsStatusUI(fullAddr, true);

        const addrSpan = document.getElementById('popupUserAddress');
        if (addrSpan) addrSpan.textContent = fullAddr;

        const uploadLocInput = document.getElementById('uploadLocationDisplay');
        if (uploadLocInput) {
          uploadLocInput.value = fullAddr;
        }
      }
    } catch (err) {
      console.warn('Reverse geocode fallback:', err);
    }
  }

  updateGpsStatusUI(addressText, isLive) {
    const locTextEl = document.getElementById('gpsLocationText');
    const coordsBadge = document.getElementById('gpsCoordsBadge');
    if (locTextEl) {
      locTextEl.textContent = addressText || 'Telangana, India';
    }
    if (coordsBadge) {
      coordsBadge.textContent = `${this.currentLocation.lat.toFixed(4)}° N, ${this.currentLocation.lng.toFixed(4)}° E`;
    }

    const uploadCoordsDisplay = document.getElementById('uploadCoordsDisplay');
    if (uploadCoordsDisplay) {
      uploadCoordsDisplay.textContent = `${this.currentLocation.lat.toFixed(4)}° N, ${this.currentLocation.lng.toFixed(4)}° E`;
    }
  }

  calculateDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(1));
  }

  renderUserSubmissions() {
    if (!this.map) return;

    this.submissionMarkers.forEach(m => this.map.removeLayer(m));
    this.submissionMarkers = [];

    const submissions = window.App ? window.App.getUserSubmissions() : [];
    submissions.forEach(sub => {
      if (!sub.lat || !sub.lng) return;

      const subPinHtml = `
        <div class="submission-marker-pin" title="Your E-Waste Submission">
          <i class="fa-solid fa-camera-retro"></i>
        </div>
      `;

      const subIcon = L.divIcon({
        className: 'custom-sub-icon',
        html: subPinHtml,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
        popupAnchor: [0, -34]
      });

      const marker = L.marker([sub.lat, sub.lng], { icon: subIcon }).addTo(this.map);
      marker.bindPopup(`
        <div class="popup-card">
          <span class="popup-badge" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24; border-color: rgba(245, 158, 11, 0.4);">
            <i class="fa-solid fa-circle-check"></i> E-Waste Drop-off Origin
          </span>
          <div class="popup-title">${sub.categoryLabel || 'E-Waste Item'}</div>
          <div class="popup-address"><i class="fa-solid fa-location-dot"></i> ${sub.address || 'Telangana, India'}</div>
          <div class="popup-meta-row">
            <span><strong>Weight:</strong> ${sub.weightKg} kg</span>
            <span style="color: #fbbf24;"><strong>+${sub.pointsEarned} Pts</strong></span>
          </div>
          <div class="popup-meta-row">
            <span><i class="fa-regular fa-calendar"></i> ${sub.date}</span>
            <span style="color: #38bdf8;">Verified Geotag</span>
          </div>
        </div>
      `);

      this.submissionMarkers.push(marker);
    });
  }

  addSubmissionPin(submission) {
    if (!this.map || !submission.lat || !submission.lng) return;
    this.renderUserSubmissions();
  }
}

window.EcoMap = new EcoMapManager();
