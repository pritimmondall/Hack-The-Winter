const form = document.getElementById('uploadForm');
const fileInput = document.getElementById('fileInput');
const loading = document.getElementById('loading');
const results = document.getElementById('results');
const reportContent = document.getElementById('reportContent');

// Show file name when selected
fileInput.addEventListener('change', () => {
    const name = fileInput.files[0]?.name;
    document.getElementById('fileName').textContent = name ? `Selected: ${name}` : '';
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!fileInput.files[0]) return alert("Please select a file!");

    // 1. Prepare UI
    form.classList.add('hidden');
    loading.classList.remove('hidden');
    results.classList.add('hidden');

    // 2. Prepare Data
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('priority', document.getElementById('priority').value);

    try {
        // 3. Send to Backend
        // NOTE: The request will 'hang' here if the backend is waiting for 
        // your terminal input (Map Feature 'y/n'). Look at VS Code!
        const response = await fetch('http://127.0.0.1:8000/process-prescription', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        // 4. Render Results
        displayResults(data);

    } catch (error) {
        alert("Error connecting to Agent: " + error.message);
        form.classList.remove('hidden'); // Show form again
    } finally {
        loading.classList.add('hidden');
    }
});

function displayResults(data) {
    results.classList.remove('hidden');
    
    // ------------------------------------------------------
    // A. CALENDAR LOGIC (Updated key: 'calendar_event')
    // ------------------------------------------------------
    const calCard = document.getElementById('calendarCard');
    
    // Note: Backend now returns 'calendar_event', not 'calendar'
    if (data.calendar_event && data.calendar_event.status === 'success') {
        calCard.classList.remove('hidden');
        document.getElementById('calendarLink').href = data.calendar_event.link;
    } else {
        calCard.classList.add('hidden');
    }

    // ------------------------------------------------------
    // B. MEDICINE GUIDE (NEW FEATURE - PURPLE CARD)
    // ------------------------------------------------------
    const guideCard = document.getElementById('guideCard');
    const guideContent = document.getElementById('guideContent');
    guideContent.innerHTML = ''; // Clear previous data

    // We check data.data.medicines for the clinical instructions
    if (data.data && data.data.medicines && data.data.medicines.length > 0) {
        guideCard.classList.remove('hidden');
        
        data.data.medicines.forEach(med => {
            const row = document.createElement('div');
            // Inline styles for a clean list look
            row.style.borderBottom = "1px solid #eee";
            row.style.padding = "10px 0";
            
            // Safe fallbacks in case AI misses a field
            const freq = med.frequency || "As advised";
            const instr = med.instructions || "Follow doctor's advice";

            row.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div>
                        <strong style="font-size: 1.1em; color: #1f2937;">${med.name}</strong> 
                        <span style="background: #eff6ff; color: #2563eb; padding: 2px 6px; border-radius: 4px; font-size: 0.85em; font-weight: bold;">
                            ${med.dosage}
                        </span>
                        <div style="color: #6b7280; font-size: 0.9em; margin-top: 5px;">
                            <i class="fa-regular fa-clock"></i> ${freq}
                        </div>
                    </div>
                    <div style="text-align: right; max-width: 50%;">
                        <div style="color: #7c3aed; font-weight: 600; font-size: 0.95em;">
                            <i class="fa-solid fa-circle-info"></i> ${instr}
                        </div>
                    </div>
                </div>
            `;
            guideContent.appendChild(row);
        });
    } else {
        guideCard.classList.add('hidden');
    }

    // ------------------------------------------------------
    // C. AGENT SHOPPING REPORT (Updated key: 'agent_report')
    // ------------------------------------------------------
    reportContent.innerHTML = '';
    
    // Note: Backend now returns 'agent_report', not 'report'
    if (data.agent_report && data.agent_report.length > 0) {
        data.agent_report.forEach(item => {
            if(item.medicine) {
                const div = document.createElement('div');
                div.className = 'order-item';
                div.innerHTML = `
                    <strong>💊 ${item.medicine}</strong><br>
                    <span style="color: green">✔ Bought from ${item.bought_from}</span><br>
                    <small>Price: ₹${item.price || 'N/A'} | Delivery: ${item.days || item.delivery_days || 'Standard'} days</small>
                `;
                reportContent.appendChild(div);
            }
        });
    } else {
        reportContent.innerHTML = '<p style="color: #6b7280; font-style: italic;">No medicines were purchased online.</p>';
    }

    // ------------------------------------------------------
    // D. DEBUG DATA
    // ------------------------------------------------------
    document.getElementById('rawData').textContent = JSON.stringify(data, null, 2);
}

// Toggle Raw Data
document.getElementById('toggleRaw').addEventListener('click', () => {
    document.getElementById('rawData').classList.toggle('hidden');
});