document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('calculatorForm');
    const resultDiv = document.getElementById('result');
    const tableBody = document.querySelector('#cuttingPlanTable tbody');
    const numShelvesPossibleP = document.getElementById('numShelvesPossible');
    const leftoverAreaP = document.getElementById('leftoverArea');
    const remainingLiningP = document.getElementById('remainingLining');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            shelfLength: parseFloat(document.getElementById('shelfLength').value),
            shelfDepth: parseFloat(document.getElementById('shelfDepth').value),
            liningLength: parseFloat(document.getElementById('liningLength').value),
            liningWidth: parseFloat(document.getElementById('liningWidth').value),
            unit: document.getElementById('unit').value,
            numShelves: parseInt(document.getElementById('numShelves').value)
        };

        try {
            const response = await fetch('https://bapsfjnooh.execute-api.us-west-1.amazonaws.com/api4db', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            // Clear previous results
            tableBody.innerHTML = '';

            // Populate table with cutting plans
            if (Array.isArray(data.cuttingPlans)) {
                data.cuttingPlans.forEach(plan => {
                    const row = tableBody.insertRow();
                    row.insertCell(0).textContent = `${parseFloat(plan[0]).toFixed(2)} ${data.unit}`;
                    row.insertCell(1).textContent = `${parseFloat(plan[1]).toFixed(2)} ${data.unit}`;
                });
            }

            // Display number of shelves possible
            numShelvesPossibleP.textContent = `Shelves Possible: ${data.numShelvesPossible || 0}`;

            // Display leftover area
            leftoverAreaP.textContent = `Leftover Area: ${parseFloat(data.leftoverArea).toFixed(2)} ${data.unit}²`;

            // Calculate and display remaining lining
            const totalLiningArea = formData.liningLength * formData.liningWidth;
            const usedArea = totalLiningArea - parseFloat(data.leftoverArea);
            const remainingLength = (usedArea / formData.liningWidth).toFixed(2);
            const remainingWidth = formData.liningWidth;
            remainingLiningP.textContent = `Remaining Lining: ${remainingLength} x ${remainingWidth} ${data.unit}`;

            // Show result
            resultDiv.classList.remove('hidden');
        } catch (error) {
            console.error('Error:', error);
            alert(`An error occurred: ${error.message}. Please check the console for more details.`);
        }
    });
});
