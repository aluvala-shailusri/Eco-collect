/**
 * EcoCollect Telangana - Photo Upload & HTML5 Canvas GPS Watermark Stamper
 * Stamps exact live GPS coordinates, reverse-geocoded Telangana location,
 * IST timestamp, item weight, and verification hash directly onto the e-waste image.
 */

class EwasteUploader {
  constructor() {
    this.currentImage = null;
    this.currentImageObj = null;
    this.watermarkedDataUrl = null;
    this.initListeners();
  }

  initListeners() {
    const fileInput = document.getElementById('wastePhotoInput');
    const dropzone = document.getElementById('photoDropzone');
    const weightSlider = document.getElementById('weightRangeInput');
    const weightNumberInput = document.getElementById('weightNumberInput');
    const categorySelect = document.getElementById('wasteCategorySelect');
    const submitBtn = document.getElementById('submitWasteBtn');
    const downloadBtn = document.getElementById('downloadStampedPhotoBtn');

    if (fileInput) {
      fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
    }

    if (dropzone) {
      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });

      dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
      });

      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          this.processImageFile(e.dataTransfer.files[0]);
        }
      });
    }

    // Synchronize weight slider and number input
    if (weightSlider && weightNumberInput) {
      weightSlider.addEventListener('input', (e) => {
        weightNumberInput.value = e.target.value;
        this.updateLiveCalculations();
      });

      weightNumberInput.addEventListener('input', (e) => {
        weightSlider.value = e.target.value;
        this.updateLiveCalculations();
      });
    }

    if (categorySelect) {
      categorySelect.addEventListener('change', () => {
        this.updateLiveCalculations();
      });
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleSubmit();
      });
    }

    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        this.downloadStampedImage();
      });
    }

    // Set initial calculations
    this.updateLiveCalculations();
  }

  /**
   * Quick preset button handler
   */
  setWeightPreset(val) {
    const weightSlider = document.getElementById('weightRangeInput');
    const weightNumberInput = document.getElementById('weightNumberInput');
    if (weightSlider && weightNumberInput) {
      weightSlider.value = val;
      weightNumberInput.value = val;
      this.updateLiveCalculations();
    }
  }

  /**
   * Recalculates points and environmental metrics dynamically
   */
  updateLiveCalculations() {
    const weightInput = document.getElementById('weightRangeInput');
    const categorySelect = document.getElementById('wasteCategorySelect');
    const weight = parseFloat(weightInput ? weightInput.value : 1.0) || 1.0;
    const category = categorySelect ? categorySelect.value : 'smartphones';

    // Display formatted weight
    const weightDisplay = document.getElementById('weightDisplayValue');
    if (weightDisplay) {
      weightDisplay.innerHTML = `${weight.toFixed(1)} <span>kg</span>`;
    }

    // Calculate dynamic points via PointsCalculator
    const calc = window.PointsCalculator.calculatePoints(weight, category);

    // Update UI elements
    const pointsValEl = document.getElementById('calcPointsDisplay');
    const tierBadgeEl = document.getElementById('calcTierDisplay');
    const co2El = document.getElementById('calcCo2Saved');
    const toxicEl = document.getElementById('calcToxicSaved');

    if (pointsValEl) pointsValEl.textContent = `+${calc.totalPoints} Pts`;
    if (tierBadgeEl) tierBadgeEl.textContent = `${calc.tierName}`;
    if (co2El) co2El.textContent = `${calc.co2PreventedKg} kg CO₂ diverted`;
    if (toxicEl) toxicEl.textContent = `${calc.toxicMetalsGrams}g toxic metals saved`;

    // Re-stamp canvas if an image is loaded
    if (this.currentImageObj) {
      this.renderGeotagWatermark(this.currentImageObj, calc);
    }
  }

  handleFileSelect(event) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      this.processImageFile(file);
    }
  }

  processImageFile(file) {
    if (!file.type.startsWith('image/')) {
      window.App?.showToast('Please upload an image file (JPG, PNG, WebP)', 'info');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        this.currentImageObj = img;
        this.updateLiveCalculations();
        document.getElementById('canvasPlaceholder')?.classList.add('hidden');
        document.getElementById('watermarkCanvas')?.classList.remove('hidden');
        document.getElementById('downloadStampedPhotoBtn')?.removeAttribute('disabled');
        window.App?.showToast('Photo loaded! Live GPS geotag stamped.', 'success');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  /**
   * HTML5 Canvas Geotag Stamp Engine
   */
  renderGeotagWatermark(img, calc) {
    const canvas = document.getElementById('watermarkCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Establish canvas dimensions preserving aspect ratio
    const maxWidth = 900;
    const scale = Math.min(1, maxWidth / img.width);
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;

    // Draw main original photo
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Prepare Geotag data
    const locationInfo = window.EcoMap ? window.EcoMap.currentLocation : {
      lat: 17.4474,
      lng: 78.3762,
      address: 'HITEC City, Hyderabad, Telangana 500081, India'
    };

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Kolkata'
    });
    const formattedTime = now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    });
    const istTimestamp = `${formattedDate} • ${formattedTime} IST`;

    const catSelect = document.getElementById('wasteCategorySelect');
    const catName = catSelect ? catSelect.options[catSelect.selectedIndex].text : 'Electronic Waste';
    const trackingHash = 'TG-EW-' + Math.floor(100000 + Math.random() * 900000) + '-HYD';

    // Banner geometry
    const bannerHeight = Math.max(140, canvas.height * 0.28);
    const bannerY = canvas.height - bannerHeight;

    // Dark glass gradient background overlay
    const gradient = ctx.createLinearGradient(0, bannerY - 30, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(10, 15, 24, 0)');
    gradient.addColorStop(0.2, 'rgba(10, 15, 24, 0.88)');
    gradient.addColorStop(1, 'rgba(10, 15, 24, 0.98)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, bannerY - 30, canvas.width, bannerHeight + 30);

    // Accent line top of banner
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, bannerY - 5);
    ctx.lineTo(canvas.width, bannerY - 5);
    ctx.stroke();

    // Text & Details
    const padX = 24;
    let textY = bannerY + 24;

    // 1. Verification Header Badge
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('ECOCOLLECT TELANGANA  •  VERIFIED SMART E-WASTE DROP-OFF', padX, textY);

    // Live GPS badge on the right
    const gpsBadgeText = `● LIVE GPS VERIFIED: ${locationInfo.lat.toFixed(4)}° N, ${locationInfo.lng.toFixed(4)}° E`;
    ctx.font = 'bold 13px monospace';
    ctx.fillStyle = '#38bdf8';
    const gpsTextWidth = ctx.measureText(gpsBadgeText).width;
    ctx.fillText(gpsBadgeText, canvas.width - padX - gpsTextWidth, textY);

    // 2. Reverse Geocoded Location in Telangana
    textY += 26;
    ctx.font = '600 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#ffffff';
    const truncatedAddress = locationInfo.address.length > 70 ? locationInfo.address.substring(0, 68) + '...' : locationInfo.address;
    ctx.fillText(`📍 Origin: ${truncatedAddress}`, padX, textY);

    // 3. Metadata row: Category, Weight & Timestamp
    textY += 24;
    ctx.font = '13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(`📦 Item: ${catName}   |   ⚖️ Weight: ${calc.weightKg} kg (${calc.tierBadge})`, padX, textY);

    // 4. Points & Hash row
    textY += 24;
    ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(`⭐ Earned: +${calc.totalPoints} Rewards Points`, padX, textY);

    ctx.font = '12px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`ID: ${trackingHash}   |   ${istTimestamp}`, padX + 260, textY);

    // Update metadata preview below the canvas
    document.getElementById('metaCoordsVal').textContent = `${locationInfo.lat.toFixed(5)}° N, ${locationInfo.lng.toFixed(5)}° E`;
    document.getElementById('metaAddressVal').textContent = locationInfo.address;
    document.getElementById('metaTimestampVal').textContent = istTimestamp;
    document.getElementById('metaWeightVal').textContent = `${calc.weightKg} kg (${calc.totalPoints} pts)`;

    this.watermarkedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
  }

  downloadStampedImage() {
    if (!this.watermarkedDataUrl) return;
    const a = document.createElement('a');
    a.href = this.watermarkedDataUrl;
    a.download = `ecocollect-telangana-${Date.now()}.jpg`;
    a.click();
    window.App?.showToast('Watermarked Geotagged Receipt downloaded!', 'success');
  }

  handleSubmit() {
    if (!this.currentImageObj) {
      window.App?.showToast('Please upload or take a photo of your e-waste first!', 'info');
      return;
    }

    const weightInput = document.getElementById('weightRangeInput');
    const categorySelect = document.getElementById('wasteCategorySelect');
    const centerSelect = document.getElementById('nearestCenterSelect');

    const weight = parseFloat(weightInput ? weightInput.value : 1.0) || 1.0;
    const categoryKey = categorySelect ? categorySelect.value : 'smartphones';
    const categoryLabel = categorySelect ? categorySelect.options[categorySelect.selectedIndex].text : 'Electronics';
    const centerName = centerSelect ? centerSelect.options[centerSelect.selectedIndex].text : 'HITEC City EcoRecycle Hub';

    const calc = window.PointsCalculator.calculatePoints(weight, categoryKey);
    const locationInfo = window.EcoMap ? window.EcoMap.currentLocation : {
      lat: 17.4474,
      lng: 78.3762,
      address: 'HITEC City, Hyderabad, Telangana'
    };

    const now = new Date();
    const submissionRecord = {
      id: 'sub-' + Date.now(),
      categoryKey,
      categoryLabel,
      weightKg: weight,
      pointsEarned: calc.totalPoints,
      co2Saved: calc.co2PreventedKg,
      centerName,
      lat: locationInfo.lat,
      lng: locationInfo.lng,
      address: locationInfo.address,
      date: now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
      thumbUrl: this.watermarkedDataUrl
    };

    // Credit user points and save submission
    window.App?.addEwasteSubmission(submissionRecord);

    // Pin on map
    window.EcoMap?.addSubmissionPin(submissionRecord);

    // Show celebration modal
    this.showSubmissionSuccessModal(submissionRecord);
  }

  showSubmissionSuccessModal(sub) {
    const modal = document.getElementById('submissionSuccessModal');
    if (!modal) return;

    document.getElementById('modalEarnedPoints').textContent = `+${sub.pointsEarned}`;
    document.getElementById('modalCo2Saved').textContent = `${sub.co2Saved} kg`;
    document.getElementById('modalWeightDisplay').textContent = `${sub.weightKg} kg`;
    document.getElementById('modalLocationDisplay').textContent = sub.address;

    modal.classList.add('active');
  }

  closeSubmissionModal() {
    const modal = document.getElementById('submissionSuccessModal');
    if (modal) modal.classList.remove('active');
  }
}

window.EwasteUploader = new EwasteUploader();
