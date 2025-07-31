Student Registration Form Automation

This project automates the complete flow of filling and submitting the "Student Registration Form" using Playwright with dynamic test data generation and comprehensive validation.

Objective

Automate the entire flow of filling and submitting the "Student Registration Form" using Playwright with dynamic test data, and validate the submitted information in the confirmation modal.

## ✅ Features Implemented

### Functional Steps
- ✅ Navigate to the form at https://demoqa.com/automation-practice-form
- ✅ Pre-clean the page (remove footer and ad banners)
- ✅ Fill the form using dynamically generated data:
  - First Name, Last Name, Email
  - Select Gender (randomly pick one)
  - Phone Number (10-digit)
  - Date of Birth: 20 April 1990 (specific requirement)
  - Subject: Type and select Maths
  - Hobbies: Select multiple (Sports and Reading)
  - Upload a file (test image provided)
  - Current Address
  - State: NCR, City: Delhi
- ✅ Click Submit
- ✅ Validate Submission Modal:
  - Ensure modal title is "Thanks for submitting the form"
  - Verify submitted values match the filled data
  - Log all values from the confirmation table
- ✅ Close the modal

### Technical Requirements
- ✅ Use Page Object Model (POM) structure
- ✅ Use faker.js for dynamic test data generation
- ✅ Include screenshot on test failure
- ✅ Use custom wait strategy (no hard waitForTimeout)
- ✅ Cross-browser capable (Chrome, Firefox)
- ✅ Parallel execution
- ✅ Generate HTML test report
- ✅ Data-driven test implementation

 Setup Instructions

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone or download the project
  
   # If you have the project files, navigate to the project directory
   cd form-automation-playwright
   ```

2. **Quick setup (recommended)**
   ```bash
   npm run setup
   ```
   
   This will automatically install dependencies and browsers.

3. **Manual setup (alternative)**
   ```bash
   # Install dependencies
   npm install
   
   # Install Playwright browsers
   npm run install-browsers
   ```

## 🧪 Running Tests

### Basic Test Execution
```bash
# Run all tests
npm test

# Run tests in headed mode (visible browser)
npm run test:headed
```

### Cross-Browser Testing
```bash
# Run tests in Chrome only
npm run test:chrome

# Run tests in Firefox only
npm run test:firefox
```

 Parallel Execution

# Run tests in parallel (4 workers)
npm run test:parallel
```

### View Test Reports
```bash
# Open HTML test report
npm run report
```

### Interactive Test Runner
```bash
# Run the interactive test runner
npm run run
```

## 📊 Test Features

### Data-Driven Testing
- Generates 3 different test data sets automatically
- Includes specific test case with required data (20 April 1990)
- Uses faker.js for realistic data generation

### Page Object Model
- Clean separation of page elements and actions
- Reusable methods for form interactions
- Easy maintenance and updates

### Custom Wait Strategies
- No hard timeouts used
- Intelligent waiting for elements and network states
- Robust element interaction

### Cross-Browser Support
- Chrome and Firefox configurations
- Consistent behavior across browsers
- Parallel execution capability

### Comprehensive Validation
- Modal title verification
- Submitted data validation
- Detailed logging of confirmation data
- Screenshot capture on failures

## 🔧 Configuration

### Playwright Configuration (`playwright.config.js`)
- Cross-browser support (Chrome, Firefox)
- Parallel execution enabled
- HTML and JSON reporting
- Custom timeouts and viewport settings
- Screenshot and video capture on failure

### Test Data Generation
- Realistic personal information
- Random gender selection
- Date of birth generation (18-65 years old)
- Multiple subjects and hobbies
- State and city combinations

## 📝 Test Scenarios

1. **Data-Driven Tests**: 4 different test data sets (3 generated + 1 specific)
2. **Specific Requirement Test**: Uses exact data from requirements (20 April 1990)
3. **Cross-Browser Compatibility**: Ensures consistent behavior across browsers

## 🐛 Troubleshooting

### Common Issues

1. **Browser Installation**
   ```bash
   npx playwright install
   ```

2. **Network Issues**
   - Ensure stable internet connection
   - The form requires access to demoqa.com

3. **Element Not Found**
   - Tests include custom wait strategies
   - Page cleaning removes interfering elements

### Debug Mode
```bash
# Run with debug information
DEBUG=pw:api npm test
```

## 📈 Reports

After test execution, you can find:
- **HTML Report**: `playwright-report/index.html`
- **JSON Results**: `test-results.json`
- **Screenshots**: On test failures
- **Videos**: On test failures

## 🤝 Contributing

1. Follow the existing code structure
2. Add new test scenarios as needed
3. Update documentation for any changes
4. Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License.

---

**Note**: This automation framework is designed to be robust, maintainable, and scalable for future enhancements. 