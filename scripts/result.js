// Function to populate the tables based on localStorage data
function populateTables() {
  const fuelConsumptionTable = document.getElementById('fuel-consumption-table').querySelector('tbody');
  const ciiGradeTable = document.getElementById('cii-grade-table').querySelector('tbody');

  const startYear = 2024;
  const endYear = 2030;
  const initialSpeed = parseFloat(localStorage.getItem('initial_speed'));

  for (let i = 0; i < 8; i++) {
    const speed = (initialSpeed - i).toFixed(3);

    // Populate Fuel Consumption Table
    const fuelRow = document.createElement('tr');
    const lowerMarginMe = parseFloat(localStorage.getItem(`result_${startYear}_${i}_margin_dn_me`)).toFixed(3);
    const upperMarginMe = parseFloat(localStorage.getItem(`result_${startYear}_${i}_margin_up_me`)).toFixed(3);
    const lowerMarginAe = parseFloat(localStorage.getItem(`result_${startYear}_${i}_margin_dn_ae`)).toFixed(3);
    const upperMarginAe = parseFloat(localStorage.getItem(`result_${startYear}_${i}_margin_up_ae`)).toFixed(3);

    fuelRow.innerHTML = `
      <td>${speed}</td>
      <td>${lowerMarginMe}</td>
      <td>${upperMarginMe}</td>
      <td>${lowerMarginAe}</td>
      <td>${upperMarginAe}</td>
    `;
    fuelConsumptionTable.appendChild(fuelRow);

    // Populate CII Grade Table
    const ciiRow = document.createElement('tr');
    ciiRow.innerHTML = `<td>${speed}</td>`;
    
    for (let year = startYear; year <= endYear; year++) {
      const ciiGrade = localStorage.getItem(`result_${year}_${i}_cii_grade`);
      const ciiCell = document.createElement('td');
      ciiCell.textContent = ciiGrade;
      ciiRow.appendChild(ciiCell);
    }
    
    ciiGradeTable.appendChild(ciiRow);
  }
}

// Call populateTables on DOMContentLoaded
document.addEventListener('DOMContentLoaded', populateTables);
