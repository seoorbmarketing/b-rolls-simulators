// Graph state
let leftBarValue = 25;
let rightBarValue = 85;
let currentGraphType = 'bar';
let pieSegments = [
    { label: 'Category A', value: 35, color: '#e74c3c' },
    { label: 'Category B', value: 25, color: '#3498db' },
    { label: 'Category C', value: 40, color: '#2ecc71' }
];

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    updateColors();
    updateValues();
    updateLabels();
    updateGraphText();
    updateAxisLabels();
    initPieChart();
    initLineChart();
});

// Update graph title and subtitle
function updateGraphText() {
    const title = document.getElementById('titleInput').value;
    const subtitle = document.getElementById('subtitleInput').value;
    
    document.getElementById('graphTitle').textContent = title;
    document.getElementById('graphSubtitle').textContent = subtitle;
}

// Update axis labels
function updateAxisLabels() {
    const yLabel = document.getElementById('yAxisLabel').value;
    const xLabel = document.getElementById('xAxisLabel').value;
    
    document.getElementById('yAxisLabelDisplay').textContent = yLabel;
    document.getElementById('xAxisLabelDisplay').textContent = xLabel;
}

// Update bar labels
function updateLabels() {
    const leftLabel = document.getElementById('leftLabel').value;
    const rightLabel = document.getElementById('rightLabel').value;
    
    document.getElementById('labelLeftInside').textContent = leftLabel;
    document.getElementById('labelRightInside').textContent = rightLabel;
    document.getElementById('labelLeftOutside').textContent = leftLabel;
    document.getElementById('labelRightOutside').textContent = rightLabel;
}

// Update bar values
function updateValues() {
    leftBarValue = parseInt(document.getElementById('leftValue').value) || 0;
    rightBarValue = parseInt(document.getElementById('rightValue').value) || 0;
    
    // Update value displays
    document.getElementById('valueLeft').textContent = leftBarValue;
    document.getElementById('valueRight').textContent = rightBarValue;
    
    // Update bar heights
    const maxHeight = 450; // pixels
    document.getElementById('barLeft').style.height = (leftBarValue / 100) * maxHeight + 'px';
    document.getElementById('barRight').style.height = (rightBarValue / 100) * maxHeight + 'px';
}

// Set bar chart mode
function setBarMode(mode) {
    const barChart = document.getElementById('barChart');
    const buttons = document.querySelectorAll('.mode-btn');
    
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    if (mode === 'simplified') {
        barChart.classList.add('simplified');
    } else {
        barChart.classList.remove('simplified');
    }
}

// Update bar colors
function updateColors() {
    const leftColor = document.getElementById('leftColor').value;
    const rightColor = document.getElementById('rightColor').value;
    
    document.getElementById('barLeft').style.background = leftColor;
    document.getElementById('barRight').style.background = rightColor;
}

// Select left bar color
function selectLeftColor(color, btn) {
    // Update active state
    btn.parentElement.querySelectorAll('.color-btn').forEach(b => {
        b.classList.remove('active');
    });
    btn.classList.add('active');
    
    // Update color
    document.getElementById('leftColor').value = color;
    document.getElementById('barLeft').style.background = color;
}

// Select right bar color  
function selectRightColor(color, btn) {
    // Update active state
    btn.parentElement.querySelectorAll('.color-btn').forEach(b => {
        b.classList.remove('active');
    });
    btn.classList.add('active');
    
    // Update color
    document.getElementById('rightColor').value = color;
    document.getElementById('barRight').style.background = color;
}

// Play animation
function playAnimation() {
    if (currentGraphType === 'bar') {
        animateBarChart();
    } else if (currentGraphType === 'pie') {
        animatePieChart();
    } else if (currentGraphType === 'line') {
        animateLineChart();
    }
}

// Animate bar chart
function animateBarChart() {
    const barLeft = document.getElementById('barLeft');
    const barRight = document.getElementById('barRight');
    const valueLeft = document.getElementById('valueLeft');
    const valueRight = document.getElementById('valueRight');
    const delay = parseFloat(document.getElementById('animationDelay').value) || 0;
    
    // Store current heights
    const leftHeight = barLeft.style.height;
    const rightHeight = barRight.style.height;
    
    // Hide values during animation
    valueLeft.style.opacity = '0';
    valueRight.style.opacity = '0';
    
    // Set minimal starting height (40px to fit labels)
    barLeft.style.height = '40px';
    barRight.style.height = '40px';
    
    // Remove animation class
    barLeft.classList.remove('animating');
    barRight.classList.remove('animating');
    
    // Force reflow
    void barLeft.offsetWidth;
    
    // Start animation after delay
    setTimeout(() => {
        // Add animation class and set final heights
        barLeft.classList.add('animating');
        barRight.classList.add('animating');
        barLeft.style.height = leftHeight;
        barRight.style.height = rightHeight;
        
        // Show values after animation completes
        setTimeout(() => {
            valueLeft.style.transition = 'opacity 0.5s ease';
            valueRight.style.transition = 'opacity 0.5s ease';
            valueLeft.style.opacity = '1';
            valueRight.style.opacity = '1';
            barLeft.classList.remove('animating');
            barRight.classList.remove('animating');
        }, 1500);
    }, delay * 1000);
}

// Reset graph
function resetGraph() {
    // Reset values
    document.getElementById('titleInput').value = 'Productivity Comparison';
    document.getElementById('subtitleInput').value = '';
    document.getElementById('leftLabel').value = 'Without AI';
    document.getElementById('rightLabel').value = 'With AI';
    document.getElementById('leftValue').value = 25;
    document.getElementById('rightValue').value = 85;
    document.getElementById('leftColor').value = '#c94545';
    document.getElementById('rightColor').value = '#4ECDC4';
    
    // Update display
    updateGraphText();
    updateLabels();
    updateValues();
    updateColors();
}


// Switch graph type
function switchGraphType(type) {
    currentGraphType = type;
    
    // Update button states
    document.querySelectorAll('.graph-type-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.graph-type-btn').classList.add('active');
    
    // Hide all charts
    document.getElementById('barChart').style.display = 'none';
    document.getElementById('pieChart').style.display = 'none';
    document.getElementById('lineChart').style.display = 'none';
    
    // Hide all controls
    document.getElementById('barControls').style.display = 'none';
    document.getElementById('pieControls').style.display = 'none';
    document.getElementById('lineControls').style.display = 'none';
    
    // Show selected chart and controls
    const axisControls = document.querySelectorAll('.axis-controls');
    
    if (type === 'bar') {
        document.getElementById('barChart').style.display = 'flex';
        document.getElementById('barControls').style.display = 'block';
        axisControls.forEach(control => control.style.display = 'block');
    } else if (type === 'pie') {
        document.getElementById('pieChart').style.display = 'flex';
        document.getElementById('pieControls').style.display = 'block';
        axisControls.forEach(control => control.style.display = 'none');
        updatePieChart();
    } else if (type === 'line') {
        document.getElementById('lineChart').style.display = 'flex';
        document.getElementById('lineControls').style.display = 'block';
        axisControls.forEach(control => control.style.display = 'block');
        updateLineChart();
    }
}

// Initialize pie chart
function initPieChart() {
    const canvas = document.getElementById('pieCanvas');
    const ctx = canvas.getContext('2d');
    ctx.font = '14px Poppins';
    renderPieSegmentsList();
    updatePieChart();
}

// Render pie segments list
function renderPieSegmentsList() {
    const container = document.getElementById('pieSegmentsList');
    if (!container) return;
    
    container.innerHTML = '';
    pieSegments.forEach((segment, index) => {
        const segmentDiv = document.createElement('div');
        segmentDiv.className = 'pie-segment-item';
        segmentDiv.innerHTML = `
            <h4>Segment ${index + 1} <span class="segment-color-preview" style="background: ${segment.color}"></span></h4>
            <button class="remove-segment-btn" onclick="removePieSegment(${index})">
                <i class="fas fa-trash"></i>
            </button>
            <div class="input-group">
                <label>Label:</label>
                <input type="text" value="${segment.label}" onchange="updatePieSegment(${index}, 'label', this.value)">
            </div>
            <div class="input-group">
                <label>Value:</label>
                <input type="number" value="${segment.value}" min="0" onchange="updatePieSegment(${index}, 'value', parseFloat(this.value))">
            </div>
            <div class="input-group">
                <label>Color:</label>
                <div class="color-options">
                    <button class="color-btn ${segment.color === '#e74c3c' ? 'active' : ''}" onclick="updatePieSegment(${index}, 'color', '#e74c3c'); this.parentElement.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active')); this.classList.add('active');" style="background: #e74c3c"></button>
                    <button class="color-btn ${segment.color === '#3498db' ? 'active' : ''}" onclick="updatePieSegment(${index}, 'color', '#3498db'); this.parentElement.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active')); this.classList.add('active');" style="background: #3498db"></button>
                    <button class="color-btn ${segment.color === '#2ecc71' ? 'active' : ''}" onclick="updatePieSegment(${index}, 'color', '#2ecc71'); this.parentElement.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active')); this.classList.add('active');" style="background: #2ecc71"></button>
                    <button class="color-btn ${segment.color === '#f39c12' ? 'active' : ''}" onclick="updatePieSegment(${index}, 'color', '#f39c12'); this.parentElement.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active')); this.classList.add('active');" style="background: #f39c12"></button>
                    <button class="color-btn ${segment.color === '#9b59b6' ? 'active' : ''}" onclick="updatePieSegment(${index}, 'color', '#9b59b6'); this.parentElement.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active')); this.classList.add('active');" style="background: #9b59b6"></button>
                    <button class="color-btn ${segment.color === '#1abc9c' ? 'active' : ''}" onclick="updatePieSegment(${index}, 'color', '#1abc9c'); this.parentElement.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active')); this.classList.add('active');" style="background: #1abc9c"></button>
                </div>
            </div>
        `;
        container.appendChild(segmentDiv);
    });
}

// Add new pie segment
function addPieSegment() {
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
    const newColor = colors[pieSegments.length % colors.length];
    pieSegments.push({
        label: `Category ${String.fromCharCode(65 + pieSegments.length)}`,
        value: 20,
        color: newColor
    });
    renderPieSegmentsList();
    updatePieChart();
}

// Remove pie segment
function removePieSegment(index) {
    if (pieSegments.length > 2) { // Keep at least 2 segments
        pieSegments.splice(index, 1);
        renderPieSegmentsList();
        updatePieChart();
    }
}

// Update pie segment
function updatePieSegment(index, field, value) {
    pieSegments[index][field] = value;
    if (field === 'color') {
        renderPieSegmentsList(); // Re-render to update color preview
    }
    updatePieChart();
}

// Animate pie chart
let pieAnimationId = null;
function animatePieChart() {
    const delay = parseFloat(document.getElementById('animationDelay').value) || 0;
    
    // Cancel any existing animation
    if (pieAnimationId) {
        cancelAnimationFrame(pieAnimationId);
    }
    
    setTimeout(() => {
        let progress = 0;
        const duration = 1500; // 1.5 seconds
        const startTime = performance.now();
        
        function drawAnimatedPie(currentTime) {
            progress = Math.min((currentTime - startTime) / duration, 1);
            
            const canvas = document.getElementById('pieCanvas');
            const ctx = canvas.getContext('2d');
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = 250;
            
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Calculate angles
            const total = pieSegments.reduce((sum, seg) => sum + seg.value, 0);
            let currentAngle = -Math.PI / 2;
            const maxAngle = -Math.PI / 2 + (2 * Math.PI * progress);
            
            // Draw pie segments with animation
            pieSegments.forEach((segment, index) => {
                const value = segment.value;
                const sliceAngle = (value / total) * 2 * Math.PI;
                const endAngle = Math.min(currentAngle + sliceAngle, maxAngle);
                
                if (currentAngle < maxAngle) {
                    // Add glow effect
                    ctx.shadowColor = segment.color;
                    ctx.shadowBlur = 20;
                    
                    // Draw segment
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, radius, currentAngle, endAngle);
                    ctx.lineTo(centerX, centerY);
                    ctx.fillStyle = segment.color;
                    ctx.fill();
                    
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                    
                    // Draw labels only when segment is complete
                    if (progress === 1) {
                        const labelAngle = currentAngle + sliceAngle / 2;
                        const labelRadius = radius * 0.6;
                        const labelX = centerX + Math.cos(labelAngle) * labelRadius;
                        const labelY = centerY + Math.sin(labelAngle) * labelRadius;
                        
                        ctx.fillStyle = 'white';
                        ctx.font = 'bold 18px Poppins';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
                        ctx.shadowBlur = 5;
                        ctx.fillText(segment.label, labelX, labelY - 10);
                        
                        ctx.font = 'bold 16px Poppins';
                        const percentage = ((value / total) * 100).toFixed(1);
                        ctx.fillText(`${percentage}%`, labelX, labelY + 10);
                        ctx.shadowBlur = 0;
                    }
                }
                
                currentAngle += sliceAngle;
            });
            
            // Add outer glow when complete
            if (progress === 1) {
                ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
                ctx.shadowBlur = 30;
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius + 5, 0, 2 * Math.PI);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.lineWidth = 3;
                ctx.stroke();
                ctx.shadowBlur = 0;
            }
            
            if (progress < 1) {
                pieAnimationId = requestAnimationFrame(drawAnimatedPie);
            } else {
                pieAnimationId = null;
            }
        }
        
        pieAnimationId = requestAnimationFrame(drawAnimatedPie);
    }, delay * 1000);
}

// Update pie chart
function updatePieChart() {
    const canvas = document.getElementById('pieCanvas');
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 250;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate angles
    const total = pieSegments.reduce((sum, seg) => sum + seg.value, 0);
    let currentAngle = -Math.PI / 2;
    
    // Draw pie segments with glow effect
    pieSegments.forEach((segment, index) => {
        const value = segment.value;
        const sliceAngle = (value / total) * 2 * Math.PI;
        
        // Add glow effect for each segment
        ctx.shadowColor = segment.color;
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // Draw segment
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.lineTo(centerX, centerY);
        ctx.fillStyle = segment.color;
        ctx.fill();
        
        // Add subtle white border between segments
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        ctx.shadowBlur = 0;
        
        // Draw label - position at 60% of radius from center for better centering
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelRadius = radius * 0.6; // Moved closer to center
        const labelX = centerX + Math.cos(labelAngle) * labelRadius;
        const labelY = centerY + Math.sin(labelAngle) * labelRadius;
        
        // Draw label text with better shadow for visibility
        ctx.fillStyle = 'white';
        ctx.font = 'bold 18px Poppins';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.fillText(segment.label, labelX, labelY - 10);
        
        ctx.font = 'bold 16px Poppins';
        const percentage = ((value / total) * 100).toFixed(1);
        ctx.fillText(`${percentage}%`, labelX, labelY + 10);
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        currentAngle += sliceAngle;
    });
    
    // Add outer glow ring effect
    ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
    ctx.shadowBlur = 30;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 5, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    // Add inner shadow for depth
    const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.8, centerX, centerY, radius);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();
}

// Initialize line chart
function initLineChart() {
    updateLineCount(); // Initialize line datasets display
    updateLineChart();
}

// Update line count and show/hide datasets
function updateLineCount() {
    const numLines = parseInt(document.getElementById('numLines').value);
    const container = document.getElementById('lineDatasets');
    
    // Create line datasets if they don't exist
    for (let i = container.children.length; i < 5; i++) {
        const colors = ['#4ECDC4', '#FF6B6B', '#45B7D1', '#96CEB4', '#FFA07A'];
        const names = ['Series C', 'Series D', 'Series E'];
        const defaultData = [
            '40,45,35,55,45,60,65,70,75,85',
            '25,30,35,40,45,50,55,60,65,70',
            '35,40,45,50,55,60,65,70,75,80'
        ];
        
        const dataset = document.createElement('div');
        dataset.className = 'line-dataset';
        dataset.setAttribute('data-line', i);
        dataset.innerHTML = `
            <h4>Line ${i + 1}</h4>
            <div class="input-group">
                <label>Name:</label>
                <input type="text" class="line-name" value="${names[i - 2] || 'Series ' + String.fromCharCode(65 + i)}" onchange="updateLineChart()">
            </div>
            <div class="input-group">
                <label>Data (comma separated):</label>
                <input type="text" class="line-data" value="${defaultData[i - 2] || '50,55,60,65,70,75,80,85,90,95'}" onchange="updateLineChart()">
            </div>
            <div class="input-group">
                <label>Color:</label>
                <div class="color-options">
                    ${colors.map((color, idx) => `
                        <button class="color-btn ${idx === (i % colors.length) ? 'active' : ''}" 
                                onclick="selectLineDatasetColor(${i}, '${color}', this)" 
                                style="background: ${color}"></button>
                    `).join('')}
                </div>
                <input type="hidden" class="line-color" value="${colors[i % colors.length]}">
            </div>
        `;
        container.appendChild(dataset);
    }
    
    // Show/hide datasets based on selected count
    const datasets = container.querySelectorAll('.line-dataset');
    datasets.forEach((dataset, index) => {
        if (index < numLines) {
            dataset.style.display = 'block';
        } else {
            dataset.style.display = 'none';
        }
    });
    
    updateLineChart();
}

// Select color for specific line dataset
function selectLineDatasetColor(lineIndex, color, btn) {
    // Update active state
    const dataset = document.querySelector(`.line-dataset[data-line="${lineIndex}"]`);
    dataset.querySelectorAll('.color-btn').forEach(b => {
        b.classList.remove('active');
    });
    btn.classList.add('active');
    
    // Update color value
    dataset.querySelector('.line-color').value = color;
    updateLineChart();
}

// Helper function to draw just the chart frame (axes and grid)
function drawLineChartFrame() {
    const canvas = document.getElementById('lineCanvas');
    const ctx = canvas.getContext('2d');
    
    // Get labels
    const labelsString = document.getElementById('lineLabels')?.value || 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct';
    const labels = labelsString.split(',').map(l => l.trim());
    
    // Get all datasets to find max value
    const numLines = parseInt(document.getElementById('numLines').value);
    let maxValue = 0;
    
    for (let i = 0; i < numLines; i++) {
        const dataset = document.querySelector(`.line-dataset[data-line="${i}"]`);
        if (dataset && dataset.style.display !== 'none') {
            const dataString = dataset.querySelector('.line-data').value;
            const data = dataString.split(',').map(v => parseFloat(v.trim()));
            maxValue = Math.max(maxValue, ...data);
        }
    }
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Chart dimensions
    const padding = 60;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    
    // Draw axes
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();
    
    // Draw grid lines
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    for (let i = 1; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
    }
    ctx.setLineDash([]);
    
    // Draw Y-axis labels
    ctx.fillStyle = '#ccc';
    ctx.font = '14px Poppins';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
        const value = (maxValue / 5) * (5 - i);
        const y = padding + (chartHeight / 5) * i;
        ctx.fillText(Math.round(value), padding - 10, y + 4);
    }
    
    // Draw X-axis labels
    ctx.textAlign = 'center';
    const xStep = chartWidth / (labels.length - 1);
    labels.forEach((label, index) => {
        const x = padding + xStep * index;
        ctx.fillText(label, x, canvas.height - padding + 25);
    });
}

// Animate line chart
let lineAnimationId = null;
function animateLineChart() {
    const delay = parseFloat(document.getElementById('animationDelay').value) || 0;
    
    // Cancel any existing animation
    if (lineAnimationId) {
        cancelAnimationFrame(lineAnimationId);
    }
    
    // Draw the chart frame immediately (axes and grid only, no line)
    drawLineChartFrame();
    
    setTimeout(() => {
        let progress = 0;
        const duration = 2000; // 2 seconds
        const startTime = performance.now();
        
        function drawAnimatedLine(currentTime) {
            progress = Math.min((currentTime - startTime) / duration, 1);
            
            const canvas = document.getElementById('lineCanvas');
            const ctx = canvas.getContext('2d');
            
            // Get labels
            const labelsString = document.getElementById('lineLabels')?.value || 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct';
            const labels = labelsString.split(',').map(l => l.trim());
            
            // Get all active line datasets
            const numLines = parseInt(document.getElementById('numLines').value);
            const datasets = [];
            let maxValue = 0;
            
            for (let i = 0; i < numLines; i++) {
                const dataset = document.querySelector(`.line-dataset[data-line="${i}"]`);
                if (dataset && dataset.style.display !== 'none') {
                    const name = dataset.querySelector('.line-name').value;
                    const dataString = dataset.querySelector('.line-data').value;
                    const color = dataset.querySelector('.line-color').value;
                    const data = dataString.split(',').map(v => parseFloat(v.trim()));
                    
                    datasets.push({ name, data, color });
                    maxValue = Math.max(maxValue, ...data);
                }
            }
            
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Chart dimensions
            const padding = 60;
            const chartWidth = canvas.width - padding * 2;
            const chartHeight = canvas.height - padding * 2;
            const minValue = 0;
            
            // Draw axes (always visible)
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(padding, padding);
            ctx.lineTo(padding, canvas.height - padding);
            ctx.lineTo(canvas.width - padding, canvas.height - padding);
            ctx.stroke();
            
            // Draw grid lines
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            for (let i = 1; i <= 5; i++) {
                const y = padding + (chartHeight / 5) * i;
                ctx.beginPath();
                ctx.moveTo(padding, y);
                ctx.lineTo(canvas.width - padding, y);
                ctx.stroke();
            }
            ctx.setLineDash([]);
            
            // Draw labels
            ctx.fillStyle = '#ccc';
            ctx.font = '14px Poppins';
            ctx.textAlign = 'right';
            for (let i = 0; i <= 5; i++) {
                const value = (maxValue / 5) * (5 - i);
                const y = padding + (chartHeight / 5) * i;
                ctx.fillText(Math.round(value), padding - 10, y + 4);
            }
            
            ctx.textAlign = 'center';
            const xStep = chartWidth / (labels.length - 1);
            labels.forEach((label, index) => {
                const x = padding + xStep * index;
                ctx.fillText(label, x, canvas.height - padding + 25);
            });
            
            // Draw all lines with animation
            if (progress > 0) {
                ctx.save();
                
                // Create a clipping region that reveals the lines progressively
                const clipWidth = padding + (chartWidth * progress) + 10;
                ctx.beginPath();
                ctx.rect(0, 0, clipWidth, canvas.height);
                ctx.clip();
                
                // Draw each dataset
                datasets.forEach((dataset, datasetIndex) => {
                    // Calculate points for this dataset
                    const points = [];
                    for (let i = 0; i < dataset.data.length; i++) {
                        const x = padding + xStep * i;
                        const y = canvas.height - padding - ((dataset.data[i] - minValue) / (maxValue - minValue)) * chartHeight;
                        points.push({ x, y, value: dataset.data[i] });
                    }
                    
                    // Draw line
                    ctx.shadowColor = dataset.color;
                    ctx.shadowBlur = 10;
                    ctx.strokeStyle = dataset.color;
                    ctx.lineWidth = 3;
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';
                    ctx.beginPath();
                    
                    points.forEach((point, index) => {
                        if (index === 0) {
                            ctx.moveTo(point.x, point.y);
                        } else {
                            ctx.lineTo(point.x, point.y);
                        }
                    });
                    
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                    
                    // Draw points that are within the progress
                    points.forEach((point, i) => {
                        const pointProgress = i / (points.length - 1);
                        if (progress >= 1 || pointProgress <= progress) {
                            const pointAlpha = progress >= 1 ? 1 : Math.min(1, (progress - pointProgress) * points.length);
                            
                            // Save context state
                            ctx.save();
                            
                            // Outer glow
                            ctx.fillStyle = dataset.color;
                            ctx.globalAlpha = 0.3 * pointAlpha;
                            ctx.beginPath();
                            ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI);
                            ctx.fill();
                            
                            // Inner circle
                            ctx.globalAlpha = pointAlpha;
                            ctx.fillStyle = dataset.color;
                            ctx.beginPath();
                            ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
                            ctx.fill();
                            
                            // White center
                            ctx.fillStyle = '#fff';
                            ctx.beginPath();
                            ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
                            ctx.fill();
                            
                            // Restore context state
                            ctx.restore();
                        }
                    });
                });
                
                ctx.restore();
                ctx.globalAlpha = 1;
                
                // Draw legend after animation starts
                if (progress > 0.3) {
                    const legendAlpha = Math.min(1, (progress - 0.3) / 0.3);
                    ctx.globalAlpha = legendAlpha;
                    
                    const legendY = padding - 30;
                    let legendX = padding;
                    
                    datasets.forEach((dataset, index) => {
                        // Draw legend line
                        ctx.strokeStyle = dataset.color;
                        ctx.lineWidth = 3;
                        ctx.beginPath();
                        ctx.moveTo(legendX, legendY);
                        ctx.lineTo(legendX + 30, legendY);
                        ctx.stroke();
                        
                        // Draw legend text
                        ctx.fillStyle = '#ccc';
                        ctx.font = '12px Poppins';
                        ctx.textAlign = 'left';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(dataset.name, legendX + 35, legendY);
                        
                        // Move to next legend item
                        legendX += ctx.measureText(dataset.name).width + 60;
                    });
                    
                    ctx.globalAlpha = 1;
                }
            }
            
            if (progress < 1) {
                lineAnimationId = requestAnimationFrame(drawAnimatedLine);
            } else {
                lineAnimationId = null;
            }
        }
        
        lineAnimationId = requestAnimationFrame(drawAnimatedLine);
    }, delay * 1000);
}

// Update line chart
function updateLineChart() {
    const canvas = document.getElementById('lineCanvas');
    const ctx = canvas.getContext('2d');
    
    // Get labels
    const labelsString = document.getElementById('lineLabels')?.value || 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct';
    const labels = labelsString.split(',').map(l => l.trim());
    
    // Get all active line datasets
    const numLines = parseInt(document.getElementById('numLines').value);
    const datasets = [];
    let maxValue = 0;
    
    for (let i = 0; i < numLines; i++) {
        const dataset = document.querySelector(`.line-dataset[data-line="${i}"]`);
        if (dataset && dataset.style.display !== 'none') {
            const name = dataset.querySelector('.line-name').value;
            const dataString = dataset.querySelector('.line-data').value;
            const color = dataset.querySelector('.line-color').value;
            const data = dataString.split(',').map(v => parseFloat(v.trim()));
            
            datasets.push({ name, data, color });
            maxValue = Math.max(maxValue, ...data);
        }
    }
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Chart dimensions
    const padding = 60;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const minValue = 0;
    
    // Draw axes with lighter color
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();
    
    // Draw grid lines for better visibility
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    for (let i = 1; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
    }
    ctx.setLineDash([]);
    
    // Draw Y-axis labels with lighter color
    ctx.fillStyle = '#ccc';
    ctx.font = '14px Poppins';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
        const value = (maxValue / 5) * (5 - i);
        const y = padding + (chartHeight / 5) * i;
        ctx.fillText(Math.round(value), padding - 10, y + 4);
    }
    
    // Draw X-axis labels with lighter color
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ccc';
    ctx.font = '14px Poppins';
    const xStep = chartWidth / (labels.length - 1);
    labels.forEach((label, index) => {
        const x = padding + xStep * index;
        ctx.fillText(label, x, canvas.height - padding + 25);
    });
    
    // Draw each line
    datasets.forEach((dataset, datasetIndex) => {
        // Draw line with glow effect
        ctx.shadowColor = dataset.color;
        ctx.shadowBlur = 10;
        ctx.strokeStyle = dataset.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        dataset.data.forEach((value, index) => {
            const x = padding + xStep * index;
            const y = canvas.height - padding - ((value - minValue) / (maxValue - minValue)) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        // Draw points with better visibility
        dataset.data.forEach((value, index) => {
            const x = padding + xStep * index;
            const y = canvas.height - padding - ((value - minValue) / (maxValue - minValue)) * chartHeight;
            
            // Save context state
            ctx.save();
            
            // Outer glow circle
            ctx.fillStyle = dataset.color;
            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, 2 * Math.PI);
            ctx.fill();
            
            // Inner circle
            ctx.globalAlpha = 1;
            ctx.fillStyle = dataset.color;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
            
            // White center
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, 2 * Math.PI);
            ctx.fill();
            
            // Restore context state
            ctx.restore();
        });
    });
    
    // Draw legend
    ctx.globalAlpha = 1;
    const legendY = padding - 30;
    let legendX = padding;
    
    datasets.forEach((dataset, index) => {
        // Draw legend line
        ctx.strokeStyle = dataset.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(legendX, legendY);
        ctx.lineTo(legendX + 30, legendY);
        ctx.stroke();
        
        // Draw legend text
        ctx.fillStyle = '#ccc';
        ctx.font = '12px Poppins';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(dataset.name, legendX + 35, legendY);
        
        // Move to next legend item
        legendX += ctx.measureText(dataset.name).width + 60;
    });
}


// Export as image
function exportAsImage() {
    const graphContainer = document.querySelector('.graph-container');
    
    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;
    
    // Draw white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 32px Poppins';
    ctx.textAlign = 'center';
    ctx.fillText(document.getElementById('graphTitle').textContent, 400, 60);
    
    // Draw subtitle
    ctx.fillStyle = '#666';
    ctx.font = '18px Poppins';
    ctx.fillText(document.getElementById('graphSubtitle').textContent, 400, 90);
    
    // Draw axes
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(100, 450);
    ctx.lineTo(100, 100);
    ctx.moveTo(100, 450);
    ctx.lineTo(700, 450);
    ctx.stroke();
    
    // Draw Y-axis labels
    ctx.fillStyle = '#999';
    ctx.font = '14px Poppins';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
        const value = 100 - (i * 20);
        const y = 100 + (i * 70);
        ctx.fillText(value, 80, y + 5);
    }
    
    // Draw bars
    const leftColor = document.getElementById('leftColor').value;
    const rightColor = document.getElementById('rightColor').value;
    const maxHeight = 350;
    
    // Left bar
    const leftHeight = (leftBarValue / 100) * maxHeight;
    ctx.fillStyle = leftColor;
    ctx.fillRect(250, 450 - leftHeight, 120, leftHeight);
    
    // Right bar
    const rightHeight = (rightBarValue / 100) * maxHeight;
    ctx.fillStyle = rightColor;
    ctx.fillRect(430, 450 - rightHeight, 120, rightHeight);
    
    // Draw values
    ctx.fillStyle = '#333';
    ctx.font = 'bold 20px Poppins';
    ctx.textAlign = 'center';
    ctx.fillText(leftBarValue, 310, 450 - leftHeight - 10);
    ctx.fillText(rightBarValue, 490, 450 - rightHeight - 10);
    
    // Draw labels
    ctx.fillStyle = '#666';
    ctx.font = '16px Poppins';
    ctx.fillText(document.getElementById('labelLeft').textContent, 310, 480);
    ctx.fillText(document.getElementById('labelRight').textContent, 490, 480);
    
    // Download
    canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'comparison-graph-' + Date.now() + '.png';
        a.click();
        URL.revokeObjectURL(url);
    });
}