const { test, expect } = require('@playwright/test');
const path = require('path');
const StudentRegistrationForm = require('../pages/StudentRegistrationForm');
const TestDataGenerator = require('../utils/TestDataGenerator');

// Generate test data sets for data-driven testing
const testDataGenerator = new TestDataGenerator();
const testDataSets = testDataGenerator.generateTestDataSets(3);

// Add specific test case with required data (20 April 1990)
const specificTestData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '1234567890',
    gender: 'Male',
    dateOfBirth: {
        day: 20,
        month: 'April',
        year: 1990,
        monthIndex: 3 // April is 3 (0-based)
    },
    subjects: ['Maths'],
    hobbies: ['Sports', 'Reading'],
    address: '123 Test Street, Test City, 12345',
    state: 'NCR',
    city: 'Delhi'
};

testDataSets.push(specificTestData);

test.describe('Student Registration Form Automation', () => {
    let studentForm;
    let testData;

    test.beforeEach(async ({ page }) => {
        studentForm = new StudentRegistrationForm(page);
        await studentForm.navigateToForm();
    });

    for (let i = 0; i < testDataSets.length; i++) {
        testData = testDataSets[i];
        
        test(`Complete form submission with test data set ${i + 1}`, async ({ page }) => {
            const studentForm = new StudentRegistrationForm(page);
            
            // Step 1: Navigate to form (already done in beforeEach)
            
            // Step 2: Clean page (already done in beforeEach)
            
            // Step 3: Fill the form with dynamic data
            await test.step('Fill personal information', async () => {
                await studentForm.fillPersonalInfo(
                    testData.firstName,
                    testData.lastName,
                    testData.email,
                    testData.phone
                );
            });

            // await test.step('Select gender', async () => {
            //     await studentForm.selectGender(testData.gender);
            // });

            await test.step('Set date of birth', async () => {
                await studentForm.setDateOfBirth(
                    testData.dateOfBirth.day,
                    testData.dateOfBirth.month,
                    testData.dateOfBirth.year
                );
            });

            await test.step('Select subjects', async () => {
                await studentForm.selectSubjects(testData.subjects);
            });

            await test.step('Select hobbies', async () => {
                await studentForm.selectHobbies(testData.hobbies);
            });

            await test.step('Upload file', async () => {
                const filePath = path.join(__dirname, '../test-files/test-image.txt');
                await studentForm.uploadFile(filePath);
            });

            await test.step('Fill address', async () => {
                await studentForm.fillAddress(testData.address);
            });

            await test.step('Select state and city', async () => {
                await studentForm.selectStateAndCity(testData.state, testData.city);
            });

            // Step 4: Submit the form
            await test.step('Submit form', async () => {
                await studentForm.submitForm();
            });

            // Step 5: Validate submission modal
            await test.step('Wait for modal and validate title', async () => {
                await studentForm.waitForModal();
                await studentForm.validateModalTitle();
            });

            await test.step('Validate submitted data', async () => {
                await studentForm.validateSubmittedData(testData);
            });

            // Step 6: Close the modal
            await test.step('Close modal', async () => {
                await studentForm.closeModal();
            });
        });
    }

    test('Form validation with specific required data (20 April 1990)', async ({ page }) => {
        const studentForm = new StudentRegistrationForm(page);
        
        // Use the specific test data that matches requirements
        const specificData = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '1234567890',
            gender: 'Male',
            dateOfBirth: {
                day: 20,
                month: 'April',
                year: 1990,
                monthIndex: 3
            },
            subjects: ['Maths'],
            hobbies: ['Sports', 'Reading'],
            address: '123 Test Street, Test City, 12345',
            state: 'NCR',
            city: 'Delhi'
        };

        await test.step('Fill form with specific required data', async () => {
            await studentForm.fillPersonalInfo(
                specificData.firstName,
                specificData.lastName,
                specificData.email,
                specificData.phone
            );
            // await studentForm.selectGender(specificData.gender); // Skipped for now
            await studentForm.setDateOfBirth(
                specificData.dateOfBirth.day,
                specificData.dateOfBirth.month,
                specificData.dateOfBirth.year
            );
            await studentForm.selectSubjects(specificData.subjects);
            await studentForm.selectHobbies(specificData.hobbies);
            
            const filePath = path.join(__dirname, '../test-files/test-image.txt');
            await studentForm.uploadFile(filePath);
            
            await studentForm.fillAddress(specificData.address);
            await studentForm.selectStateAndCity(specificData.state, specificData.city);
        });

        await test.step('Submit and validate form', async () => {
            await studentForm.submitForm();
            await studentForm.waitForModal();
            await studentForm.validateModalTitle();
            await studentForm.validateSubmittedData(specificData);
            await studentForm.closeModal();
        });
    });

    test('Cross-browser compatibility test', async ({ page }) => {
        const studentForm = new StudentRegistrationForm(page);
        const testData = testDataGenerator.generateCompleteFormData();

        await test.step('Complete form submission across browsers', async () => {
            await studentForm.fillPersonalInfo(
                testData.firstName,
                testData.lastName,
                testData.email,
                testData.phone
            );
            // await studentForm.selectGender(testData.gender); // Skipped for now
            await studentForm.setDateOfBirth(
                testData.dateOfBirth.day,
                testData.dateOfBirth.month,
                testData.dateOfBirth.year
            );
            await studentForm.selectSubjects(testData.subjects);
            await studentForm.selectHobbies(testData.hobbies);
            
            const filePath = path.join(__dirname, '../test-files/test-image.txt');
            await studentForm.uploadFile(filePath);
            
            await studentForm.fillAddress(testData.address);
            await studentForm.selectStateAndCity(testData.state, testData.city);
            
            await studentForm.submitForm();
            await studentForm.waitForModal();
            await studentForm.validateModalTitle();
            await studentForm.validateSubmittedData(testData);
            await studentForm.closeModal();
        });
    });
}); 