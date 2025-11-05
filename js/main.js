const initChart = () => {
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
  const labels = months.map(month => month.at(0).toUpperCase() + month.slice(1))

  const getValues = prefix =>
    months.map(month => {
      const value = document.getElementById(`${prefix}-${month}`)?.value
      return Number(value) || 0
    })

  const ctx = document.getElementById('barChart')?.getContext('2d')
  if (!ctx) return
  
  const chartConfig = {
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
  }
  
  const chart = new Chart(ctx, chartConfig)

  // update chart when inputs change
  document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', () => {
      const [income, expenses] = ['income', 'expenses'].map(getValues)
      Object.assign(chart.data.datasets[0], { data: income })
      Object.assign(chart.data.datasets[1], { data: expenses })
      chart.update()
    })
  })

  // Download chart as PNG when button clicked
  const downloadChart = async () => {
    try {
      const url = chart.toBase64Image()
      const link = document.createElement('a')
      Object.assign(link, {
        href: url,
        download: 'copilot-practices-chart.png'
      })
      // Some browsers require the anchor to be in the document
      document.body.append(link)
      link.click()
      link.remove()
    } catch (error) {
      // fallback: open image in new tab
      window.open(chart.toBase64Image(), '_blank')
    }
  }

  document.getElementById('downloadChartBtn')?.addEventListener('click', downloadChart)
}

// Username validation: not-empty on blur, length 4-20, letters only.
const validateUsername = () => {
  const input = document.getElementById('username')
  const error = document.getElementById('usernameError')
  if (!input) return false

  const value = input.value.trim()
  const validationRules = [
    {
      test: value => value !== '',
      message: 'Username is required.'
    },
    {
      test: value => value.length >= 4 && value.length <= 20,
      message: 'Username must be between 4 and 20 characters.'
    },
    {
      test: value => /^[A-Za-z]+$/.test(value),
      message: 'Username must contain letters only (no numbers or symbols).'
    }
  ]

  // Reset previous state
  input.classList.remove('is-valid', 'is-invalid')
  error.textContent = ''

  // Find first validation failure if any
  const failure = validationRules.find(rule => !rule.test(value))
  
  if (failure) {
    input.classList.add('is-invalid')
    error.textContent = failure.message
    return false
  }

  // Valid
  input.classList.add('is-valid')
  return true
}

// Hook events after DOM loads
const initUserValidation = () => {
  const input = document.getElementById('username')
  if (!input) return

  // Clear validation while typing (friendly UX)
  const clearValidation = () => {
    input.classList.remove('is-invalid', 'is-valid')
    document.getElementById('usernameError')?.textContent = ''
  }

  // Prevent form submission if invalid
  const handleSubmit = event => {
    if (!validateUsername()) {
      event.preventDefault()
      input.focus()
    }
  }

  input.addEventListener('blur', validateUsername)
  input.addEventListener('input', clearValidation)
  input.closest('form')?.addEventListener('submit', handleSubmit)
}

// Initialize all components when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  initUserValidation()
  document.getElementById('barChart') && initChart()
})
