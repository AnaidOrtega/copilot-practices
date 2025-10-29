// ...existing code...
function initChart() {
  const months = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
  ]
  const labels = months.map((m) => m.charAt(0).toUpperCase() + m.slice(1))

  const getValues = (prefix) =>
    months.map((m) => {
      const el = document.getElementById(`${prefix}-${m}`)
      return el ? parseFloat(el.value) || 0 : 0
    })

  const ctx = document.getElementById('barChart').getContext('2d')
  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Income',
          data: getValues('income'),
          backgroundColor: 'rgba(13,110,253,0.7)', // bootstrap primary
        },
        {
          label: 'Expenses',
          data: getValues('expenses'),
          backgroundColor: 'rgba(220,53,69,0.7)', // bootstrap danger
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { stacked: false },
        y: { beginAtZero: true },
      },
    },
  })

  // update chart when inputs change
  document.querySelectorAll('input[type="number"]').forEach((input) => {
    input.addEventListener('input', () => {
      chart.data.datasets[0].data = getValues('income')
      chart.data.datasets[1].data = getValues('expenses')
      chart.update()
    })
  })

  // Download chart as PNG when button clicked
  const downloadBtn = document.getElementById('downloadChartBtn')
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      try {
        const url = chart.toBase64Image()
        const a = document.createElement('a')
        a.href = url
        a.download = 'copilot-practices-chart.png'
        // Some browsers require the anchor to be in the document
        document.body.appendChild(a)
        a.click()
        a.remove()
      } catch (e) {
        // fallback: open image in new tab
        window.open(chart.toBase64Image(), '_blank')
      }
    })
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('barChart')) initChart()
})
// ...existing code...
