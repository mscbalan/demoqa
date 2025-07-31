#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Student Registration Form Automation...\n');

// Check if package.json exists
if (!fs.existsSync('package.json')) {
    console.error('❌ package.json not found. Please run this script from the project root directory.');
    process.exit(1);
}

try {
    // Install dependencies
    console.log('📦 Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully!\n');

    // Install Playwright browsers
    console.log('🌐 Installing Playwright browsers...');
    execSync('npx playwright install', { stdio: 'inherit' });
    console.log('✅ Browsers installed successfully!\n');

    // Verify test files exist
    const requiredFiles = [
        'pages/StudentRegistrationForm.js',
        'utils/TestDataGenerator.js',
        'utils/WaitUtils.js',
        'tests/studentRegistrationForm.spec.js',
        'test-files/test-image.txt'
    ];

    console.log('🔍 Verifying project structure...');
    let allFilesExist = true;
    
    for (const file of requiredFiles) {
        if (fs.existsSync(file)) {
            console.log(`✅ ${file}`);
        } else {
            console.log(`❌ ${file} - Missing`);
            allFilesExist = false;
        }
    }

    if (!allFilesExist) {
        console.log('\n⚠️  Some required files are missing. Please ensure all files are present.');
    } else {
        console.log('\n✅ All required files are present!');
    }

    console.log('\n🎉 Setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Run tests: npm test');
    console.log('2. Run tests in headed mode: npm run test:headed');
    console.log('3. Run tests in Chrome: npm run test:chrome');
    console.log('4. Run tests in Firefox: npm run test:firefox');
    console.log('5. View test report: npm run report');
    console.log('\n📖 For more information, see README.md');

} catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
} 