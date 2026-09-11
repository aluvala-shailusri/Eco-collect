/**
 * EcoCollect Telangana - Rewards Catalog & Dedicated "My Redemptions" Vault
 * - Expanded rewards catalog with Vegetable Seeds, Reusable Cotton Bags, Amazon Vouchers,
 *   Xbox Gaming Vouchers, PlayStation, Spotify, and Eco Lifestyle products.
 * - Removed "weekend getaway package" completely as requested.
 * - Manages "My Redemptions" section where users view claimed products & secret voucher codes.
 */

const REWARDS_CATALOG = [
  // --- ECO & SUSTAINABLE LIVING (Seeds, Bags, Lifestyle) ---
  {
    id: 'rew-seed-01',
    title: 'Organic Vegetable Garden Seeds Kit (12 Varieties)',
    category: 'eco',
    categoryLabel: 'Seeds & Gardening',
    points: 320,
    retailValue: '₹499',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=600&auto=format&fit=crop&q=80',
    description: '12 non-GMO heirloom vegetable seed packets (Tomato, Spinach, Brinjal, Chilli, Coriander, Fenugreek, etc.) with coco-peat starter pot.'
  },
  {
    id: 'rew-bag-01',
    title: 'Organic Cotton Reusable Grocery Bags (Pack of 3)',
    category: 'eco',
    categoryLabel: 'Zero Waste',
    points: 280,
    retailValue: '₹449',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
    description: '100% unbleached heavy-duty organic cotton tote bags. Replaces over 500 single-use plastic bags per year.'
  },
  {
    id: 'rew-eco-03',
    title: 'Zero-Waste Bamboo Cutlery & Straw Travel Kit',
    category: 'eco',
    categoryLabel: 'Eco Travel',
    points: 350,
    retailValue: '₹599',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    description: 'Complete travel dining pouch with fork, spoon, knife, chopsticks, bamboo straw, and natural fiber cleaning brush.'
  },
  {
    id: 'rew-eco-04',
    title: 'Plant 5 Native Trees in Telangana (Haritha Haram Certificate)',
    category: 'eco',
    categoryLabel: 'Haritha Haram Partner',
    points: 300,
    retailValue: 'Priceless',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
    description: 'We plant 5 geo-tagged native saplings in Telangana green belt with an official government partner certificate.'
  },
  {
    id: 'rew-eco-05',
    title: 'Recycled Titanium Insulated Bottle (750ml)',
    category: 'eco',
    categoryLabel: 'Sustainable Life',
    points: 450,
    retailValue: '₹899',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80',
    description: 'Double-walled vacuum insulated bottle, keeps beverages cold 24h / hot 12h, 100% BPA-free.'
  },
  {
    id: 'rew-eco-06',
    title: 'Bamboo Eco Desktop Organizer & Phone Cradle',
    category: 'eco',
    categoryLabel: 'Green Desk',
    points: 520,
    retailValue: '₹999',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80',
    description: 'Handcrafted sustainable bamboo smartphone dock, stationery organizer, and cable routing channel.'
  },
  {
    id: 'rew-eco-07',
    title: 'Solar LED Emergency Study Lamp',
    category: 'eco',
    categoryLabel: 'Solar Living',
    points: 700,
    retailValue: '₹1,299',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80',
    description: 'High lumen adjustable LED study lamp with built-in solar collector and emergency 5V mobile charging output.'
  },

  // --- AMAZON PAY VOUCHERS ---
  {
    id: 'rew-amz-01',
    title: 'Amazon Pay ₹250 Gift Voucher',
    category: 'vouchers',
    categoryLabel: 'Amazon Pay',
    points: 300,
    retailValue: '₹250',
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&auto=format&fit=crop&q=80',
    description: 'Instant digital Amazon Pay gift code for quick shopping, recharges, and bill payments across India.'
  },
  {
    id: 'rew-amz-02',
    title: 'Amazon Pay ₹500 Gift Voucher',
    category: 'vouchers',
    categoryLabel: 'Amazon Pay',
    points: 600,
    retailValue: '₹500',
    image: 'https://images.unsplash.com/photo-1556742049-0a67e5572293?w=600&auto=format&fit=crop&q=80',
    description: 'Redeemable on Amazon.in for millions of electronics, books, groceries, and partner apps.'
  },
  {
    id: 'rew-amz-03',
    title: 'Amazon Pay ₹1,000 Gift Voucher',
    category: 'vouchers',
    categoryLabel: 'Amazon Pay',
    points: 1150,
    retailValue: '₹1,000',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&auto=format&fit=crop&q=80',
    description: 'Direct ₹1,000 digital shopping code delivered instantly to your EcoCollect My Redemptions vault.'
  },
  {
    id: 'rew-amz-04',
    title: 'Amazon Pay ₹2,000 Shopping Voucher',
    category: 'vouchers',
    categoryLabel: 'Amazon Pay',
    points: 2200,
    retailValue: '₹2,000',
    image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=600&auto=format&fit=crop&q=80',
    description: 'Premium ₹2,000 Amazon Pay voucher with 1-year validity for major electronics and home appliances.'
  },

  // --- GAMING & ENTERTAINMENT VOUCHERS (Xbox, PlayStation, Spotify) ---
  {
    id: 'rew-xbox-01',
    title: 'Xbox Game Pass Ultimate (1-Month Pass)',
    category: 'gaming',
    categoryLabel: 'Xbox Gaming',
    points: 750,
    retailValue: '₹549',
    image: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=600&auto=format&fit=crop&q=80',
    description: 'Unlimited access to over 100 high-quality console and PC games, EA Play membership, and online multiplayer.'
  },
  {
    id: 'rew-xbox-02',
    title: 'Xbox ₹1,000 Digital Gift Card',
    category: 'gaming',
    categoryLabel: 'Xbox Gaming',
    points: 1250,
    retailValue: '₹1,000',
    image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=600&auto=format&fit=crop&q=80',
    description: 'Buy full games, DLCs, season passes, movies, and TV shows directly on Microsoft Xbox Store.'
  },
  {
    id: 'rew-playstation-01',
    title: 'PlayStation Store ₹1,000 Digital Code',
    category: 'gaming',
    categoryLabel: 'PlayStation',
    points: 1250,
    retailValue: '₹1,000',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    description: 'Add ₹1,000 to your PSN wallet for PS5 and PS4 games, add-ons, and PlayStation Plus plans.'
  },
  {
    id: 'rew-spotify-01',
    title: 'Spotify Premium 3-Month Pass',
    category: 'gaming',
    categoryLabel: 'Music Streaming',
    points: 480,
    retailValue: '₹389',
    image: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=600&auto=format&fit=crop&q=80',
    description: 'Enjoy ad-free music listening, offline downloads, and unlimited skips in high-fidelity audio.'
  },

  // --- RETAIL, FOOD & TECH REWARDS ---
  {
    id: 'rew-flipkart-01',
    title: 'Flipkart ₹750 Shopping Voucher',
    category: 'vouchers',
    categoryLabel: 'Shopping',
    points: 850,
    retailValue: '₹750',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&auto=format&fit=crop&q=80',
    description: 'Redeemable on Flipkart India for electronics, fashion, lifestyle, and home essentials.'
  },
  {
    id: 'rew-croma-01',
    title: 'Croma Electronics ₹1,500 Voucher',
    category: 'vouchers',
    categoryLabel: 'Retail Tech',
    points: 1400,
    retailValue: '₹1,500',
    image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80',
    description: 'Valid in-store across all Croma branches in Hyderabad, Secunderabad, and online at croma.com.'
  },
  {
    id: 'rew-swiggy-01',
    title: 'Swiggy / Zomato ₹300 Meal Voucher',
    category: 'vouchers',
    categoryLabel: 'Food & Dining',
    points: 350,
    retailValue: '₹300',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80',
    description: 'Enjoy fresh meals delivered from top local restaurants and green cafes in Telangana.'
  },
  {
    id: 'rew-tech-01',
    title: 'Noise-Cancelling Bluetooth Earbuds',
    category: 'electronics',
    categoryLabel: 'Electronics & Audio',
    points: 1800,
    retailValue: '₹3,499',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    description: 'Active Noise Cancelling (ANC), 36h battery, built with 40% certified recycled ocean plastics.'
  },
  {
    id: 'rew-tech-02',
    title: '20,000mAh Solar Power Bank',
    category: 'electronics',
    categoryLabel: 'Eco Tech',
    points: 1200,
    retailValue: '₹2,299',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&auto=format&fit=crop&q=80',
    description: 'Rugged fast-charging dual USB-C battery pack equipped with high-efficiency solar trickle panel.'
  },
  {
    id: 'rew-tech-03',
    title: 'Smart Fitness & Health Band Pro',
    category: 'electronics',
    categoryLabel: 'Wearables',
    points: 1450,
    retailValue: '₹2,799',
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&auto=format&fit=crop&q=80',
    description: 'AMOLED display, 24/7 heart rate and SpO2 monitor, 5ATM water resistance, 14-day battery life.'
  }
];

class RewardsManager {
  constructor() {
    this.activeFilter = 'all';
    this.selectedRewardForRedemption = null;
    this.initCatalog();
    this.initRedemptionsVault();
  }

  initCatalog() {
    this.renderCatalog();
  }

  setFilter(categoryKey, targetButton) {
    this.activeFilter = categoryKey;

    const chips = document.querySelectorAll('.category-filter-chips .cat-chip');
    chips.forEach(c => c.classList.remove('active'));
    if (targetButton) {
      targetButton.classList.add('active');
    }

    this.renderCatalog();
  }

  renderCatalog() {
    const grid = document.getElementById('rewardsGridContainer');
    if (!grid) return;

    const userPoints = window.App ? window.App.getUserPoints() : 0;

    const filtered = REWARDS_CATALOG.filter(r => {
      if (this.activeFilter === 'all') return true;
      return r.category === this.activeFilter;
    });

    grid.innerHTML = filtered.map(item => {
      const canAfford = userPoints >= item.points;

      return `
        <div class="reward-card" data-reward-id="${item.id}">
          <div class="reward-img-wrap">
            <img src="${item.image}" alt="${item.title}" loading="lazy" />
            <span class="reward-badge-cat">${item.categoryLabel}</span>
          </div>
          <div class="reward-body">
            <h3 class="reward-title">${item.title}</h3>
            <p class="reward-desc">${item.description}</p>
            <div class="reward-footer">
              <div class="reward-cost">
                <i class="fa-solid fa-coins"></i> ${item.points.toLocaleString()} <span style="font-size: 11px; color: #94a3b8;">Pts</span>
              </div>
              <button 
                class="btn-redeem" 
                onclick="window.Rewards.triggerRedeem('${item.id}')"
                ${canAfford ? '' : 'disabled title="Need more points to redeem"'}
              >
                ${canAfford ? '<i class="fa-solid fa-gift"></i> Redeem' : '<i class="fa-solid fa-lock"></i> Need Pts'}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  triggerRedeem(rewardId) {
    const reward = REWARDS_CATALOG.find(r => r.id === rewardId);
    if (!reward) return;

    const userPoints = window.App ? window.App.getUserPoints() : 0;
    if (userPoints < reward.points) {
      window.App?.showToast(`You need ${(reward.points - userPoints).toLocaleString()} more points!`, 'info');
      return;
    }

    const confirmModal = document.getElementById('redeemConfirmModal');
    if (confirmModal) {
      this.selectedRewardForRedemption = reward;
      document.getElementById('confirmRewardTitle').textContent = reward.title;
      document.getElementById('confirmRewardCost').textContent = `${reward.points.toLocaleString()} Pts`;
      document.getElementById('confirmRewardValue').textContent = reward.retailValue;
      confirmModal.classList.add('active');
    }
  }

  closeConfirmModal() {
    const confirmModal = document.getElementById('redeemConfirmModal');
    if (confirmModal) confirmModal.classList.remove('active');
    this.selectedRewardForRedemption = null;
  }

  confirmRedeem() {
    if (!this.selectedRewardForRedemption) return;
    const reward = this.selectedRewardForRedemption;

    const success = window.App ? window.App.deductPoints(reward.points) : false;
    if (!success) {
      window.App?.showToast('Insufficient points balance', 'info');
      this.closeConfirmModal();
      return;
    }

    const uniqueCode = this.generateVoucherCode(reward.category);
    const now = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 90);

    const redemptionRecord = {
      id: 'red-' + Date.now(),
      rewardId: reward.id,
      title: reward.title,
      categoryLabel: reward.categoryLabel,
      image: reward.image,
      pointsSpent: reward.points,
      voucherCode: uniqueCode,
      redeemedAt: now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      expiresAt: expiryDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'ACTIVE',
      instructions: 'Present this voucher code or scan QR pass at partner stores / redeem directly on website.'
    };

    window.App.addRedemption(redemptionRecord);

    this.closeConfirmModal();
    this.renderCatalog();
    this.renderMyRedemptions();

    window.App.showToast(`Claimed ${reward.title}! Code: ${uniqueCode}`, 'success');
  }

  generateVoucherCode(category = 'generic') {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let rand = '';
    for (let i = 0; i < 4; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const num = Math.floor(1000 + Math.random() * 9000);

    let prefix = 'TG';
    if (category === 'gaming') prefix = 'XBX';
    else if (category === 'vouchers') prefix = 'AMZ';
    else if (category === 'eco') prefix = 'ECO';

    return `ECO-${prefix}-${rand}-${num}`;
  }

  initRedemptionsVault() {
    this.renderMyRedemptions();
  }

  renderMyRedemptions(filterStatus = 'all') {
    const container = document.getElementById('myRedemptionsListContainer');
    const countBadge = document.getElementById('myRedemptionsCountBadge');
    const navPillCount = document.getElementById('navRedemptionsPill');
    if (!container) return;

    const redemptions = window.App ? window.App.getUserRedemptions() : [];

    if (countBadge) countBadge.textContent = `${redemptions.length} Claimed`;
    if (navPillCount) navPillCount.textContent = redemptions.length;

    const filtered = redemptions.filter(r => {
      if (filterStatus === 'all') return true;
      return r.status.toLowerCase() === filterStatus.toLowerCase();
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-redemptions" style="grid-column: 1 / -1;">
          <div class="empty-icon"><i class="fa-solid fa-ticket-simple"></i></div>
          <h3>No Redemptions Found</h3>
          <p style="color: #94a3b8; max-width: 460px; margin: 0.5rem auto 1.5rem;">
            You haven't claimed any rewards yet. Drop off your electronic waste to earn points and claim vegetable seeds, cotton bags, Xbox vouchers, or Amazon Pay gift cards!
          </p>
          <button class="btn-primary" onclick="window.App.switchView('rewardsView')">
            <i class="fa-solid fa-gift"></i> Browse Rewards Catalog
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(item => `
      <div class="voucher-card" data-redemption-id="${item.id}">
        <div class="voucher-header">
          <div>
            <span class="mini-tag" style="color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3);">${item.categoryLabel}</span>
            <div class="voucher-title" style="margin-top: 6px;">${item.title}</div>
          </div>
          <span class="voucher-status-badge ${item.status === 'ACTIVE' ? 'active' : 'used'}">
            ● ${item.status}
          </span>
        </div>

        <div class="voucher-code-box">
          <div class="voucher-code-text">${item.voucherCode}</div>
          <button class="btn-copy-code" onclick="window.Rewards.copyVoucherCode('${item.voucherCode}')" title="Copy code to clipboard">
            <i class="fa-regular fa-copy"></i> Copy
          </button>
        </div>

        <div class="voucher-meta">
          <span><i class="fa-regular fa-calendar-check"></i> Claimed: ${item.redeemedAt}</span>
          <span style="color: #fbbf24;"><i class="fa-regular fa-clock"></i> Valid till: ${item.expiresAt}</span>
        </div>

        <div class="voucher-actions">
          <button class="btn-view-qr" onclick="window.Rewards.showQrModal('${item.id}')">
            <i class="fa-solid fa-qrcode"></i> View QR Pass
          </button>
        </div>
      </div>
    `).join('');
  }

  copyVoucherCode(code) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        window.App?.showToast(`Voucher code "${code}" copied to clipboard!`, 'success');
      }).catch(() => {
        this.fallbackCopy(code);
      });
    } else {
      this.fallbackCopy(code);
    }
  }

  fallbackCopy(text) {
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    window.App?.showToast(`Voucher code "${text}" copied!`, 'success');
  }

  showQrModal(redemptionId) {
    const redemptions = window.App ? window.App.getUserRedemptions() : [];
    const item = redemptions.find(r => r.id === redemptionId);
    if (!item) return;

    const modal = document.getElementById('qrCodeModal');
    if (modal) {
      document.getElementById('qrModalItemTitle').textContent = item.title;
      document.getElementById('qrModalVoucherCode').textContent = item.voucherCode;
      document.getElementById('qrModalExpiry').textContent = `Expires: ${item.expiresAt}`;

      this.drawSimulatedQr(item.voucherCode);
      modal.classList.add('active');
    }
  }

  closeQrModal() {
    const modal = document.getElementById('qrCodeModal');
    if (modal) modal.classList.remove('active');
  }

  drawSimulatedQr(code) {
    const canvas = document.getElementById('simulatedQrCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = 200;
    canvas.width = size;
    canvas.height = size;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = '#0f172a';
    const grid = 25;
    const cellSize = size / grid;

    const drawCorner = (x, y) => {
      ctx.fillRect(x * cellSize, y * cellSize, 7 * cellSize, 7 * cellSize);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect((x + 1) * cellSize, (y + 1) * cellSize, 5 * cellSize, 5 * cellSize);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect((x + 2) * cellSize, (y + 2) * cellSize, 3 * cellSize, 3 * cellSize);
    };

    drawCorner(1, 1);
    drawCorner(grid - 8, 1);
    drawCorner(1, grid - 8);

    let hash = 0;
    for (let i = 0; i < code.length; i++) {
      hash = (hash << 5) - hash + code.charCodeAt(i);
      hash |= 0;
    }

    for (let r = 0; r < grid; r++) {
      for (let c = 0; c < grid; c++) {
        if ((r < 9 && c < 9) || (r < 9 && c >= grid - 9) || (r >= grid - 9 && c < 9)) continue;

        const val = Math.sin(r * 12.9898 + c * 78.233 + hash) * 43758.5453;
        if ((val - Math.floor(val)) > 0.5) {
          ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
        }
      }
    }
  }
}

window.Rewards = new RewardsManager();
