const { faker } = require('@faker-js/faker');

class TestDataGenerator {
    constructor() {
        // Set seed for reproducible results
        faker.seed(123);
    }

    generatePersonalInfo() {
        return {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            phone: faker.phone.number('##########'), // 10-digit phone number
        };
    }

    generateGender() {
        const genders = ['Male', 'Female', 'Other'];
        return faker.helpers.arrayElement(genders);
    }

    generateDateOfBirth() {
        // Generate a date between 18 and 65 years ago
        const startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 65);
        
        const endDate = new Date();
        endDate.setFullYear(endDate.getFullYear() - 18);
        
        const dateOfBirth = faker.date.between({ from: startDate, to: endDate });
        
        return {
            day: dateOfBirth.getDate(),
            month: dateOfBirth.toLocaleString('en', { month: 'long' }),
            year: dateOfBirth.getFullYear(),
            monthIndex: dateOfBirth.getMonth() // 0-based index for date picker
        };
    }

    generateSubjects() {
        const availableSubjects = [
            'Maths', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
            'English', 'Economics', 'Arts', 'Commerce', 'Accounting',
            'Civics', 'Hindi', 'History', 'Geography'
        ];
        
        // Select 1-3 random subjects
        const numSubjects = faker.number.int({ min: 1, max: 3 });
        return faker.helpers.arrayElements(availableSubjects, numSubjects);
    }

    generateHobbies() {
        const availableHobbies = ['Sports', 'Reading', 'Music'];
        // Select 1-2 random hobbies
        const numHobbies = faker.number.int({ min: 1, max: 2 });
        return faker.helpers.arrayElements(availableHobbies, numHobbies);
    }

    generateAddress() {
        return faker.location.streetAddress(true);
    }

    generateStateAndCity() {
        const stateCityMap = {
            'NCR': ['Delhi', 'Gurgaon', 'Noida'],
            'Uttar Pradesh': ['Agra', 'Lucknow', 'Merrut'],
            'Haryana': ['Karnal', 'Panipat'],
            'Rajasthan': ['Jaipur', 'Jaiselmer']
        };
        
        const states = Object.keys(stateCityMap);
        const selectedState = faker.helpers.arrayElement(states);
        const cities = stateCityMap[selectedState];
        const selectedCity = faker.helpers.arrayElement(cities);
        
        return {
            state: selectedState,
            city: selectedCity
        };
    }

    generateCompleteFormData() {
        const personalInfo = this.generatePersonalInfo();
        const dateOfBirth = this.generateDateOfBirth();
        const stateCity = this.generateStateAndCity();
        
        return {
            ...personalInfo,
            gender: this.generateGender(),
            dateOfBirth: dateOfBirth,
            subjects: this.generateSubjects(),
            hobbies: this.generateHobbies(),
            address: this.generateAddress(),
            state: stateCity.state,
            city: stateCity.city
        };
    }

    // Generate multiple test data sets for data-driven testing
    generateTestDataSets(count = 3) {
        const testDataSets = [];
        
        for (let i = 0; i < count; i++) {
            // Reset seed for each dataset to ensure variety
            faker.seed(123 + i);
            testDataSets.push(this.generateCompleteFormData());
        }
        
        return testDataSets;
    }
}

module.exports = TestDataGenerator; 