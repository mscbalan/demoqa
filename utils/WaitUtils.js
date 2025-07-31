const { expect } = require('@playwright/test');

class WaitUtils {
    constructor(page) {
        this.page = page;
    }

    /**
     * Wait for element to be visible and clickable
     * @param {string} selector - Element selector
     * @param {number} timeout - Timeout in milliseconds (default: 10000)
     */
    async waitForElement(selector, timeout = 10000) {
        await this.page.waitForSelector(selector, { 
            state: 'visible',
            timeout: timeout 
        });
    }

    /**
     * Wait for element to be enabled and clickable
     * @param {string} selector - Element selector
     * @param {number} timeout - Timeout in milliseconds (default: 10000)
     */
    async waitForElementEnabled(selector, timeout = 10000) {
        await this.page.waitForSelector(selector, { 
            state: 'visible',
            timeout: timeout 
        });
        
        // Additional check for enabled state
        await this.page.waitForFunction(
            (sel) => {
                const element = document.querySelector(sel);
                return element && !element.disabled && element.offsetParent !== null;
            },
            selector,
            { timeout: timeout }
        );
    }

    /**
     * Wait for network to be idle
     * @param {number} timeout - Timeout in milliseconds (default: 30000)
     */
    async waitForNetworkIdle(timeout = 30000) {
        // Simple approach: wait for DOM to be ready and then a short delay
        await this.page.waitForLoadState('domcontentloaded', { timeout: timeout });
        // Add a small delay to allow any remaining resources to load
        await this.page.waitForTimeout(1000);
    }

    /**
     * Wait for DOM to be ready
     * @param {number} timeout - Timeout in milliseconds (default: 10000)
     */
    async waitForDOMReady(timeout = 10000) {
        await this.page.waitForLoadState('domcontentloaded', { timeout: timeout });
    }

    /**
     * Wait for element to have specific text
     * @param {string} selector - Element selector
     * @param {string} text - Expected text
     * @param {number} timeout - Timeout in milliseconds (default: 10000)
     */
    async waitForElementText(selector, text, timeout = 10000) {
        await this.page.waitForFunction(
            (sel, expectedText) => {
                const element = document.querySelector(sel);
                return element && element.textContent.trim() === expectedText;
            },
            selector,
            text,
            { timeout: timeout }
        );
    }

    /**
     * Wait for element to be present in DOM
     * @param {string} selector - Element selector
     * @param {number} timeout - Timeout in milliseconds (default: 10000)
     */
    async waitForElementAttached(selector, timeout = 10000) {
        await this.page.waitForSelector(selector, { 
            state: 'attached',
            timeout: timeout 
        });
    }

    /**
     * Wait for element to disappear
     * @param {string} selector - Element selector
     * @param {number} timeout - Timeout in milliseconds (default: 10000)
     */
    async waitForElementDetached(selector, timeout = 10000) {
        await this.page.waitForSelector(selector, { 
            state: 'detached',
            timeout: timeout 
        });
    }

    /**
     * Wait for URL to match pattern
     * @param {string|RegExp} urlPattern - URL pattern to match
     * @param {number} timeout - Timeout in milliseconds (default: 10000)
     */
    async waitForURL(urlPattern, timeout = 10000) {
        await this.page.waitForURL(urlPattern, { timeout: timeout });
    }

    /**
     * Wait for page to be fully loaded
     * @param {number} timeout - Timeout in milliseconds (default: 30000)
     */
    async waitForPageLoad(timeout = 30000) {
        await this.page.waitForLoadState('load', { timeout: timeout });
        await this.waitForNetworkIdle(timeout);
    }

    /**
     * Wait for modal to appear
     * @param {string} modalSelector - Modal selector
     * @param {number} timeout - Timeout in milliseconds (default: 10000)
     */
    async waitForModal(modalSelector, timeout = 10000) {
        await this.waitForElement(modalSelector, timeout);
        
        // Additional wait for modal animation
        await this.page.waitForTimeout(500);
    }

    /**
     * Wait for form to be ready for interaction
     * @param {string} formSelector - Form selector
     * @param {number} timeout - Timeout in milliseconds (default: 10000)
     */
    async waitForFormReady(formSelector, timeout = 10000) {
        await this.waitForElement(formSelector, timeout);
        
        // Wait for any loading states to complete
        await this.page.waitForFunction(
            (sel) => {
                const form = document.querySelector(sel);
                if (!form) return false;
                
                // Check if form is not in loading state
                const loadingElements = form.querySelectorAll('[class*="loading"], [class*="spinner"]');
                return loadingElements.length === 0;
            },
            formSelector,
            { timeout: timeout }
        );
    }

    /**
     * Wait for file upload to complete
     * @param {string} fileInputSelector - File input selector
     * @param {number} timeout - Timeout in milliseconds (default: 10000)
     */
    async waitForFileUpload(fileInputSelector, timeout = 10000) {
        await this.page.waitForFunction(
            (sel) => {
                const fileInput = document.querySelector(sel);
                return fileInput && fileInput.files && fileInput.files.length > 0;
            },
            fileInputSelector,
            { timeout: timeout }
        );
    }

    /**
     * Wait for dropdown options to load
     * @param {string} dropdownSelector - Dropdown selector
     * @param {number} timeout - Timeout in milliseconds (default: 10000)
     */
    async waitForDropdownOptions(dropdownSelector, timeout = 10000) {
        await this.page.waitForFunction(
            (sel) => {
                const dropdown = document.querySelector(sel);
                if (!dropdown) return false;
                
                // Check if dropdown has options
                const options = dropdown.querySelectorAll('option');
                return options.length > 0;
            },
            dropdownSelector,
            { timeout: timeout }
        );
    }

    /**
     * Wait for element to be stable (not moving/changing)
     * @param {string} selector - Element selector
     * @param {number} stabilityTime - Time to wait for stability in ms (default: 1000)
     * @param {number} timeout - Timeout in milliseconds (default: 10000)
     */
    async waitForElementStable(selector, stabilityTime = 1000, timeout = 10000) {
        await this.page.waitForFunction(
            (sel, stabilityMs) => {
                return new Promise((resolve) => {
                    const element = document.querySelector(sel);
                    if (!element) {
                        resolve(false);
                        return;
                    }
                    
                    let lastPosition = element.getBoundingClientRect();
                    let stable = false;
                    
                    const checkStability = () => {
                        const currentPosition = element.getBoundingClientRect();
                        if (currentPosition.x === lastPosition.x && 
                            currentPosition.y === lastPosition.y &&
                            currentPosition.width === lastPosition.width &&
                            currentPosition.height === lastPosition.height) {
                            stable = true;
                            resolve(true);
                        } else {
                            lastPosition = currentPosition;
                            setTimeout(checkStability, 100);
                        }
                    };
                    
                    setTimeout(checkStability, stabilityMs);
                });
            },
            selector,
            stabilityTime,
            { timeout: timeout }
        );
    }
}

module.exports = WaitUtils; 