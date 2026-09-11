/**
 * EcoCollect Telangana - Main Application Coordinator & State Store
 * Features:
 * - Mandatory Login / Sign-up Gate on first visit.
 * - Realistic Gmail OTP Verification Code delivery flow.
 * - Multi-account persistence in localStorage.
 * - Logout & account switcher.
 * - View routing in requested sequence:
 *   1. Eco Tips (Initial Landing) -> 2. Dashboard & Impact -> 3. Submit E-Waste ->
 *   4. My Submissions -> 5. Collection Centers -> 6. Rewards Catalog -> 7. My Redemptions
 */

const DB_KEY = 'ecocollect_users_db_v2';
const SESSION_KEY = 'ecocollect_active_session_email_v2';

class EcoCollectApp {
  constructor() {
    this.usersDb = this.loadUsersDb();
    this.currentUser = null;
    this.pendingOtp = null;
    this.resendTimerInterval = null;

    this.initAuth();
  }

  loadUsersDb() {
    const saved = localStorage.getItem(DB_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse user db:', e);
      }
    }

    // Default Seed Accounts
    const defaultDb = {
      'shailu.sri@gmail.com': {
        name: 'Shailu Sri',
        email: 'shailu.sri@gmail.com',
        points: 2450,
        tier: 'Earth Guardian',
        avatarInitial: 'S',
        phone: '+91 98490 12345',
        city: 'Hyderabad, Telangana',
        submissions: [
          {
            id: 'sub-seed-1',
            categoryKey: 'laptops',
            categoryLabel: 'Laptops & Computers',
            weightKg: 3.5,
            pointsEarned: 588,
            co2Saved: 7.4,
            centerName: 'HITEC City EcoRecycle Hub',
            lat: 17.4474,
            lng: 78.3762,
            address: 'Phase 2, HITEC City, Hyderabad, Telangana 500081',
            date: '08 Sep 2026',
            time: '11:30 AM',
            thumbUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=80'
          },
          {
            id: 'sub-seed-2',
            categoryKey: 'batteries',
            categoryLabel: 'Lithium Batteries',
            weightKg: 2.0,
            pointsEarned: 437,
            co2Saved: 4.2,
            centerName: 'Gachibowli Green Drop Zone',
            lat: 17.4215,
            lng: 78.3426,
            address: 'Near WaveRock, Gachibowli, Telangana 500032',
            date: '02 Sep 2026',
            time: '04:15 PM',
            thumbUrl: 'https://images.unsplash.com/photo-1619641219662-7360fc2d80d2?w=500&auto=format&fit=crop&q=80'
          }
        ],
        redemptions: [
          {
            id: 'red-seed-1',
            rewardId: 'rew-amz-02',
            title: 'Amazon Pay ₹500 Gift Voucher',
            categoryLabel: 'Amazon Pay',
            pointsSpent: 600,
            voucherCode: 'ECO-AMZ-9A4B-4821',
            redeemedAt: '05 Sep 2026',
            expiresAt: '05 Dec 2026',
            status: 'ACTIVE',
            instructions: 'Use this code in Amazon Pay -> Add Gift Card section.'
          }
        ]
      },
      'shailu.sri@telangana.eco': {
        name: 'Shailu Sri',
        email: 'shailu.sri@telangana.eco',
        points: 2450,
        tier: 'Earth Guardian',
        avatarInitial: 'S',
        phone: '+91 98490 12345',
        city: 'Hyderabad, Telangana',
        submissions: [],
        redemptions: []
      }
    };

    localStorage.setItem(DB_KEY, JSON.stringify(defaultDb));
    return defaultDb;
  }

  saveUsersDb() {
    localStorage.setItem(DB_KEY, JSON.stringify(this.usersDb));
  }

  /* ==========================================================================
     AUTHENTICATION & LOGIN GATE CONTROLLER
     ========================================================================== */
  initAuth() {
    this.bindAuthEvents();

    const activeEmail = localStorage.getItem(SESSION_KEY);
    if (activeEmail && this.usersDb[activeEmail]) {
      this.loginUser(activeEmail, false);
    } else {
      this.showAuthGate();
    }
  }

  showAuthGate() {
    document.body.classList.add('auth-locked');
    const gate = document.getElementById('authGateScreen');
    if (gate) {
      gate.classList.remove('hidden');
      this.switchAuthStep('credentials');
    }
  }

  hideAuthGate() {
    document.body.classList.remove('auth-locked');
    const gate = document.getElementById('authGateScreen');
    if (gate) {
      gate.classList.add('hidden');
    }
  }

  bindAuthEvents() {
    // Tab toggles: Sign In vs Sign Up
    const signinTab = document.getElementById('authTabSignIn');
    const signupTab = document.getElementById('authTabSignUp');
    const nameGroup = document.getElementById('authNameInputGroup');
    const submitBtn = document.getElementById('authSubmitCredsBtn');

    let isSignUp = false;

    if (signinTab && signupTab) {
      signinTab.addEventListener('click', () => {
        signinTab.classList.add('active');
        signupTab.classList.remove('active');
        if (nameGroup) nameGroup.style.display = 'none';
        if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-arrow-right-to-bracket"></i> Sign In with Gmail';
        isSignUp = false;
      });

      signupTab.addEventListener('click', () => {
        signupTab.classList.add('active');
        signinTab.classList.remove('active');
        if (nameGroup) nameGroup.style.display = 'block';
        if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-user-plus"></i> Create Account & Get OTP';
        isSignUp = true;
      });
    }

    // Standard Form Submit
    const authForm = document.getElementById('authCredentialsForm');
    if (authForm) {
      authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('authEmailInput')?.value.trim().toLowerCase();
        const name = document.getElementById('authNameInput')?.value.trim() || 'Eco Recycler';

        if (!email || !email.includes('@')) {
          this.showToast('Please enter a valid Gmail / Email address', 'info');
          return;
        }

        this.startGmailOtpFlow(email, name, isSignUp);
      });
    }

    // Google Quick Auth Button
    const googleBtn = document.getElementById('authGoogleQuickBtn');
    if (googleBtn) {
      googleBtn.addEventListener('click', () => {
        const defaultEmail = 'shailu.sri@gmail.com';
        this.startGmailOtpFlow(defaultEmail, 'Shailu Sri', false);
      });
    }

    // 6-Digit OTP Boxes Input Navigation
    this.setupOtpInputNavigation();

    // Verify OTP Button
    const verifyOtpBtn = document.getElementById('verifyOtpSubmitBtn');
    if (verifyOtpBtn) {
      verifyOtpBtn.addEventListener('click', () => {
        this.submitOtpVerification();
      });
    }

    // Resend OTP Button
    const resendBtn = document.getElementById('resendOtpCodeBtn');
    if (resendBtn) {
      resendBtn.addEventListener('click', () => {
        if (!resendBtn.disabled && this.pendingOtp) {
          this.startGmailOtpFlow(this.pendingOtp.email, this.pendingOtp.name, this.pendingOtp.isSignUp);
        }
      });
    }

    // Back to credentials button
    const backBtn = document.getElementById('backToCredsBtn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.switchAuthStep('credentials');
      });
    }

    // Profile Trigger & Logout Dropdown
    const profileBtn = document.getElementById('userProfileTriggerBtn');
    const profileDropdown = document.getElementById('profileDropdownMenu');
    if (profileBtn && profileDropdown) {
      profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('active');
      });

      document.addEventListener('click', () => {
        profileDropdown.classList.remove('active');
      });
    }

    // Logout Button
    const logoutBtn = document.getElementById('logoutDropdownBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        this.logout();
      });
    }
  }

  switchAuthStep(step) {
    const credsStep = document.getElementById('authStepCredentials');
    const otpStep = document.getElementById('authStepOtp');

    if (step === 'otp') {
      if (credsStep) credsStep.style.display = 'none';
      if (otpStep) otpStep.style.display = 'block';
    } else {
      if (credsStep) credsStep.style.display = 'block';
      if (otpStep) otpStep.style.display = 'none';
    }
  }

  /**
   * Generates a 6-digit OTP code and triggers the realistic Gmail notification
   */
  startGmailOtpFlow(email, name, isSignUp) {
    // Generate secure 6-digit verification code
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();

    this.pendingOtp = {
      code: generatedCode,
      email: email,
      name: name,
      isSignUp: isSignUp,
      expiresAt: Date.now() + 300000
    };

    // Update OTP UI text
    const targetEmailEl = document.getElementById('otpTargetEmailDisplay');
    if (targetEmailEl) targetEmailEl.textContent = email;

    // Show simulated Gmail push alert banner with the code
    const notifBanner = document.getElementById('gmailPushNotification');
    const codeHighlight = document.getElementById('gmailAlertCodeVal');
    if (notifBanner && codeHighlight) {
      codeHighlight.textContent = generatedCode;
      notifBanner.style.display = 'flex';
    }

    // Clear and focus OTP inputs
    for (let i = 1; i <= 6; i++) {
      const box = document.getElementById(`otpBox${i}`);
      if (box) box.value = '';
    }

    this.switchAuthStep('otp');

    setTimeout(() => {
      document.getElementById('otpBox1')?.focus();
    }, 150);

    // Start 30s resend timer
    this.startResendTimer();

    this.showToast(`Verification code delivered to ${email}! Check notification banner.`, 'info');
  }

  setupOtpInputNavigation() {
    for (let i = 1; i <= 6; i++) {
      const box = document.getElementById(`otpBox${i}`);
      if (!box) continue;

      box.addEventListener('input', (e) => {
        const val = e.target.value;
        if (val.length >= 1) {
          box.value = val.slice(-1); // Single digit
          if (i < 6) {
            document.getElementById(`otpBox${i + 1}`)?.focus();
          } else {
            // Auto-submit when 6th digit is entered
            this.submitOtpVerification();
          }
        }
      });

      box.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !box.value && i > 1) {
          document.getElementById(`otpBox${i - 1}`)?.focus();
        }
      });

      // Support pasting 6-digit code
      box.addEventListener('paste', (e) => {
        e.preventDefault();
        const pastedData = (e.clipboardData || window.clipboardData).getData('text').trim();
        if (/^\d{6}$/.test(pastedData)) {
          for (let j = 0; j < 6; j++) {
            const b = document.getElementById(`otpBox${j + 1}`);
            if (b) b.value = pastedData[j];
          }
          this.submitOtpVerification();
        }
      });
    }
  }

  startResendTimer() {
    const resendBtn = document.getElementById('resendOtpCodeBtn');
    const timerSpan = document.getElementById('resendTimerCountdown');
    if (!resendBtn || !timerSpan) return;

    if (this.resendTimerInterval) clearInterval(this.resendTimerInterval);

    let seconds = 30;
    resendBtn.disabled = true;
    timerSpan.textContent = `(${seconds}s)`;

    this.resendTimerInterval = setInterval(() => {
      seconds--;
      if (seconds > 0) {
        timerSpan.textContent = `(${seconds}s)`;
      } else {
        clearInterval(this.resendTimerInterval);
        resendBtn.disabled = false;
        timerSpan.textContent = '';
      }
    }, 1000);
  }

  submitOtpVerification() {
    let enteredCode = '';
    for (let i = 1; i <= 6; i++) {
      const box = document.getElementById(`otpBox${i}`);
      enteredCode += box ? box.value : '';
    }

    if (enteredCode.length < 6) {
      this.showToast('Please enter all 6 digits of the verification code', 'info');
      return;
    }

    if (!this.pendingOtp || enteredCode !== this.pendingOtp.code) {
      this.showToast('Incorrect verification code. Please check the Gmail alert banner.', 'info');
      // Shake animation on inputs
      const row = document.getElementById('otpInputsRow');
      if (row) {
        row.style.transform = 'translateX(6px)';
        setTimeout(() => row.style.transform = 'translateX(-6px)', 80);
        setTimeout(() => row.style.transform = 'translateX(0)', 160);
      }
      return;
    }

    // Code matches! Log in or create user
    const email = this.pendingOtp.email;
    const name = this.pendingOtp.name;

    if (!this.usersDb[email]) {
      // Create new user account with 500 welcome points
      this.usersDb[email] = {
        name: name || 'Eco Recycler',
        email: email,
        points: 500,
        tier: 'Eco Pioneer',
        avatarInitial: (name || email).charAt(0).toUpperCase(),
        phone: '+91 98000 00000',
        city: 'Hyderabad, Telangana',
        submissions: [],
        redemptions: []
      };
      this.saveUsersDb();
    }

    // Save active session
    localStorage.setItem(SESSION_KEY, email);
    this.loginUser(email, true);
  }

  loginUser(email, isJustVerified = false) {
    this.currentUser = this.usersDb[email];
    if (!this.currentUser) return;

    this.hideAuthGate();
    this.updateUserUI();
    this.renderRecentActivity();
    this.renderMySubmissions();
    this.updateImpactCounters();

    // Start on Eco Tips view
    this.switchView('tipsView');

    if (isJustVerified) {
      this.showToast(`Welcome, ${this.currentUser.name}! Signed in via Gmail.`, 'success');
    }

    // Initialize Map & Charts once logged in
    setTimeout(() => {
      window.EcoMap?.initMap();
      window.ImpactCharts?.initCharts();
    }, 200);
  }

  logout() {
    localStorage.removeItem(SESSION_KEY);
    this.currentUser = null;
    this.showAuthGate();
    this.showToast('Logged out successfully. Please sign in to access your account.', 'info');
  }

  fastLogin(email) {
    if (this.usersDb[email]) {
      this.startGmailOtpFlow(email, this.usersDb[email].name, false);
    }
  }

  /* ==========================================================================
     APPLICATION NAVIGATION & STATE METHODS
     ========================================================================== */
  bindNavEvents() {
    const navButtons = document.querySelectorAll('.nav-item-btn[data-view]');
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const viewId = btn.getAttribute('data-view');
        this.switchView(viewId, btn);
      });
    });

    const locateMeBtn = document.getElementById('gpsLocateMeBtn');
    if (locateMeBtn) {
      locateMeBtn.addEventListener('click', () => {
        window.EcoMap?.requestLocationPin();
      });
    }
  }

  switchView(viewId, targetNavBtn) {
    const navButtons = document.querySelectorAll('.nav-item-btn[data-view]');
    navButtons.forEach(b => b.classList.remove('active'));

    const correspondingBtn = targetNavBtn || document.querySelector(`.nav-item-btn[data-view="${viewId}"]`);
    if (correspondingBtn) {
      correspondingBtn.classList.add('active');
    }

    const views = document.querySelectorAll('.app-view');
    views.forEach(v => v.classList.remove('active'));

    const targetView = document.getElementById(viewId);
    if (targetView) {
      targetView.classList.add('active');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (viewId === 'dashboardView') {
      setTimeout(() => {
        window.ImpactCharts?.refreshCharts();
      }, 100);
    } else if (viewId === 'mapView') {
      window.EcoMap?.forceRefresh();
    } else if (viewId === 'submissionsView') {
      this.renderMySubmissions();
    } else if (viewId === 'redemptionsView') {
      window.Rewards?.renderMyRedemptions();
    } else if (viewId === 'rewardsView') {
      window.Rewards?.renderCatalog();
    }
  }

  updateUserUI() {
    if (!this.currentUser) return;

    const pointsDisplays = document.querySelectorAll('.user-points-val');
    pointsDisplays.forEach(el => {
      el.textContent = this.currentUser.points.toLocaleString();
    });

    const userNameEl = document.getElementById('navUserName');
    if (userNameEl) userNameEl.textContent = this.currentUser.name;

    const userTierEl = document.getElementById('navUserTier');
    if (userTierEl) userTierEl.textContent = this.currentUser.tier;

    const avatarInitialEl = document.getElementById('navAvatarInitial');
    if (avatarInitialEl) avatarInitialEl.textContent = this.currentUser.avatarInitial || 'U';

    const pill = document.getElementById('navRedemptionsPill');
    if (pill) pill.textContent = this.currentUser.redemptions.length;

    const subsPill = document.getElementById('navSubmissionsPill');
    if (subsPill) subsPill.textContent = this.currentUser.submissions.length;

    // Dropdown details
    const dropEmail = document.getElementById('dropdownUserEmail');
    if (dropEmail) dropEmail.textContent = this.currentUser.email;
    const dropName = document.getElementById('dropdownUserName');
    if (dropName) dropName.textContent = this.currentUser.name;
  }

  getUserPoints() {
    return this.currentUser ? this.currentUser.points : 0;
  }

  getUserSubmissions() {
    return this.currentUser ? this.currentUser.submissions : [];
  }

  getUserRedemptions() {
    return this.currentUser ? this.currentUser.redemptions : [];
  }

  addEwasteSubmission(submission) {
    if (!this.currentUser) return;

    this.currentUser.submissions.unshift(submission);
    this.currentUser.points += submission.pointsEarned;

    // Update tier dynamically based on points
    if (this.currentUser.points >= 2500) {
      this.currentUser.tier = 'Earth Guardian';
    } else if (this.currentUser.points >= 1500) {
      this.currentUser.tier = 'Green Vanguard';
    } else if (this.currentUser.points >= 800) {
      this.currentUser.tier = 'Active Recycler';
    }

    this.saveUsersDb();
    this.updateUserUI();
    this.renderRecentActivity();
    this.renderMySubmissions();
    this.updateImpactCounters();
    window.ImpactCharts?.refreshCharts();
    this.showToast(`+${submission.pointsEarned} Points credited to your account!`, 'success');
  }

  deductPoints(points) {
    if (!this.currentUser || this.currentUser.points < points) return false;
    this.currentUser.points -= points;
    this.saveUsersDb();
    this.updateUserUI();
    return true;
  }

  addRedemption(redemption) {
    if (!this.currentUser) return;
    this.currentUser.redemptions.unshift(redemption);
    this.saveUsersDb();
    this.updateUserUI();
  }

  renderMySubmissions() {
    const container = document.getElementById('mySubmissionsListContainer');
    const countBadge = document.getElementById('mySubmissionsCountBadge');
    if (!container || !this.currentUser) return;

    const subs = this.currentUser.submissions;
    if (countBadge) countBadge.textContent = `${subs.length} Drop-offs Recorded`;

    if (subs.length === 0) {
      container.innerHTML = `
        <div class="empty-redemptions" style="grid-column: 1 / -1;">
          <div class="empty-icon"><i class="fa-solid fa-camera"></i></div>
          <h3>No E-Waste Submissions Yet</h3>
          <p style="color: #94a3b8; max-width: 480px; margin: 0.5rem auto 1.5rem;">
            Ready to recycle old phones, batteries, laptops, or cables? Upload a photo and get live GPS geotagged verification to start earning rewards!
          </p>
          <button class="btn-primary" onclick="window.App.switchView('submitView')">
            <i class="fa-solid fa-camera"></i> Submit E-Waste Now
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = subs.map(sub => `
      <div class="submission-history-card">
        <div class="sub-img-wrap">
          <img src="${sub.thumbUrl || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=80'}" alt="${sub.categoryLabel}" />
          <span class="sub-geotag-badge"><i class="fa-solid fa-satellite-dish"></i> GPS Verified</span>
        </div>
        <div class="sub-body">
          <div class="sub-header">
            <div>
              <span class="mini-tag" style="color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3);">${sub.categoryLabel}</span>
              <h4 class="sub-title">${sub.weightKg} kg Recycled</h4>
            </div>
            <div class="sub-points-pill">+${sub.pointsEarned} Pts</div>
          </div>

          <div class="sub-meta-row">
            <i class="fa-solid fa-location-dot" style="color: #10b981;"></i>
            <span>${sub.address || sub.centerName || 'Telangana, India'}</span>
          </div>
          <div class="sub-meta-row">
            <i class="fa-solid fa-building-circle-check" style="color: #38bdf8;"></i>
            <span>Hub: ${sub.centerName || 'Certified Center'}</span>
          </div>
          <div class="sub-meta-row">
            <i class="fa-regular fa-calendar" style="color: #fbbf24;"></i>
            <span>${sub.date} • ${sub.time || '10:00 AM IST'}</span>
          </div>

          <div class="sub-footer">
            <div style="font-size: 11px; color: #34d399; font-weight: 700;">
              <i class="fa-solid fa-leaf"></i> ${sub.co2Saved || (sub.weightKg * 2.1).toFixed(1)} kg CO₂ diverted
            </div>
            <button class="btn-mini" onclick="window.App.downloadSubmissionReceipt('${sub.id}')" title="Download Geotagged Receipt">
              <i class="fa-solid fa-receipt"></i> Receipt
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  downloadSubmissionReceipt(subId) {
    if (!this.currentUser) return;
    const sub = this.currentUser.submissions.find(s => s.id === subId);
    if (!sub) return;

    if (sub.thumbUrl && sub.thumbUrl.startsWith('data:image')) {
      const a = document.createElement('a');
      a.href = sub.thumbUrl;
      a.download = `ecocollect-receipt-${sub.id}.jpg`;
      a.click();
      this.showToast('Verification receipt downloaded!', 'success');
    } else {
      this.showToast(`Verified drop-off for ${sub.categoryLabel} (${sub.weightKg} kg) recorded.`, 'info');
    }
  }

  renderRecentActivity() {
    const container = document.getElementById('recentActivityList');
    if (!container || !this.currentUser) return;

    if (this.currentUser.submissions.length === 0) {
      container.innerHTML = `<p style="color: #94a3b8; font-size: 13px; text-align: center; padding: 1.5rem;">No submissions yet. Submit e-waste to earn points!</p>`;
      return;
    }

    container.innerHTML = this.currentUser.submissions.slice(0, 4).map(sub => `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 0; border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div style="width: 38px; height: 38px; border-radius: 10px; background: rgba(16, 185, 129, 0.15); display: flex; align-items: center; justify-content: center; color: #34d399; font-size: 1.1rem;">
            <i class="fa-solid fa-recycle"></i>
          </div>
          <div>
            <div style="font-weight: 700; font-size: 0.92rem; color: #f8fafc;">${sub.categoryLabel} (${sub.weightKg} kg)</div>
            <div style="font-size: 0.76rem; color: #94a3b8;">${sub.centerName} • ${sub.date}</div>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-weight: 800; color: #fbbf24; font-size: 0.95rem;">+${sub.pointsEarned} Pts</div>
          <div style="font-size: 0.72rem; color: #38bdf8;">Verified Geotag</div>
        </div>
      </div>
    `).join('');
  }

  updateImpactCounters() {
    if (!this.currentUser) return;

    let totalKg = 0;
    let totalCo2 = 0;

    this.currentUser.submissions.forEach(s => {
      totalKg += s.weightKg;
      totalCo2 += parseFloat(s.co2Saved) || (s.weightKg * 2.1);
    });

    const totalWeightEl = document.getElementById('impactTotalWeight');
    const totalCo2El = document.getElementById('impactTotalCo2');
    const totalSubmissionsEl = document.getElementById('impactTotalSubmissions');
    const treesPlantedEquiv = document.getElementById('impactTreesEquiv');
    const waterProtectedEquiv = document.getElementById('impactWaterEquiv');

    if (totalWeightEl) totalWeightEl.textContent = `${totalKg.toFixed(1)} kg`;
    if (totalCo2El) totalCo2El.textContent = `${totalCo2.toFixed(1)} kg`;
    if (totalSubmissionsEl) totalSubmissionsEl.textContent = this.currentUser.submissions.length;
    if (treesPlantedEquiv) treesPlantedEquiv.textContent = `${Math.max(1, Math.round(totalKg * 1.8))} Trees`;
    if (waterProtectedEquiv) waterProtectedEquiv.textContent = `${Math.round(totalKg * 140)} Liters`;
  }

  initChecklistListeners() {
    const checkboxes = document.querySelectorAll('.eco-check-input');
    const countEl = document.getElementById('checklistCheckedCount');
    const progressEl = document.getElementById('checklistProgressBar');
    const readyBanner = document.getElementById('checklistReadyBanner');

    const updateChecklist = () => {
      let checked = 0;
      checkboxes.forEach(cb => {
        if (cb.checked) checked++;
      });

      if (countEl) countEl.textContent = `${checked} of ${checkboxes.length} Checked`;
      if (progressEl) progressEl.style.width = `${(checked / checkboxes.length) * 100}%`;

      if (readyBanner) {
        if (checked === checkboxes.length) {
          readyBanner.style.display = 'flex';
        } else {
          readyBanner.style.display = 'none';
        }
      }
    };

    checkboxes.forEach(cb => {
      cb.addEventListener('change', updateChecklist);
    });
  }

  openAuthModal() {
    if (!this.currentUser) return;
    const modal = document.getElementById('authModal');
    if (modal) {
      document.getElementById('authUserNameInput').value = this.currentUser.name;
      document.getElementById('authUserEmailInput').value = this.currentUser.email;
      modal.classList.add('active');
    }
  }

  closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) modal.classList.remove('active');
  }

  saveUserProfile() {
    if (!this.currentUser) return;
    const name = document.getElementById('authUserNameInput')?.value || 'Eco Recycler';

    this.currentUser.name = name;
    this.currentUser.avatarInitial = name.charAt(0).toUpperCase();

    this.saveUsersDb();
    this.updateUserUI();
    this.closeAuthModal();
    this.showToast('Profile updated successfully!', 'success');
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-info';
    toast.innerHTML = `<i class="${icon}"></i> <span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
}

window.App = new EcoCollectApp();
