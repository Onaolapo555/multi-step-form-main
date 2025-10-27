

const form = document.getElementById('form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('number');
const nextBtn = document.getElementById('next-step');
const goBackBtn = document.querySelector('.go-back');
const footer = document.querySelector('footer');

const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');
const phoneError = document.getElementById('phone-error');

const section1 = document.getElementById('section-1');
const section2 = document.getElementById('section-2');
const section3 = document.getElementById('section-3');
const section4 = document.querySelector('.section-4');
const section5 = document.querySelector('.section-5');

let currentStep = 1;
let isYearly = false;
let selectedPlan = null;

// defensive check
if (!form || !nameInput || !emailInput || !phoneInput || !nextBtn || !goBackBtn || !footer) {
  console.error('Required form elements not found. Check your element IDs.');
}

const sections = {
  1: section1,
  2: section2,
  3: section3,
  4: section4,
  5: section5
};


function updateNav() {
  const navStep = Math.min(currentStep, 4);
  [1, 2, 3, 4].forEach(step => {
    const div = document.querySelector(`.step-${step}`);
    if (div) {
      if (step === navStep) {
        div.classList.add('active');
      } else {
        div.classList.remove('active');
      }
    }
  });
}

function showStep(step) {
  Object.values(sections).forEach(s => s && (s.style.display = 'none'));
  if (sections[step]) {
    sections[step].style.display = 'block';
  }
  currentStep = step;
  updateNav();
  updateButtons();
  if (step === 5) {
    populateThankYouMessage();
  }
}

function populateThankYouMessage() {
  const messagePage = document.querySelector('.message-page');
  if (messagePage && messagePage.innerHTML.trim() === '') {
    messagePage.innerHTML = `
      <div class="thank-you-content">
        <div class="checkmark-container">
          <div class="checkmark-icon">✓</div>
        </div>
        <h2 class="thank-you-title">Thank you!</h2>
        <p class="thank-you-text">Thanks for confirming your subscription!</p>
        <p class="thank-you-text">We hope you have fun using our platform. If you ever need support, please feel free to email us at</p>
        <p class="support-email"><a href="mailto:support@loremgaming.com">support@loremgaming.com</a>.</p>
      </div>
    `;
  }
}

function updateButtons() {
  if (currentStep === 1) {
    goBackBtn.style.display = 'none';
    goBackBtn.disabled = true;
  } else {
    goBackBtn.style.display = 'block';
    goBackBtn.disabled = false;
  }
  if (currentStep === 4) {
    nextBtn.textContent = 'Confirm';
    nextBtn.style.background = 'hsl(243, 100%, 62%)';
    if(nextBtn.textContent === 'Confirm') {
       nextBtn.addEventListener('mouseover', () => {
      nextBtn.style.backgroundColor = 'rgba(120, 100, 155, 1)'
    })
     nextBtn.addEventListener('mouseout', () => {
      nextBtn.style.backgroundColor = 'hsl(243, 100%, 62%)';
      // nextBtn.style.backgroundColor = ''
    })
  } 
}else {
       nextBtn.addEventListener('mouseover', () => {
        nextBtn.style.backgroundColor = 'hsl(213, 96%, 18%)';
      })
      nextBtn.addEventListener('mouseout', () => {
        nextBtn.style.backgroundColor = 'hsl(213, 96%, 18%)';
      })
    nextBtn.textContent = 'Next step';
    nextBtn.style.backgroundColor = 'hsl(213, 96%, 18%)'
  }
  if (currentStep === 5) {
    footer.style.display = 'none';
    nextBtn.disabled = true;
  } else {
    footer.style.display = 'block';
    if (currentStep === 2) {
      nextBtn.disabled = !selectedPlan;
    } else {
      nextBtn.disabled = false;
    }
  }
}

// --- validation function ---
function validateInputs(name, email, phone) {
  // clear previous errors
  if (nameError) nameError.textContent = '';
  if (emailError) emailError.textContent = '';
  if (phoneError) phoneError.textContent = '';

  const nameRegex = /^[a-zA-Z\s'-]{2,}$/;         // allow letters, spaces, hyphen, apostrophe (min 2)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/; // simple, robust email check
  const phoneRegex = /^\d{10,15}$/;               // 10-15 digits

  let valid = true;

  // Name
  if (!name) {
    if (nameError) nameError.textContent = 'Name is required';
    valid = false;
  } else if (!nameRegex.test(name)) {
    if (nameError) nameError.textContent = 'Enter a valid name (letters only)';
    valid = false;
  }

  // Email
  if (!email) {
    if (emailError) emailError.textContent = 'Email is required';
    valid = false;
  } else if (!emailRegex.test(email)) {
    if (emailError) emailError.textContent = 'Enter a valid email address';
    valid = false;
  }

  // Phone
  if (!phone) {
    if (phoneError) phoneError.textContent = 'Phone number is required';
    valid = false;
  } else if (!phoneRegex.test(phone)) {
    if (phoneError) phoneError.textContent = 'Enter a valid phone (10–15 digits)';
    valid = false;
  }

  return valid;
}

// --- UX: disable Next by default until inputs valid ---
nextBtn.disabled = true;

// live validation: enable/disable Next as user types
[nameInput, emailInput, phoneInput].forEach(input => {
  if (!input) return;
  input.addEventListener('input', () => {
    const validNow = validateInputs(
      nameInput.value.trim(),
      emailInput.value.trim(),
      phoneInput.value.trim()
    );
    if (currentStep === 1) {
      nextBtn.disabled = !validNow;
    }
  });
});

// Unified next button handler
nextBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (currentStep === 1) {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    if (validateInputs(name, email, phone)) {
      showStep(2);
    }
  } else if (currentStep === 2) {
    if (selectedPlan) {
      showStep(3);
    }
  } else if (currentStep === 3) {
    showStep(4);
    updateSection4();
  } else if (currentStep === 4) {
    showStep(5);
    // Handle final confirmation if needed
    console.info('Form confirmed');
  }
});

// Go back handler
goBackBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (currentStep > 1) {
    showStep(currentStep - 1);
    if (currentStep === 2) {
      updateButtons();
    }
  }
});

// OPTIONAL: intercept form submit if you still want to support final submit
form.addEventListener('submit', (e) => {
  // you can either let it submit (no prevent) or intercept to send via fetch
  e.preventDefault();
  console.info('Form submission blocked here for custom handling (remove preventDefault to allow native submit).');
});

// Monthly and yearly toggle
const switchInput = document.getElementById("billingSwitch");
const monthlyLabel = document.getElementById("monthly-label");
const yearlyLabel = document.getElementById("yearly-label");
const arcadePrice = document.getElementById("arcade-price");
const advancePrice = document.getElementById("advance-price");
const proPrice = document.getElementById("pro-price");
const arcadeFree = document.getElementById("arcade-free");
const advanceFree = document.getElementById("advance-free");
const proFree = document.getElementById("pro-free");
const onlinePrice = document.getElementById('online-price');
const largerPrice = document.getElementById('larger-price');
const customizablePrice = document.getElementById('customizable-price');

// Button selection for Arcade, Advance and Pro
const arcade = document.getElementById('Arcade');
const advance = document.getElementById('Advance');
const pro = document.getElementById('Pro');

// Default: Monthly active
monthlyLabel.classList.add("active-label");
yearlyLabel.classList.add("inactive-label");

// Default addon prices
onlinePrice.textContent = '+$1/mo';
largerPrice.textContent = '+$2/mo';
customizablePrice.textContent = '+$2/mo';

switchInput.addEventListener("change", () => {
  isYearly = switchInput.checked;
  if (switchInput.checked) {
    yearlyLabel.classList.replace("inactive-label", "active-label");
    monthlyLabel.classList.replace("active-label", "inactive-label");
    arcadePrice.textContent = '$90/yr';
    advancePrice.textContent = '$120/yr';
    proPrice.textContent = '$150/yr';
    arcadeFree.style.display = "block";
    advanceFree.style.display = "block";
    proFree.style.display = "block";
    onlinePrice.textContent = '+$10/yr';
    largerPrice.textContent = '+$20/yr';
    customizablePrice.textContent = '+$20/yr';
  } else {
    monthlyLabel.classList.replace("inactive-label", "active-label");
    yearlyLabel.classList.replace("active-label", "inactive-label");
    arcadePrice.textContent = '$9/mo';
    advancePrice.textContent = '$12/mo';
    proPrice.textContent = '$15/mo';
    arcadeFree.style.display = "none";
    advanceFree.style.display = "none";
    proFree.style.display = "none";
    onlinePrice.textContent = '+$1/mo';
    largerPrice.textContent = '+$2/mo';
    customizablePrice.textContent = '+$2/mo';
  }
});

// Plan selection listeners
arcade.addEventListener('click', () => {
  selectedPlan = 'Arcade';
  arcade.style.background = "#f8f9fe";
  arcade.style.border = "1px solid hsl(243, 100%, 62%)";
  advance.style.background = "";
  advance.style.border = "";
  pro.style.background = "";
  pro.style.border = "";
  if (currentStep === 2) {
    updateButtons();
  }
});

advance.addEventListener('click', () => {
  selectedPlan = 'Advance';
  advance.style.background = "#f8f9fe";
  advance.style.border = "1px solid hsl(243, 100%, 62%)";
  arcade.style.background = "";
  arcade.style.border = "";
  pro.style.background = "";
  pro.style.border = "";
  if (currentStep === 2) {
    updateButtons();
  }
});

pro.addEventListener('click', () => {
  selectedPlan = 'Pro';
  pro.style.background = "#f8f9fe";
  pro.style.border = "1px solid hsl(243, 100%, 62%)";
  arcade.style.background = "";
  arcade.style.border = "";
  advance.style.background = "";
  advance.style.border = "";
  if (currentStep === 2) {
    updateButtons();
  }
});

//pick Add ons section for section 3
const checkboxOnline = document.getElementById('checkbox-online');
const checkboxLarger = document.getElementById('checkbox-larger');
const checkboxCustomizable = document.getElementById('checkbox-customizable');

function updateSection4() {
  const planTitle = document.getElementById('selected-plan');
  const planPriceSpan = document.getElementById('selected-plan-price');
  if (planTitle && planPriceSpan && selectedPlan) {
    planTitle.textContent = `${selectedPlan} (${isYearly ? 'Yearly' : 'Monthly'})`;
    const planPriceEl = document.getElementById(`${selectedPlan.toLowerCase()}-price`);
    if (planPriceEl) {
      planPriceSpan.textContent = planPriceEl.textContent;
    }
  }

  // Clear existing add-ons h5 (keep plan and underline)
  const innerDetails = document.querySelector('#card-details .inner-details');
  if (innerDetails) {
    while (innerDetails.children.length > 2) {
      innerDetails.removeChild(innerDetails.lastChild);
    }

    // Add selected add-ons dynamically
    if (checkboxOnline && checkboxOnline.checked) {
      const h5 = document.createElement('h5');
      h5.className = 'online-serv';
      h5.id = 'online-service';
      h5.innerHTML = `Online service <span>${onlinePrice.textContent}</span>`;
      innerDetails.appendChild(h5);
    }

    if (checkboxLarger && checkboxLarger.checked) {
      const h5 = document.createElement('h5');
      h5.className = 'large-storage';
      h5.id = 'larger-storage';
      h5.innerHTML = `Larger storage <span>${largerPrice.textContent}</span>`;
      innerDetails.appendChild(h5);
    }

    if (checkboxCustomizable && checkboxCustomizable.checked) {
      const h5 = document.createElement('h5');
      h5.className = 'custom-profile';
      h5.id = 'customizable-profile';
      h5.innerHTML = `Customizable profile <span>${customizablePrice.textContent}</span>`;
      innerDetails.appendChild(h5);
    }

    // Calculate and update total
    let total = 0;
    if (planPriceSpan) {
      const planPriceStr = planPriceSpan.textContent.replace(/[^0-9]/g, '');
      total += parseInt(planPriceStr) || 0;
    }

    const addonH5s = innerDetails.querySelectorAll('h5');
    addonH5s.forEach(h5 => {
      const span = h5.querySelector('span');
      if (span) {
        const addonStr = span.textContent.replace(/[^0-9]/g, '');
        total += parseInt(addonStr) || 0;
      }
    });

    const totalH5 = document.querySelector('.total h5');
    if (totalH5) {
      const period = isYearly ? 'year' : 'month';
      const unit = isYearly ? '/yr' : '/mo';
      totalH5.innerHTML = `Total (per ${period}) <span>+$${total}${unit}</span>`;
    }
  }
}

showStep(1);

