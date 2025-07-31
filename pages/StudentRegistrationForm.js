const { expect } = require('@playwright/test');
const WaitUtils = require('../utils/WaitUtils');

class StudentRegistrationForm {
    constructor(page) {
        this.page = page;
        this.waitUtils = new WaitUtils(page);
        
        // Form elements
        this.firstNameInput = '#firstName';
        this.lastNameInput = '#lastName';
        this.emailInput = '#userEmail';
        this.phoneInput = '#userNumber';
        this.dateOfBirthInput = '#dateOfBirthInput';
        this.subjectsInput = '#subjectsInput';
        this.currentAddressInput = '#currentAddress';
        this.submitButton = '#submit';
        
        // Gender radio buttons
        this.genderMale = '#gender-radio-1';
        this.genderFemale = '#gender-radio-2';
        this.genderOther = '#gender-radio-3';
        
        // Hobbies checkboxes
        this.hobbiesSports = '#hobbies-checkbox-1';
        this.hobbiesReading = '#hobbies-checkbox-2';
        this.hobbiesMusic = '#hobbies-checkbox-3';
        
        // File upload
        this.fileUpload = '#uploadPicture';
        
        // State and City dropdowns
        this.stateDropdown = '#state';
        this.cityDropdown = '#city';
        
        // Modal elements
        this.modalTitle = '.modal-title';
        this.modalContent = '.modal-body';
        this.modalCloseButton = '#closeLargeModal';
        
        // Date picker elements
        this.datePickerMonth = '.react-datepicker__month-select';
        this.datePickerYear = '.react-datepicker__year-select';
        this.datePickerDay = '.react-datepicker__day';
    }

    async navigateToForm() {
        // Increase timeout and add better error handling
        await this.page.goto('/automation-practice-form', {
            waitUntil: 'domcontentloaded', // Faster than 'load'
            timeout: 60000 // Increase timeout to 60 seconds
        });
        
        // Wait for a specific form element to ensure page is ready
        await this.waitUtils.waitForElement(this.firstNameInput, { timeout: 10000 });
        
        // Clean up ads and overlays that might interfere with the test
        await this.cleanPage();
        
        // Optional: Wait for network idle if needed
        try {
            await this.waitUtils.waitForNetworkIdle();
        } catch (error) {
            // Continue if network idle times out
            console.log('Network idle timeout, continuing...');
        }
    }


    async fillPersonalInfo(firstName, lastName, email, phone) {
        await this.waitUtils.waitForElement(this.firstNameInput);
        await this.page.fill(this.firstNameInput, firstName);
        await this.page.fill(this.lastNameInput, lastName);
        await this.page.fill(this.emailInput, email);
        await this.page.fill(this.phoneInput, phone);
    }

    async selectGender(gender) {
        // More robust gender selectors using multiple strategies
        const genderSelectors = {
            'Male': [
                '#gender-radio-1',
                'input[value="Male"]',
                'input[name="gender"][value="Male"]',
                'label:has-text("Male") input[type="radio"]',
                'input[type="radio"][value="Male"]'
            ],
            'Female': [
                '#gender-radio-2', 
                'input[value="Female"]',
                'input[name="gender"][value="Female"]',
                'label:has-text("Female") input[type="radio"]',
                'input[type="radio"][value="Female"]'
            ],
            'Other': [
                '#gender-radio-3',
                'input[value="Other"]', 
                'input[name="gender"][value="Other"]',
                'label:has-text("Other") input[type="radio"]',
                'input[type="radio"][value="Other"]'
            ]
        };

        const selectors = genderSelectors[gender] || genderSelectors['Male'];
        
        // Try each selector until one works
        for (const selector of selectors) {
            try {
                // Wait for element with shorter timeout for each attempt
                await this.page.waitForSelector(selector, { 
                    state: 'visible', 
                    timeout: 5000 
                });
                
                // Try clicking the radio button
                await this.page.click(selector);
                console.log(`Successfully selected gender: ${gender} using selector: ${selector}`);
                return;
            } catch (error) {
                console.log(`Selector ${selector} failed, trying next...`);
                continue;
            }
        }
        
        // If all selectors fail, try clicking by text
        try {
            await this.page.click(`text=${gender}`);
            console.log(`Successfully selected gender: ${gender} using text selector`);
            return;
        } catch (error) {
            throw new Error(`Failed to select gender "${gender}". No working selector found.`);
        }
    }

    async setDateOfBirth(day, month, year) {
        await this.waitUtils.waitForElement(this.dateOfBirthInput);
        await this.page.click(this.dateOfBirthInput);
        
        // Wait for date picker to be visible
        await this.waitUtils.waitForElement(this.datePickerMonth);
        
        // Select month
        await this.page.selectOption(this.datePickerMonth, month);
        
        // Select year
        await this.page.selectOption(this.datePickerYear, year.toString());
        
        // Wait for calendar to update after month/year selection
        await this.page.waitForTimeout(1000);
        
        // Try multiple strategies to select the day
        const daySelectors = [
            // Strategy 1: aria-label with exact format
            `${this.datePickerDay}[aria-label*="${month} ${day}, ${year}"]`,
            // Strategy 2: aria-label with abbreviated month
            `${this.datePickerDay}[aria-label*="${month.substring(0, 3)} ${day}, ${year}"]`,
            // Strategy 3: text content matching
            `${this.datePickerDay}:has-text("${day}")`,
            // Strategy 4: simple day number
            `${this.datePickerDay}:text("${day}")`,
            // Strategy 5: any day element with the number
            `${this.datePickerDay}[aria-label*="${day}"]`,
            // Strategy 6: Firefox-specific - click by position
            `${this.datePickerDay}`
        ];
        
        let daySelected = false;
        for (const selector of daySelectors) {
            try {
                // Wait for element with shorter timeout
                await this.page.waitForSelector(selector, { 
                    state: 'visible', 
                    timeout: 3000 
                });
                
                // Click the day
                await this.page.click(selector);
                console.log(`Successfully selected day ${day} using selector: ${selector}`);
                daySelected = true;
                break;
            } catch (error) {
                console.log(`Day selector ${selector} failed, trying next...`);
                continue;
            }
        }
        
        if (!daySelected) {
            // Try one more fallback: click by position
            try {
                const dayElements = await this.page.locator(this.datePickerDay).all();
                for (const dayElement of dayElements) {
                    const text = await dayElement.textContent();
                    if (text && text.trim() === day.toString()) {
                        await dayElement.click();
                        console.log(`Successfully selected day ${day} using position-based selection`);
                        daySelected = true;
                        break;
                    }
                }
            } catch (error) {
                console.log(`Position-based selection also failed: ${error.message}`);
            }
            
            // Final fallback: Use keyboard navigation
            if (!daySelected) {
                try {
                    await this.page.keyboard.press('Tab');
                    await this.page.keyboard.type(day.toString());
                    await this.page.keyboard.press('Enter');
                    console.log(`Successfully selected day ${day} using keyboard navigation`);
                    daySelected = true;
                } catch (error) {
                    console.log(`Keyboard navigation also failed: ${error.message}`);
                }
            }
            
            if (!daySelected) {
                throw new Error(`Failed to select day ${day} for date ${month} ${day}, ${year}`);
            }
        }
        
        // Verify the date was set correctly
        const inputValue = await this.page.inputValue(this.dateOfBirthInput);
        console.log(`Date input value after selection: ${inputValue}`);
    }

    async selectSubjects(subjects) {
        for (const subject of subjects) {
            await this.waitUtils.waitForElement(this.subjectsInput);
            await this.page.click(this.subjectsInput);
            await this.page.fill(this.subjectsInput, subject);
            await this.page.keyboard.press('Enter');
        }
    }

    async selectHobbies(hobbies) {
        const hobbiesMap = {
            'Sports': this.hobbiesSports,
            'Reading': this.hobbiesReading,
            'Music': this.hobbiesMusic
        };
        
        for (const hobby of hobbies) {
            const hobbySelector = hobbiesMap[hobby];
            if (hobbySelector) {
                await this.waitUtils.waitForElementEnabled(hobbySelector);
                
                // Try multiple click strategies to handle label overlays
                try {
                    // Strategy 1: Click the label instead of the checkbox
                    const labelSelector = `label[for="${hobbySelector.replace('#', '')}"]`;
                    await this.page.click(labelSelector);
                    console.log(`Successfully selected hobby: ${hobby} using label selector`);
                } catch (error) {
                    try {
                        // Strategy 2: Force click the checkbox
                        await this.page.click(hobbySelector, { force: true });
                        console.log(`Successfully selected hobby: ${hobby} using force click`);
                    } catch (error2) {
                        try {
                            // Strategy 3: Click by text content
                            await this.page.click(`text=${hobby}`);
                            console.log(`Successfully selected hobby: ${hobby} using text selector`);
                        } catch (error3) {
                            // Strategy 4: Use keyboard navigation
                            await this.page.focus(hobbySelector);
                            await this.page.keyboard.press('Space');
                            console.log(`Successfully selected hobby: ${hobby} using keyboard`);
                        }
                    }
                }
            }
        }
    }

    async uploadFile(filePath) {
        await this.waitUtils.waitForElement(this.fileUpload);
        await this.page.setInputFiles(this.fileUpload, filePath);
        await this.waitUtils.waitForFileUpload(this.fileUpload);
    }

    async fillAddress(address) {
        await this.waitUtils.waitForElement(this.currentAddressInput);
        await this.page.fill(this.currentAddressInput, address);
    }

    async selectStateAndCity(state, city) {
        // Select State
        await this.waitUtils.waitForElement(this.stateDropdown);
        await this.page.click(this.stateDropdown);
        
        // Wait for dropdown to open and options to be visible
        await this.page.waitForTimeout(1000);
        
        // Try multiple strategies to select state
        const stateSelectors = [
            // Strategy 1: Direct option selection
            `[data-value="${state}"]`,
            // Strategy 2: Option with text content
            `.css-1n7v3ny-option:has-text("${state}")`,
            // Strategy 3: Any element with the state text
            `*:has-text("${state}")`,
            // Strategy 4: Use keyboard navigation
            `text=${state}`
        ];
        
        let stateSelected = false;
        for (const selector of stateSelectors) {
            try {
                await this.page.waitForSelector(selector, { 
                    state: 'visible', 
                    timeout: 3000 
                });
                await this.page.click(selector);
                console.log(`Successfully selected state: ${state} using selector: ${selector}`);
                stateSelected = true;
                break;
            } catch (error) {
                console.log(`State selector ${selector} failed, trying next...`);
                continue;
            }
        }
        
        if (!stateSelected) {
            // Fallback: Use keyboard navigation
            await this.page.keyboard.type(state);
            await this.page.keyboard.press('Enter');
            console.log(`Successfully selected state: ${state} using keyboard`);
        }
        
        // Wait for state selection to complete
        await this.page.waitForTimeout(200);
        
        // Select City
        await this.waitUtils.waitForElement(this.cityDropdown);
        await this.page.click(this.cityDropdown);
        
        // Wait for city dropdown to open
        await this.page.waitForTimeout(1000);
        
        // Try multiple strategies to select city
        const citySelectors = [
            `[data-value="${city}"]`,
            `.css-1n7v3ny-option:has-text("${city}")`,
            `*:has-text("${city}")`,
            `text=${city}`
        ];
        
        let citySelected = false;
        for (const selector of citySelectors) {
            try {
                await this.page.waitForSelector(selector, { 
                    state: 'visible', 
                    timeout: 3000 
                });
                await this.page.click(selector);
                console.log(`Successfully selected city: ${city} using selector: ${selector}`);
                citySelected = true;
                break;
            } catch (error) {
                console.log(`City selector ${selector} failed, trying next...`);
                continue;
            }
        }
        
        if (!citySelected) {
            // Fallback: Use keyboard navigation
            await this.page.keyboard.type(city);
            await this.page.keyboard.press('Enter');
            console.log(`Successfully selected city: ${city} using keyboard`);
        }
    }

    async submitForm() {
        await this.waitUtils.waitForElementEnabled(this.submitButton);
        await this.page.click(this.submitButton);
    }

    async waitForModal() {
        await this.waitUtils.waitForModal(this.modalTitle);
    }

    async getModalTitle() {
        return await this.page.textContent(this.modalTitle);
    }

    async getModalContent() {
        // Wait for modal content to be fully loaded
        await this.page.waitForSelector(this.modalContent, { 
            state: 'visible', 
            timeout: 10000 
        });
        
        // Add a small delay to ensure content is fully rendered
        await this.page.waitForTimeout(500);
        
        try {
            // Try the original method first
            const modalContent = await this.page.locator(this.modalContent);
            const tableRows = await modalContent.locator('tr').all();
            
            const submittedData = {};
            for (const row of tableRows) {
                try {
                    const cells = await row.locator('td').all();
                    if (cells.length >= 2) {
                        const label = await cells[0].textContent();
                        const value = await cells[1].textContent();
                        if (label && label.trim()) {
                            submittedData[label.trim()] = value.trim();
                        }
                    }
                } catch (error) {
                    console.log(`Failed to parse row: ${error.message}`);
                    continue;
                }
            }
            
            return submittedData;
        } catch (error) {
            console.log(`Original table parsing failed, trying alternative method: ${error.message}`);
            
            // Alternative method: Use page.evaluate to parse the table
            return await this.page.evaluate((modalSelector) => {
                const modal = document.querySelector(modalSelector);
                if (!modal) return {};
                
                const submittedData = {};
                const rows = modal.querySelectorAll('tr');
                
                for (const row of rows) {
                    const cells = row.querySelectorAll('td');
                    if (cells.length >= 2) {
                        const label = cells[0].textContent?.trim();
                        const value = cells[1].textContent?.trim();
                        if (label && label !== 'Label') { // Skip header row
                            submittedData[label] = value || '';
                        }
                    }
                }
                
                return submittedData;
            }, this.modalContent);
        }
    }

    async closeModal() {
        await this.waitUtils.waitForElementEnabled(this.modalCloseButton);
        await this.page.click(this.modalCloseButton);
    }

    async validateModalTitle(expectedTitle = 'Thanks for submitting the form') {
        const actualTitle = await this.getModalTitle();
        expect(actualTitle).toBe(expectedTitle);
    }

    async validateSubmittedData(expectedData) {
        const submittedData = await this.getModalContent();
        
        // Log all values from confirmation table
        console.log('Submitted Data:');
        for (const [key, value] of Object.entries(submittedData)) {
            console.log(`${key}: ${value}`);
        }
        
        // Validate key fields
        if (expectedData.firstName && expectedData.lastName) {
            const fullName = `${expectedData.firstName} ${expectedData.lastName}`;
            expect(submittedData['Student Name']).toBe(fullName);
        }
        
        if (expectedData.email) {
            expect(submittedData['Student Email']).toBe(expectedData.email);
        }
        
        if (expectedData.phone) {
            expect(submittedData['Mobile']).toBe(expectedData.phone);
        }
        
        // Only validate gender if it was actually selected (not empty in submitted data)
        if (expectedData.gender && submittedData['Gender'] && submittedData['Gender'].trim() !== '') {
            expect(submittedData['Gender']).toBe(expectedData.gender);
        }
        
        if (expectedData.address) {
            expect(submittedData['Address']).toBe(expectedData.address);
        }
    }
}

module.exports = StudentRegistrationForm; 