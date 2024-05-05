document.addEventListener('DOMContentLoaded', function() {
    // DOM element references
    const form = document.querySelector('form');
    const ageInput = document.getElementById('age');
    const ageFeedback = document.getElementById('ageFeedback');
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    const childrenInput = document.getElementById('children');
    const quadrantInput = document.getElementById('quadrant');
    const bmiDisplay = document.getElementById('bmiDisplay');
    const progressBar = document.getElementById('progressBar');
    const inputs = form.querySelectorAll('input, select');

    let lastCalculatedBMI = null;

    // Function to update the progress bar based on form input completion
    function updateProgressBar() {
        let filledFields = 0;
        inputs.forEach(input => {
            if ((input.type === "radio" && input.checked) ||
                (input.type !== "radio" && input.value)) {
                filledFields++;
            }
        });

        const totalInputs = inputs.length; // Adjust if not all inputs are required
        const completionPercentage = (filledFields / totalInputs) * 142.5;
        progressBar.style.width = `${completionPercentage}%`;
        progressBar.textContent = `${Math.round(completionPercentage)}%`;
    }

    // Function to calculate BMI
    function calculateBMI() {
        if (!weightInput || !heightInput) return; // Check if inputs exist
        const weight = parseFloat(weightInput.value);
        const height = parseFloat(heightInput.value / 100); // Convert cm to meters
        if (weight > 0 && height > 0) {
            const bmi = weight / (height * height);
            lastCalculatedBMI = bmi.toFixed(2);
            bmiDisplay.textContent = `BMI: ${lastCalculatedBMI}`;
        } else {
            bmiDisplay.textContent = "BMI: -";
            lastCalculatedBMI = null;
        }
    }

    // Live age validation
    ageInput.addEventListener('input', function() {
        const ageValue = parseInt(ageInput.value, 10);
        if (ageValue < 18) {
            ageFeedback.textContent = 'You must be at least 18 years old.';
            ageFeedback.style.display = 'block';
        } else if (ageValue > 130) {
            ageFeedback.textContent = 'Please enter a valid age.';
            ageFeedback.style.display = 'block';
        } else {
            ageFeedback.style.display = 'none';
        }
    });

    // Event listener setup for form inputs to trigger BMI calculation and progress bar updates
    weightInput.addEventListener('input', calculateBMI);
    heightInput.addEventListener('input', calculateBMI);
    inputs.forEach(input => input.addEventListener('input', updateProgressBar));
     
    function calculateBMI() {
        if (!weightInput || !heightInput || !bmiDisplay) return; // Check if inputs exist
        const weight = parseFloat(weightInput.value);
        const height = parseFloat(heightInput.value / 100); // Convert height from cm to meters
        if (weight > 0 && height > 0) {
            const bmi = weight / (height * height);
            lastCalculatedBMI = bmi.toFixed(2);
            bmiDisplay.textContent = `BMI: ${lastCalculatedBMI}`;
            updateBMIClass(bmi); // Update the class based on BMI value
        } else {
            bmiDisplay.textContent = "BMI: -";
            lastCalculatedBMI = null;
        }
    }
    
    function updateBMIClass(bmi) {
        bmiDisplay.className = ''; // Reset classes
        if (bmi < 18.5) {
            bmiDisplay.classList.add('underweight');
        } else if (bmi >= 18.5 && bmi < 25) {
            bmiDisplay.classList.add('good');
        } else {
            bmiDisplay.classList.add('overweight');
        }
    }
    
    document.getElementById('clearFormButton').addEventListener('click', function() {
        document.getElementById('predictionForm').reset();
        document.getElementById('predictionText').innerHTML = "Your personalized insurance plan details will appear here after submission.";
    });
    
    
    
    
document.addEventListener('DOMContentLoaded', function() {
    const sourceText = "Welcome to Our Insurance Plan Predictor";
    const element = document.getElementById('typingText');
    let i = 0;
    
    function typeWriter() {
        if (i < sourceText.length) {
            element.textContent += sourceText.charAt(i);
            i++;
            setTimeout(typeWriter, 100); // Controls the typing speed
        } else {
            element.style.borderRight = '3px solid black'; // Keeps the cursor blinking after completion
        }
    }

    typeWriter(); // Initialize the typing effect
});

    // Form submit event
    document.getElementById('predictButton').addEventListener('click', function() {
        event.preventDefault();
        const genderValue = document.querySelector('input[name="sex"]:checked')?.value;
        const smokerValue = document.querySelector('input[name="smoker"]:checked')?.value;

        if (!ageInput || !weightInput || !heightInput || !childrenInput || !quadrantInput) {
            console.log("One or more inputs are missing.");
            return; // Exit if any essential input is missing
        }

        const formDataValues = [
            ageInput.value,
            genderValue, // '1' for male, '0' for female, '2' for other
            lastCalculatedBMI, // Last calculated BMI if available
            childrenInput.value,
            quadrantInput.value, // Added quadrant value (0, 1, 2, 3)
            smokerValue // Added smoker status ('1' for yes, '0' for no)
        ];

        console.log("Form Submission Data Values:", formDataValues);
        fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({inputs: formDataValues}),
        })
        .then(response => response.json())
        .then(data => {
            if(data.prediction !== undefined) {
                console.log('Prediction:', data.prediction);
                const predictionText = document.getElementById('predictionText');
                predictionText.innerHTML = "Calculating your best insurance plan...";
                setTimeout(() => {
                    predictionText.innerHTML = "Based on your inputs, the best insurance plan for you includes comprehensive health coverage with a minimal deductible is $" + parseFloat(data.prediction).toFixed(2);
                    // Additional animation for the results
                    predictionText.style.padding = '20px';
                    predictionText.style.background = 'linear-gradient(120deg, #a1c4fd, #c2e9fb)';
                    predictionText.style.borderRadius = '5px';
                    predictionText.style.color = '#003973';
                    predictionText.style.textAlign = 'center';
                }, 2000); // Simulate delay for calculation
            } else if(data.error) {
                console.error('Prediction error:', data.error);
            }
        })
        .catch((error) => {
            console.error('Fetch error:', error);
        });
    });
});