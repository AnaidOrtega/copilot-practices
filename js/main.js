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

// Username validation: not-empty on blur, length 4-20, letters only.
function validateUsername() {
  const input = document.getElementById('username')
  const error = document.getElementById('usernameError')
  if (!input) return false

  const value = input.value.trim()

  // Reset previous state
  input.classList.remove('is-valid', 'is-invalid')
  error.textContent = ''

  if (value === '') {
    input.classList.add('is-invalid')
    error.textContent = 'Username is required.'
    return false
  }

  if (value.length < 4 || value.length > 20) {
    input.classList.add('is-invalid')
    error.textContent = 'Username must be between 4 and 20 characters.'
    return false
  }

  if (!/^[A-Za-z]+$/.test(value)) {
    input.classList.add('is-invalid')
    error.textContent =
      'Username must contain letters only (no numbers or symbols).'
    return false
  }

  // Valid
  input.classList.add('is-valid')
  return true
}

// Hook events after DOM loads
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('username')
  if (!input) return

  // Validate when the input loses focus
  input.addEventListener('blur', validateUsername)

  // Clear validation while typing (friendly UX)
  input.addEventListener('input', () => {
    input.classList.remove('is-invalid', 'is-valid')
    const err = document.getElementById('usernameError')
    if (err) err.textContent = ''
  })

  // Optional: prevent form submission if invalid
  const form = input.closest('form')
  if (form) {
    form.addEventListener('submit', (e) => {
      if (!validateUsername()) {
        e.preventDefault()
        input.focus()
      }
    })
  }
})

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('barChart')) initChart()
})
// ...existing code...
