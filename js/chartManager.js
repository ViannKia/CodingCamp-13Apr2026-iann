// js/chartManager.js — Chart.js wrapper (vanilla JS, global scope)

var ChartManager = (function () {
  var chartInstance = null;
  var COLORS = {
    Food: '#f97316',
    Transport: '#3b82f6',
    Fun: '#a855f7'
  };
  var DEFAULT_COLOR = '#6b7280';

  function initChart(canvasId) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) {
      console.warn('ChartManager: canvas #' + canvasId + ' not found');
      return;
    }
    if (typeof Chart === 'undefined') {
      var container = canvas.parentElement;
      if (container) container.innerHTML = '<p class="chart-fallback">Chart tidak tersedia (Chart.js gagal dimuat).</p>';
      return;
    }
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
    chartInstance = new Chart(canvas, {
      type: 'pie',
      data: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: function (context) {
                var val = context.parsed;
                return context.label + ': Rp ' + Number(val).toLocaleString('id-ID');
              }
            }
          }
        }
      }
    });
  }

  function updateChart(categoryTotals) {
    var canvas = document.getElementById('expense-chart');
    var emptyMsg = document.getElementById('chart-empty');

    var keys = Object.keys(categoryTotals || {});

    if (keys.length === 0) {
      if (chartInstance) { chartInstance.destroy(); chartInstance = null; }
      if (canvas) canvas.style.display = 'none';
      if (emptyMsg) emptyMsg.style.display = 'block';
      return;
    }

    if (canvas) canvas.style.display = 'block';
    if (emptyMsg) emptyMsg.style.display = 'none';

    if (!chartInstance) initChart('expense-chart');
    if (!chartInstance) return;

    var labels = keys;
    var data = keys.map(function (k) { return categoryTotals[k]; });
    var colors = keys.map(function (k) { return COLORS[k] || DEFAULT_COLOR; });

    chartInstance.data.labels = labels;
    chartInstance.data.datasets[0].data = data;
    chartInstance.data.datasets[0].backgroundColor = colors;
    chartInstance.update();
  }

  function destroyChart() {
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
  }

  return {
    initChart: initChart,
    updateChart: updateChart,
    destroyChart: destroyChart
  };
})();
