// ================================
// Global Variables
// ================================
let currentSection = 1;
let isNoButtonRunning = false;
let noButtonMoveCount = 0;
const minMovesBeforeClick = 35;
let userSelections = {
    dates: [],
    food: [],
    desserts: [],
    activities: [],
    gift: ''
};

// ================================
// Initialize on Page Load
// ================================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    startHeartAnimation();
    startCountdown();
    setupEventListeners();
    loadSavedSelections();
});

// ================================
// App Initialization
// ================================
function initializeApp() {
    console.log('Valentine\'s Day App Initialized! 💚');
    
    // Show first section
    showSection(1);
    
    // Initialize music button state
    const musicBtn = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    musicBtn.textContent = '🔇';
}

// ================================
// Section Navigation
// ================================
function showSection(sectionNumber) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(`section${sectionNumber}`);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionNumber;
        
        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // If it's the final section, generate summary
        if (sectionNumber === 8) {
            generateSummary();
        }
    }
}

function nextSection(nextSectionNumber) {
    // Save current selections before moving
    saveCurrentSelections();
    
    // Move to next section
    showSection(nextSectionNumber);
}

// ================================
// YES/NO Button Logic
// ================================
function setupEventListeners() {
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    
    // YES button - trigger celebration
    yesBtn.addEventListener('click', function() {
        triggerCelebration();
        setTimeout(() => {
            showSection(2);
        }, 2000);
    });
    
    // NO button - run away on hover/touch
    noBtn.addEventListener('mouseenter', moveNoButton);
    noBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        moveNoButton();
    });
    
    // Prevent clicking NO button until it has moved enough times
    noBtn.addEventListener('click', function(e) {
        if (noButtonMoveCount < minMovesBeforeClick) {
            e.preventDefault();
            e.stopPropagation();
            showNoButtonMessage();
        }
        // After 35 moves, let them click if they really insist
    });
    
    // Music toggle
    const musicToggle = document.getElementById('musicToggle');
    musicToggle.addEventListener('click', toggleMusic);
}

function moveNoButton() {
    const noBtn = document.getElementById('noBtn');
    const container = noBtn.parentElement;
    
    if (isNoButtonRunning) return;
    isNoButtonRunning = true;
    
    // Increment move counter
    noButtonMoveCount++;
    
    // Get container and button dimensions
    const containerRect = container.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    
    // Calculate random position - gets more extreme with more attempts
    const maxX = containerRect.width - btnRect.width - 40;
    const maxY = containerRect.height - btnRect.height - 40;
    
    // Increase randomness as attempts increase
    const randomnessFactor = Math.min(noButtonMoveCount / 10, 3);
    const randomX = Math.random() * maxX * randomnessFactor;
    const randomY = Math.random() * maxY * randomnessFactor;
    
    // Apply position with smooth transition
    noBtn.style.position = 'absolute';
    noBtn.style.left = `${Math.min(randomX, maxX)}px`;
    noBtn.style.top = `${Math.min(randomY, maxY)}px`;
    noBtn.style.transition = 'all 0.3s ease';
    
    // Update button text based on attempts
    updateNoButtonText(noBtn);
    
    // Add shake animation
    noBtn.classList.add('shake');
    setTimeout(() => {
        noBtn.classList.remove('shake');
        isNoButtonRunning = false;
    }, 500);
    
    // Show progress message
    if (noButtonMoveCount % 5 === 0) {
        showNoButtonMessage();
    }
}

function updateNoButtonText(noBtn) {
    const remaining = minMovesBeforeClick - noButtonMoveCount;
    
    if (remaining > 30) {
        noBtn.innerHTML = `No? 🤔 (${noButtonMoveCount}/${minMovesBeforeClick})`;
    } else if (remaining > 20) {
        noBtn.innerHTML = `Still No? 😅 (${noButtonMoveCount}/${minMovesBeforeClick})`;
    } else if (remaining > 10) {
        noBtn.innerHTML = `Really? 😢 (${noButtonMoveCount}/${minMovesBeforeClick})`;
    } else if (remaining > 5) {
        noBtn.innerHTML = `Come on... 🥺 (${noButtonMoveCount}/${minMovesBeforeClick})`;
    } else if (remaining > 0) {
        noBtn.innerHTML = `Almost there! 💔 (${noButtonMoveCount}/${minMovesBeforeClick})`;
    } else {
        noBtn.innerHTML = `Fine... click if you must 😭`;
        noBtn.style.position = 'relative';
        noBtn.style.left = 'auto';
        noBtn.style.top = 'auto';
    }
}

function showNoButtonMessage() {
    const remaining = minMovesBeforeClick - noButtonMoveCount;
    const messages = [
        "The button is just playing hard to get! 💚",
        "Like Shrek, this button has layers! 🧅",
        "Donkey wouldn't give up, neither should you! 🫏",
        "This is more persistent than Donkey! 😄",
        "The swamp is calling... say YES! 🌿",
        "Even Fiona said yes eventually! 👸",
        "Ogres are like onions... and so is this button! 🧅",
        "Come on, you know you want to say YES! 💕",
        "This button has more moves than Puss in Boots! 🐱",
        "Lord Farquaad tried less hard than you! 🤴"
    ];
    
    if (remaining <= 0) {
        return; // Don't show messages after 35 moves
    }
    
    // Create temporary message
    const existingMessage = document.querySelector('.temp-message');
    if (existingMessage) existingMessage.remove();
    
    const message = document.createElement('div');
    message.className = 'temp-message';
    message.textContent = messages[Math.floor(Math.random() * messages.length)];
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(124, 179, 66, 0.95);
        color: white;
        padding: 20px 30px;
        border-radius: 15px;
        font-size: 1.2rem;
        z-index: 10000;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        animation: fadeInOut 2s ease;
        pointer-events: none;
        text-align: center;
        max-width: 80%;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 2000);
}

// ================================
// Celebration Effects
// ================================
function triggerCelebration() {
    const yesBtn = document.getElementById('yesBtn');
    
    // Animate the Yes button
    yesBtn.classList.add('celebrate');
    
    // Start music
    playMusic();
    
    // Launch confetti
    launchConfetti();
    
    // Create extra floating hearts
    createCelebrationHearts();
    
    setTimeout(() => {
        yesBtn.classList.remove('celebrate');
    }, 600);
}

function launchConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = 'block';
    
    const confetti = [];
    const confettiCount = 150;
    const colors = ['#7cb342', '#ff85a8', '#ffcce0', '#a5d6a7', '#fff8e7'];
    
    // Create confetti pieces
    for (let i = 0; i < confettiCount; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 6 + 4,
            d: Math.random() * confettiCount,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.floor(Math.random() * 10) - 10,
            tiltAngleIncremental: Math.random() * 0.07 + 0.05,
            tiltAngle: 0
        });
    }
    
    let animationFrame;
    
    function drawConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        confetti.forEach((piece, index) => {
            ctx.beginPath();
            ctx.lineWidth = piece.r / 2;
            ctx.strokeStyle = piece.color;
            ctx.moveTo(piece.x + piece.tilt + piece.r, piece.y);
            ctx.lineTo(piece.x + piece.tilt, piece.y + piece.tilt + piece.r);
            ctx.stroke();
            
            // Update position
            piece.tiltAngle += piece.tiltAngleIncremental;
            piece.y += (Math.cos(piece.d) + 3 + piece.r / 2) / 2;
            piece.x += Math.sin(piece.d);
            piece.tilt = Math.sin(piece.tiltAngle - index / 3) * 15;
            
            // Reset if out of view
            if (piece.y > canvas.height) {
                confetti.splice(index, 1);
            }
        });
        
        if (confetti.length > 0) {
            animationFrame = requestAnimationFrame(drawConfetti);
        } else {
            canvas.style.display = 'none';
            cancelAnimationFrame(animationFrame);
        }
    }
    
    drawConfetti();
}

function createCelebrationHearts() {
    const container = document.getElementById('heartsContainer');
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createFloatingHeart(container);
        }, i * 100);
    }
}

// ================================
// Floating Hearts Animation
// ================================
function startHeartAnimation() {
    const container = document.getElementById('heartsContainer');
    
    setInterval(() => {
        if (Math.random() > 0.7) {
            createFloatingHeart(container);
        }
    }, 2000);
}

function createFloatingHeart(container) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = Math.random() > 0.5 ? '💚' : '💖';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
    heart.style.fontSize = (Math.random() * 10 + 15) + 'px';
    
    container.appendChild(heart);
    
    // Remove after animation
    setTimeout(() => {
        heart.remove();
    }, 7000);
}

// ================================
// Music Control
// ================================
function toggleMusic() {
    const bgMusic = document.getElementById('bgMusic');
    const musicBtn = document.getElementById('musicToggle');
    
    if (bgMusic.paused) {
        playMusic();
    } else {
        bgMusic.pause();
        musicBtn.textContent = '🔇';
        musicBtn.classList.remove('playing');
    }
}

function playMusic() {
    const bgMusic = document.getElementById('bgMusic');
    const musicBtn = document.getElementById('musicToggle');
    
    bgMusic.play().then(() => {
        musicBtn.textContent = '🔊';
        musicBtn.classList.add('playing');
    }).catch(err => {
        console.log('Music autoplay prevented:', err);
    });
}

// ================================
// Countdown Timer
// ================================
function startCountdown() {
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    const valentinesDay = new Date('2026-02-14T00:00:00');
    const now = new Date();
    const diff = valentinesDay - now;
    
    if (diff <= 0) {
        document.getElementById('countdownTimer').textContent = "It's Valentine's Day! 💕";
        return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.getElementById('countdownTimer').textContent = 
        `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

// ================================
// Save User Selections
// ================================
function saveCurrentSelections() {
    // Save dates
    const dateCheckboxes = document.querySelectorAll('input[name="date"]:checked');
    userSelections.dates = Array.from(dateCheckboxes).map(cb => cb.value);
    
    // Save food
    const foodCheckboxes = document.querySelectorAll('input[name="food"]:checked');
    userSelections.food = Array.from(foodCheckboxes).map(cb => cb.value);
    
    // Save desserts
    const dessertCheckboxes = document.querySelectorAll('input[name="dessert"]:checked');
    userSelections.desserts = Array.from(dessertCheckboxes).map(cb => cb.value);
    
    // Save activities
    const activityCheckboxes = document.querySelectorAll('input[name="activity"]:checked');
    userSelections.activities = Array.from(activityCheckboxes).map(cb => cb.value);
    
    // Save gift
    const giftRadio = document.querySelector('input[name="gift"]:checked');
    userSelections.gift = giftRadio ? giftRadio.value : '';
    
    // Store in localStorage
    localStorage.setItem('valentineSelections', JSON.stringify(userSelections));
}

function loadSavedSelections() {
    const saved = localStorage.getItem('valentineSelections');
    if (saved) {
        userSelections = JSON.parse(saved);
    }
}

// ================================
// Generate Final Summary
// ================================
function generateSummary() {
    const summaryContent = document.getElementById('summaryContent');
    let html = '';
    
    // Format selections nicely
    const formatLabel = (value) => {
        return value.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };
    
    // Dates
    if (userSelections.dates.length > 0) {
        html += '<div class="summary-item">';
        html += '<strong>📅 When we\'ll celebrate:</strong>';
        html += '<ul>';
        userSelections.dates.forEach(date => {
            html += `<li>${formatLabel(date)}</li>`;
        });
        html += '</ul></div>';
    }
    
    // Food
    if (userSelections.food.length > 0) {
        html += '<div class="summary-item">';
        html += '<strong>🍕 Food choices:</strong>';
        html += '<ul>';
        userSelections.food.forEach(food => {
            html += `<li>${formatLabel(food)}</li>`;
        });
        html += '</ul></div>';
    }
    
    // Desserts
    if (userSelections.desserts.length > 0) {
        html += '<div class="summary-item">';
        html += '<strong>🍰 Sweet treats:</strong>';
        html += '<ul>';
        userSelections.desserts.forEach(dessert => {
            html += `<li>${formatLabel(dessert)}</li>`;
        });
        html += '</ul></div>';
    }
    
    // Activities
    if (userSelections.activities.length > 0) {
        html += '<div class="summary-item">';
        html += '<strong>💻 Virtual date activities:</strong>';
        html += '<ul>';
        userSelections.activities.forEach(activity => {
            html += `<li>${formatLabel(activity)}</li>`;
        });
        html += '</ul></div>';
    }
    
    // Gift
    if (userSelections.gift) {
        html += '<div class="summary-item">';
        html += '<strong>🎁 Your chosen gift:</strong>';
        html += `<ul><li>${formatLabel(userSelections.gift)}</li></ul>`;
        html += '</div>';
    }
    
    if (html === '') {
        html = '<p style="text-align: center; color: var(--light-text);">You haven\'t made any selections yet! 😊</p>';
    }
    
    summaryContent.innerHTML = html;
}

// ================================
// Restart Experience
// ================================
function restartExperience() {
    // Clear all selections
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('input[type="radio"]').forEach(rb => rb.checked = false);
    
    // Reset user selections
    userSelections = {
        dates: [],
        food: [],
        desserts: [],
        activities: [],
        gift: ''
    };
    
    // Clear localStorage
    localStorage.removeItem('valentineSelections');
    
    // Reset No button
    const noBtn = document.getElementById('noBtn');
    noBtn.style.position = 'relative';
    noBtn.style.left = 'auto';
    noBtn.style.top = 'auto';
    noBtn.innerHTML = 'No 🙃';
    noButtonMoveCount = 0;
    
    // Go back to first section
    showSection(1);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ================================
// Responsive Touch Events
// ================================
document.addEventListener('touchstart', function(e) {
    // Prevent zoom on double tap for iOS
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });

// ================================
// Window Resize Handler
// ================================
window.addEventListener('resize', function() {
    const canvas = document.getElementById('confettiCanvas');
    if (canvas.style.display === 'block') {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});

// ================================
// Console Easter Egg
// ================================
console.log('%c💚 Welcome to the Valentine\'s Adventure! 💚', 
    'font-size: 20px; color: #7cb342; font-weight: bold;');
console.log('%cMade with love and a little bit of Shrek magic 🐸✨', 
    'font-size: 14px; color: #ff85a8; font-style: italic;');
console.log('%c🎯 Pro tip: Try clicking "No" 35 times... if you dare! 😏', 
    'font-size: 12px; color: #7cb342;');
