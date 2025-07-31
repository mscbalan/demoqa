Student Registration Form Automation

A comprehensive Playwright test automation framework for testing the DemoQA Student Registration Form with robust error handling and cross-browser compatibility.

🚀 Features

- Multi-Browser Testing: Chrome and Firefox support
- Robust Element Selection: Multiple fallback strategies for each form element
- Data-Driven Testing: Dynamic test data generation
- Comprehensive Validation: Form submission and modal validation
- Error Handling: Graceful handling of missing elements and timeouts
- Detailed Logging: Step-by-step execution feedback
- Cross-Browser Compatibility: Handles different browser behaviors

📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

 🛠️ Installation

1.Clone the repository(if applicable):

git clone <repository-url>
cd Assessment


2.Install dependencies:

npm install


3.Install Playwright browsers:

npx playwright install


🏃‍♂️ Running Tests

 Run All Tests

npx playwright test


Run Specific Test

npx playwright test --grep="Form validation with specific required data"


Run in Headed Mode (with browser visible)

npx playwright test --headed


 Run Chrome Only
npx playwright test --project=chrome
 Run Firefox Only
npx playwright test --project=firefox
Run with Different Reporter
npx playwright test --reporter=list
npx playwright test --reporter=line


 

 

  Test Features

 Form Elements Covered
-Personal Information: First Name, Last Name, Email, Phone
-Gender Selection: Radio button selection (with fallbacks)
-Date of Birth**: Date picker with multiple selection strategies
- Subjects: Multi-select dropdown
-Hobbies: Checkbox selection with label click strategy
-File Upload: File attachment functionality
- Address: Text area input
- State/City: Dropdown selection with keyboard fallback
- Form Submission: Submit button interaction
- Modal Validation: Confirmation modal parsing and validation

