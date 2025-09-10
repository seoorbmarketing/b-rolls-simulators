// Graph state
let leftBarValue = 25;
let rightBarValue = 85;
let currentGraphType = 'bar';

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
        // Pie chart animation can be added here if needed
    } else if (currentGraphType === 'line') {
        // Line chart animation can be added here if needed
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
    if (type === 'bar') {
        document.getElementById('barChart').style.display = 'flex';
        document.getElementById('barControls').style.display = 'block';
    } else if (type === 'pie') {
        document.getElementById('pieChart').style.display = 'flex';
        document.getElementById('pieControls').style.display = 'block';
        updatePieChart();
    } else if (type === 'line') {
        document.getElementById('lineChart').style.display = 'flex';
        document.getElementById('lineControls').style.display = 'block';
        updateLineChart();
    }
}

// Initialize pie chart
function initPieChart() {
    const canvas = document.getElementById('pieCanvas');
    const ctx = canvas.getContext('2d');
    ctx.font = '14px Poppins';
    updatePieChart();
}

// Update pie chart
function updatePieChart() {
    const canvas = document.getElementById('pieCanvas');
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 150;
    
    // Get values
    const values = [
        parseFloat(document.getElementById('pie1Value')?.value || 35),
        parseFloat(document.getElementById('pie2Value')?.value || 25),
        parseFloat(document.getElementById('pie3Value')?.value || 40)
    ];
    
    const labels = [
        document.getElementById('pie1Label')?.value || 'Category A',
        document.getElementById('pie2Label')?.value || 'Category B',
        document.getElementById('pie3Label')?.value || 'Category C'
    ];
    
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1'];
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate angles
    const total = values.reduce((a, b) => a + b, 0);
    let currentAngle = -Math.PI / 2;
    
    // Draw pie segments
    values.forEach((value, index) => {
        const sliceAngle = (value / total) * 2 * Math.PI;
        
        // Draw segment
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.lineTo(centerX, centerY);
        ctx.fillStyle = colors[index];
        ctx.fill();
        
        // Draw label
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
        const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Poppins';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(labels[index], labelX, labelY);
        
        ctx.font = '14px Poppins';
        ctx.fillText(`${value}%`, labelX, labelY + 20);
        
        currentAngle += sliceAngle;
    });
    
    // Draw border
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
}

// Initialize line chart
function initLineChart() {
    updateLineChart();
}

// Update line chart
function updateLineChart() {
    const canvas = document.getElementById('lineCanvas');
    const ctx = canvas.getContext('2d');
    
    // Get data
    const dataString = document.getElementById('lineData')?.value || '20,35,30,45,60,55,70,85,80,90';
    const labelsString = document.getElementById('lineLabels')?.value || 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct';
    const lineColor = document.getElementById('lineColor')?.value || '#4ECDC4';
    
    const data = dataString.split(',').map(v => parseFloat(v.trim()));
    const labels = labelsString.split(',').map(l => l.trim());
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Chart dimensions
    const padding = 60;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const maxValue = Math.max(...data);
    const minValue = 0;
    
    // Draw axes
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();
    
    // Draw Y-axis labels
    ctx.fillStyle = '#666';
    ctx.font = '12px Poppins';
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
        ctx.fillText(label, x, canvas.height - padding + 20);
    });
    
    // Draw line
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    data.forEach((value, index) => {
        const x = padding + xStep * index;
        const y = canvas.height - padding - ((value - minValue) / (maxValue - minValue)) * chartHeight;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();
    
    // Draw points
    ctx.fillStyle = lineColor;
    data.forEach((value, index) => {
        const x = padding + xStep * index;
        const y = canvas.height - padding - ((value - minValue) / (maxValue - minValue)) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw value labels
        ctx.fillStyle = '#333';
        ctx.font = 'bold 12px Poppins';
        ctx.textAlign = 'center';
        ctx.fillText(value, x, y - 10);
        ctx.fillStyle = lineColor;
    });
}

// Select line color
function selectLineColor(color, btn) {
    // Update active state
    btn.parentElement.querySelectorAll('.color-btn').forEach(b => {
        b.classList.remove('active');
    });
    btn.classList.add('active');
    
    // Update color
    document.getElementById('lineColor').value = color;
    updateLineChart();
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