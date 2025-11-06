// Multi-step form management
let currentStep = 1;
const totalSteps = 7;
const formSteps = document.querySelectorAll('.form-step');
const progressSteps = document.querySelectorAll('.progress-step');
const progressFill = document.getElementById('progressFill');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');

function showStep(step) {
    // Hide all steps
    formSteps.forEach(s => s.classList.remove('active'));

    // Show current step
    const currentStepElement = document.querySelector(`.form-step[data-step="${step}"]`);
    if (currentStepElement) {
        currentStepElement.classList.add('active');
    }

    // Update progress bar
    const progressPercentage = (step / totalSteps) * 100;
    progressFill.style.width = progressPercentage + '%';

    // Update progress steps
    progressSteps.forEach((progressStep, index) => {
        const stepNumber = index + 1;
        progressStep.classList.remove('active', 'completed');

        if (stepNumber < step) {
            progressStep.classList.add('completed');
        } else if (stepNumber === step) {
            progressStep.classList.add('active');
        }
    });

    // Update buttons
    prevBtn.disabled = step === 1;

    if (step === totalSteps) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
    } else {
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateStep(step) {
    const currentStepElement = document.querySelector(`.form-step[data-step="${step}"]`);
    const requiredInputs = currentStepElement.querySelectorAll('[required]');

    for (let input of requiredInputs) {
        // Skip validation for radio buttons and checkboxes (handled separately)
        if (input.type === 'radio' || input.type === 'checkbox') {
            continue;
        }

        if (!input.value.trim()) {
            input.focus();
            alert('Please fill in all required fields before proceeding.');
            return false;
        }
    }

    // Special validation for design style radio buttons (Step 4)
    if (step === 4) {
        const designStyles = currentStepElement.querySelectorAll('input[name="designStyle"]:checked');
        if (designStyles.length === 0) {
            alert('Please select a design style before proceeding.');
            return false;
        }
    }

    return true;
}

// Next button
nextBtn.addEventListener('click', () => {
    if (validateStep(currentStep)) {
        if (currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
        }
    }
});

// Previous button
prevBtn.addEventListener('click', () => {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
});

// Progress step click navigation
progressSteps.forEach((progressStep, index) => {
    progressStep.addEventListener('click', () => {
        const targetStep = index + 1;
        // Only allow going back or to completed steps
        if (targetStep <= currentStep) {
            currentStep = targetStep;
            showStep(currentStep);
        }
    });
});

// Initialize first step
showStep(1);

// Page fields management
let pageIdCounter = 0;
const pagesContainer = document.getElementById('pagesContainer');
const addPageBtn = document.getElementById('addPageBtn');

function createPageField() {
    pageIdCounter++;
    const pageField = document.createElement('div');
    pageField.className = 'page-field';
    pageField.dataset.pageId = pageIdCounter;

    // Calculate the current page number based on existing pages
    const currentPageNumber = pagesContainer.querySelectorAll('.page-field').length + 1;

    pageField.innerHTML = `
        <div class="page-field-header">
            <span class="page-field-number">Page ${currentPageNumber}</span>
            <button type="button" class="btn-remove-page" onclick="removePage(${pageIdCounter})" title="Remove page">×</button>
        </div>
        <div class="form-group">
            <label for="pageName${pageIdCounter}">Page Name *</label>
            <input type="text" id="pageName${pageIdCounter}" name="pages[${currentPageNumber}][name]" required placeholder="e.g., Home, About, Contact">
        </div>
        <div class="form-group">
            <label for="pageDescription${pageIdCounter}">Page Description</label>
            <textarea id="pageDescription${pageIdCounter}" name="pages[${currentPageNumber}][description]" rows="3" placeholder="Describe the purpose and content of this page..."></textarea>
        </div>
    `;

    pagesContainer.appendChild(pageField);

    // Scroll to the new page field
    pageField.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function removePage(pageId) {
    const pageField = document.querySelector(`[data-page-id="${pageId}"]`);
    if (pageField) {
        pageField.style.opacity = '0';
        pageField.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            pageField.remove();
            renumberPages();
        }, 300);
    }
}

function renumberPages() {
    const pageFields = pagesContainer.querySelectorAll('.page-field');
    pageFields.forEach((field, index) => {
        const pageNumber = index + 1;
        const pageId = field.dataset.pageId;

        // Update the display number
        const numberSpan = field.querySelector('.page-field-number');
        if (numberSpan) {
            numberSpan.textContent = `Page ${pageNumber}`;
        }

        // Update the input field names to match the new page number
        const nameInput = field.querySelector(`#pageName${pageId}`);
        const descInput = field.querySelector(`#pageDescription${pageId}`);

        if (nameInput) {
            nameInput.name = `pages[${pageNumber}][name]`;
        }
        if (descInput) {
            descInput.name = `pages[${pageNumber}][description]`;
        }
    });
}

// Add page button event listener
addPageBtn.addEventListener('click', createPageField);

// Add initial page field
createPageField();

// CMS and Integrations "Other" field toggle
const cmsOtherCheckbox = document.getElementById('cmsOtherCheckbox');
const cmsOtherGroup = document.getElementById('cmsOtherGroup');
const integrationsOtherCheckbox = document.getElementById('integrationsOtherCheckbox');
const integrationsOtherGroup = document.getElementById('integrationsOtherGroup');

if (cmsOtherCheckbox) {
    cmsOtherCheckbox.addEventListener('change', (e) => {
        if (e.target.checked) {
            cmsOtherGroup.style.display = 'block';
        } else {
            cmsOtherGroup.style.display = 'none';
            document.getElementById('cmsOther').value = '';
        }
    });
}

if (integrationsOtherCheckbox) {
    integrationsOtherCheckbox.addEventListener('change', (e) => {
        if (e.target.checked) {
            integrationsOtherGroup.style.display = 'block';
        } else {
            integrationsOtherGroup.style.display = 'none';
            document.getElementById('integrationsOther').value = '';
        }
    });
}

// Form submission handling
const projectForm = document.getElementById('projectForm');
const successMessage = document.getElementById('successMessage');

projectForm.addEventListener('submit', (e) => {
    // Validate at least one design style is selected
    const designStyles = document.querySelectorAll('input[name="designStyle"]:checked');
    if (designStyles.length === 0) {
        e.preventDefault();
        alert('Please select at least one design style.');
        return;
    }

    // Clear saved form data on submission
    localStorage.removeItem('projectFormData');

    // Let Formspree handle the submission (don't prevent default)
    // The form will submit to Formspree and redirect to their success page
});

// Form reset handling
projectForm.addEventListener('reset', () => {
    // Show confirmation
    setTimeout(() => {
        if (confirm('Form has been cleared. Continue?')) {
            // Form is already reset
        } else {
            // Prevent reset if user cancels
            location.reload();
        }
    }, 100);
});

// Add smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add input validation feedback
const requiredInputs = document.querySelectorAll('input[required], select[required], textarea[required]');

requiredInputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value.trim() === '') {
            input.style.borderColor = 'var(--error-color)';
        } else {
            input.style.borderColor = 'var(--success-color)';
        }
    });
    
    input.addEventListener('input', () => {
        if (input.value.trim() !== '') {
            input.style.borderColor = 'var(--success-color)';
        }
    });
});

// Email validation
const emailInput = document.getElementById('email');
emailInput.addEventListener('blur', () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput.value && !emailPattern.test(emailInput.value)) {
        emailInput.style.borderColor = 'var(--error-color)';
        emailInput.setCustomValidity('Please enter a valid email address');
    } else {
        emailInput.setCustomValidity('');
        if (emailInput.value) {
            emailInput.style.borderColor = 'var(--success-color)';
        }
    }
});

// Phone number formatting (UK format)
const phoneInput = document.getElementById('phone');
phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');

    // Limit to 11 digits for UK numbers
    if (value.length > 11) {
        value = value.slice(0, 11);
    }

    // Format as UK phone number
    if (value.length === 11) {
        // Format: 07XXX XXXXXX or 01XXX XXXXXX
        value = `${value.slice(0, 5)} ${value.slice(5)}`;
    } else if (value.length > 5) {
        value = `${value.slice(0, 5)} ${value.slice(5)}`;
    }

    e.target.value = value;
});

// Character counter for textareas
const textareas = document.querySelectorAll('textarea');
textareas.forEach(textarea => {
    const maxLength = 1000;
    const counter = document.createElement('div');
    counter.style.cssText = 'text-align: right; font-size: 0.875rem; color: var(--text-light); margin-top: 0.25rem;';
    counter.textContent = `0 / ${maxLength} characters`;
    textarea.parentNode.appendChild(counter);
    
    textarea.addEventListener('input', () => {
        const length = textarea.value.length;
        counter.textContent = `${length} / ${maxLength} characters`;
        
        if (length > maxLength) {
            textarea.value = textarea.value.slice(0, maxLength);
            counter.textContent = `${maxLength} / ${maxLength} characters`;
            counter.style.color = 'var(--error-color)';
        } else if (length > maxLength * 0.9) {
            counter.style.color = 'var(--error-color)';
        } else {
            counter.style.color = 'var(--text-light)';
        }
    });
});

// Save form progress to localStorage
const saveFormProgress = () => {
    const formData = new FormData(projectForm);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        if (key === 'designStyle' || key === 'features') {
            if (!data[key]) {
                data[key] = [];
            }
            data[key].push(value);
        } else {
            data[key] = value;
        }
    }
    
    localStorage.setItem('projectFormData', JSON.stringify(data));
};

// Load form progress from localStorage
const loadFormProgress = () => {
    const savedData = localStorage.getItem('projectFormData');
    if (savedData) {
        const data = JSON.parse(savedData);
        
        Object.keys(data).forEach(key => {
            const element = document.querySelector(`[name="${key}"]`);
            if (element) {
                if (element.type === 'checkbox' || element.type === 'radio') {
                    const values = Array.isArray(data[key]) ? data[key] : [data[key]];
                    values.forEach(value => {
                        const checkbox = document.querySelector(`[name="${key}"][value="${value}"]`);
                        if (checkbox) {
                            checkbox.checked = true;
                        }
                    });
                } else {
                    element.value = data[key];
                }
            }
        });
    }
};

// Auto-save every 30 seconds
setInterval(saveFormProgress, 30000);

// Save on input change
projectForm.addEventListener('change', saveFormProgress);

// Load saved data on page load
window.addEventListener('load', () => {
    const savedData = localStorage.getItem('projectFormData');
    if (savedData && confirm('Would you like to restore your previous form data?')) {
        loadFormProgress();
    } else if (savedData) {
        localStorage.removeItem('projectFormData');
    }
});

