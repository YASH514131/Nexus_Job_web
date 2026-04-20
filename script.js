// Custom cursor glow effect
let glowElement = null;
document.addEventListener('mousemove', (e) => {
  if (!glowElement) {
    glowElement = document.createElement('div');
    glowElement.className = 'cursor-glow';
    document.body.appendChild(glowElement);
  }
  
  glowElement.style.left = e.clientX + 'px';
  glowElement.style.top = e.clientY + 'px';
  glowElement.style.opacity = '1';
  
  // Clear any pending fade timeout
  if (glowElement.fadeTimeout) {
    clearTimeout(glowElement.fadeTimeout);
  }
  
  // Fade out when mouse stops for 100ms
  glowElement.fadeTimeout = setTimeout(() => {
    if (glowElement) glowElement.style.opacity = '0';
  }, 100);
});

// Animated counter for position counters (counts up once)
function animateCounter(element, target, duration = 1800) {
  let current = 0;
  const increment = target / (duration / 16);
  
  const counter = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(counter);
    }
    element.textContent = Math.floor(current).toLocaleString();
  }, 16);
}

// Looping counter for stats cards (continuous gradual increase)
function animateLoopingCounter(element, target, duration = 600) {
  let current = target;
  const smallIncrement = Math.ceil(target * 0.01); // Increase by 1% of initial target
  
  // Start from target
  element.textContent = Math.floor(current).toLocaleString();
  
  // Gradually increase numbers one by one over time
  const loopCounter = setInterval(() => {
    current += smallIncrement;
    element.textContent = Math.floor(current).toLocaleString();
  }, 100); // Update every 100ms for smooth, gradual animation
}

// Decreasing counter for error metrics (continuous gradual decrease)
function animateDecreasingCounter(element, target, duration = 600) {
  let current = target;
  const smallDecrement = Math.max(1, Math.ceil(target * 0.01)); // Decrease by 1% of initial target
  
  // Start from target
  element.textContent = Math.floor(current).toLocaleString();
  
  // Gradually decrease numbers one by one over time
  const loopCounter = setInterval(() => {
    current = Math.max(0, current - smallDecrement); // Don't go below 0
    element.textContent = Math.floor(current).toLocaleString();
  }, 100); // Update every 100ms for smooth, gradual animation
}

// Trigger counter animation when section is in view
const observerOptions = {
  threshold: 0.2,
  rootMargin: '0px 0px -50px 0px'
};

const intersectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Animate all position counters (count up once)
      const positionCounters = entry.target.querySelectorAll('.count-number');
      positionCounters.forEach((counter) => {
        if (!counter.dataset.animated) {
          const target = parseInt(counter.getAttribute('data-target'));
          animateCounter(counter, target, 1600);
          counter.dataset.animated = 'true';
        }
      });

      if (positionCounters.length > 0) {
        intersectionObserver.unobserve(entry.target);
      }
    }
  });
}, observerOptions);

const growthSection = document.querySelector('.growth-stats');
if (growthSection) {
  intersectionObserver.observe(growthSection);
}

// Start stats counter animation immediately on page load
document.addEventListener('DOMContentLoaded', () => {
  // Animate growth stats numbers (with continuous increase)
  const statsCounters = document.querySelectorAll('.stats-number');
  statsCounters.forEach((counter) => {
    const target = parseInt(counter.getAttribute('data-target'));
    animateLoopingCounter(counter, target, 600);
  });
  
  // Animate grid metrics numbers (with continuous increase or decrease)
  const metricCounters = document.querySelectorAll('.metric-counter');
  metricCounters.forEach((counter) => {
    const target = parseInt(counter.getAttribute('data-target'));
    // Check if this is a decreasing counter (like Processing Errors)
    if (counter.classList.contains('metric-decreasing')) {
      animateDecreasingCounter(counter, target, 600);
    } else {
      animateLoopingCounter(counter, target, 600);
    }
  });
});

// Phone tab switching
const phoneTabs = document.querySelectorAll('.phone-tab');
const phoneImages = document.querySelectorAll('.phone-image');

phoneTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const tabName = tab.getAttribute('data-tab');
    
    // Update active tab
    phoneTabs.forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');

    // Update active image
    phoneImages.forEach((img) => img.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
  });
});

// Preview step cycling
const previewSteps = document.querySelectorAll('.flow-step');
let activeIndex = 0;

function cyclePreviewSteps() {
  previewSteps.forEach((step, index) => {
    step.classList.toggle('active', index === activeIndex);
  });
  activeIndex = (activeIndex + 1) % previewSteps.length;
}

if (previewSteps.length) {
  cyclePreviewSteps();
  setInterval(cyclePreviewSteps, 2800);
}

// Scroll animations
function observeElements() {
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const fadeElements = document.querySelectorAll('.fade-in');
  const cardElements = document.querySelectorAll('.feature-card');
  const timelineElements = document.querySelectorAll('.timeline-item');

  fadeElements.forEach((el) => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });

  cardElements.forEach((el, index) => {
    el.style.animationDelay = `${index * 0.1}s`;
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });

  timelineElements.forEach((el, index) => {
    el.style.animationDelay = `${index * 0.1}s`;
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', observeElements);
} else {
  observeElements();
}
