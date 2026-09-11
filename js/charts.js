/**
 * EcoCollect Telangana - Colorful Impact Dashboard Charts (Chart.js)
 * Visualizes total weight recycled, category composition, and points accumulation.
 */

class ImpactChartsManager {
  constructor() {
    this.compositionChart = null;
    this.monthlyVolumeChart = null;
    this.pointsGrowthChart = null;
    this.isInitialized = false;
  }

  initCharts() {
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js not loaded yet, retrying...');
      setTimeout(() => this.initCharts(), 300);
      return;
    }

    this.renderCompositionChart();
    this.renderMonthlyVolumeChart();
    this.renderPointsGrowthChart();
    this.isInitialized = true;
  }

  refreshCharts() {
    if (!this.isInitialized) {
      this.initCharts();
      return;
    }

    if (this.compositionChart) this.compositionChart.update();
    if (this.monthlyVolumeChart) this.monthlyVolumeChart.update();
    if (this.pointsGrowthChart) this.pointsGrowthChart.update();
  }

  /**
   * 1. Category Composition Donut Chart
   */
  renderCompositionChart() {
    const ctx = document.getElementById('wasteCompositionChart');
    if (!ctx) return;

    if (this.compositionChart) {
      this.compositionChart.destroy();
    }

    this.compositionChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [
          'Smartphones & Tablets',
          'Laptops & PCs',
          'Lithium Batteries',
          'Circuit Boards & Cables',
          'Monitors & TVs',
          'Appliances'
        ],
        datasets: [{
          data: [32, 26, 18, 12, 7, 5],
          backgroundColor: [
            '#10b981', // Emerald
            '#38bdf8', // Sky Blue
            '#f59e0b', // Amber
            '#c084fc', // Purple
            '#2dd4bf', // Teal
            '#f43f5e'  // Rose
          ],
          borderColor: '#0f172a',
          borderWidth: 3,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#cbd5e1',
              font: { family: 'Plus Jakarta Sans', size: 12 },
              padding: 14,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleFont: { family: 'Outfit', size: 14, weight: 'bold' },
            bodyFont: { family: 'Plus Jakarta Sans', size: 13 },
            borderColor: 'rgba(16, 185, 129, 0.4)',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: (context) => ` ${context.label}: ${context.raw}% by weight`
            }
          }
        }
      }
    });
  }

  /**
   * 2. Monthly Recycling Volume Bar & Line Chart
   */
  renderMonthlyVolumeChart() {
    const ctx = document.getElementById('monthlyVolumeChart');
    if (!ctx) return;

    if (this.monthlyVolumeChart) {
      this.monthlyVolumeChart.destroy();
    }

    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.85)');
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.15)');

    this.monthlyVolumeChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep 2026'],
        datasets: [
          {
            type: 'bar',
            label: 'Recycled Weight (kg)',
            data: [4.2, 7.8, 12.5, 18.2, 24.6, 31.0],
            backgroundColor: gradient,
            borderColor: '#10b981',
            borderWidth: 2,
            borderRadius: 8,
            barThickness: 28
          },
          {
            type: 'line',
            label: 'Target Goal (kg)',
            data: [5.0, 10.0, 15.0, 20.0, 25.0, 30.0],
            borderColor: '#38bdf8',
            borderWidth: 2.5,
            borderDash: [5, 5],
            pointBackgroundColor: '#38bdf8',
            pointRadius: 4,
            fill: false,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 11 } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.06)' },
            ticks: {
              color: '#94a3b8',
              font: { family: 'Plus Jakarta Sans', size: 11 },
              callback: (val) => `${val} kg`
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: { color: '#cbd5e1', font: { family: 'Plus Jakarta Sans', size: 12 }, usePointStyle: true }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            borderColor: 'rgba(56, 189, 248, 0.4)',
            borderWidth: 1,
            padding: 12
          }
        }
      }
    });
  }

  /**
   * 3. Points Growth Trajectory Area Chart
   */
  renderPointsGrowthChart() {
    const ctx = document.getElementById('pointsGrowthChart');
    if (!ctx) return;

    if (this.pointsGrowthChart) {
      this.pointsGrowthChart.destroy();
    }

    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 280);
    gradient.addColorStop(0, 'rgba(245, 158, 11, 0.45)');
    gradient.addColorStop(1, 'rgba(245, 158, 11, 0.02)');

    this.pointsGrowthChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Current'],
        datasets: [{
          label: 'Cumulative Reward Points',
          data: [420, 890, 1350, 1780, 2100, 2450],
          borderColor: '#f59e0b',
          backgroundColor: gradient,
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#fbbf24',
          pointBorderColor: '#0f172a',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 11 } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.06)' },
            ticks: {
              color: '#94a3b8',
              font: { family: 'Plus Jakarta Sans', size: 11 },
              callback: (val) => `${val} pts`
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            borderColor: 'rgba(245, 158, 11, 0.4)',
            borderWidth: 1,
            padding: 12
          }
        }
      }
    });
  }
}

window.ImpactCharts = new ImpactChartsManager();
