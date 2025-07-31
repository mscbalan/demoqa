#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🧪 Student Registration Form Test Runner\n');

const menuOptions = [
    { key: '1', description: 'Run all tests', command: 'npm test' },
    { key: '2', description: 'Run tests in headed mode (visible browser)', command: 'npm run test:headed' },
    { key: '3', description: 'Run tests in Chrome only', command: 'npm run test:chrome' },
    { key: '4', description: 'Run tests in Firefox only', command: 'npm run test:firefox' },
    { key: '5', description: 'Run tests in parallel (4 workers)', command: 'npm run test:parallel' },
    { key: '6', description: 'View test report', command: 'npm run report' },
    { key: '7', description: 'Install browsers', command: 'npm run install-browsers' },
    { key: '8', description: 'Setup project (install dependencies)', command: 'npm run setup' },
    { key: 'q', description: 'Quit', command: null }
];

function displayMenu() {
    console.log('Select an option:');
    menuOptions.forEach(option => {
        console.log(`${option.key}. ${option.description}`);
    });
    console.log('');
}

function runCommand(command) {
    try {
        console.log(`\n🚀 Executing: ${command}\n`);
        execSync(command, { stdio: 'inherit' });
        console.log('\n✅ Command completed successfully!');
    } catch (error) {
        console.error('\n❌ Command failed:', error.message);
    }
}

function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim().toLowerCase());
        });
    });
}

async function main() {
    while (true) {
        displayMenu();
        
        const choice = await askQuestion('Enter your choice: ');
        
        if (choice === 'q') {
            console.log('\n👋 Goodbye!');
            rl.close();
            break;
        }
        
        const selectedOption = menuOptions.find(option => option.key === choice);
        
        if (selectedOption) {
            if (selectedOption.command) {
                runCommand(selectedOption.command);
            } else {
                console.log('\n👋 Goodbye!');
                rl.close();
                break;
            }
        } else {
            console.log('\n❌ Invalid choice. Please try again.');
        }
        
        console.log('\n' + '='.repeat(50) + '\n');
    }
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
    console.log('\n\n👋 Goodbye!');
    rl.close();
    process.exit(0);
});

main().catch(console.error); 