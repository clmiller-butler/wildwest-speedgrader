// ==UserScript==
// @name         WildWest
// @description  One-click rubric submission and next student for Canvas
// @match        https://*.instructure.com/courses/*/gradebook/speed_grader*
// @version      2.0
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    const SAVE_SELECTOR =
        'button[data-testid="save-rubric-assessment-button"]';

    const VIEW_SELECTOR =
        'button[data-testid="view-rubric-button"]';

    const NEXT_SELECTOR = '#next-student-button';
    const CUSTOM_BUTTON_ID = 'wildwest-save-next';

    // Give Canvas time to process a rubric submission.
    // This is a delay, not confirmation that saving succeeded.
    const SAVE_WAIT_MS = 1200;

    let isSubmitting = false;
    let scanTimer = null;

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function isSpeedGrader() {
        return /^\/courses\/\d+\/gradebook\/speed_grader\/?$/
            .test(window.location.pathname);
    }

    // Ensure the rubric is visible.
    function showRubric() {
        const btn = document.querySelector(VIEW_SELECTOR);

        if (
            btn &&
            !btn.disabled &&
            btn.textContent.trim().toLowerCase() === 'view rubric'
        ) {
            btn.click();
        }
    }

    // Save the rubric and advance to the next student.
    async function saveAndNext() {
        if (isSubmitting) return;

        const saveBtn = document.querySelector(SAVE_SELECTOR);

        if (!saveBtn || saveBtn.disabled) {
            console.warn('WildWest: Save button unavailable.');
            return;
        }

        isSubmitting = true;

        const customBtn = document.getElementById(CUSTOM_BUTTON_ID);

        if (customBtn) {
            customBtn.disabled = true;
            customBtn.textContent = 'Saving...';
        }

        try {
            // Trigger Canvas's normal rubric submission.
            saveBtn.click();

            // Allow the submission process to run.
            await sleep(SAVE_WAIT_MS);

            // Re-find the navigation button in the current DOM.
            const nextBtn = document.querySelector(NEXT_SELECTOR);

            if (!nextBtn || nextBtn.disabled) {
                console.warn(
                    'WildWest: Next student button unavailable.'
                );
                return;
            }

            nextBtn.click();

        } catch (error) {
            console.error('WildWest submission error:', error);

        } finally {
            // Allow Canvas to begin rendering the next student.
            await sleep(400);

            isSubmitting = false;
            scheduleScan();
        }
    }

    // Create our purple custom button.
    function createAdvanceButton() {
        const btn = document.createElement('button');

        btn.id = CUSTOM_BUTTON_ID;
        btn.type = 'button';
        btn.classList.add('btn', 'btn-primary');

        btn.textContent = 'Submit & Go Next';
        btn.title = 'Submit rubric and advance to next student';

        btn.style.padding = '8px';
        btn.style.backgroundColor = '#4d1f54';
        btn.style.borderRadius = '2px';
        btn.style.color = 'white';
        btn.style.marginLeft = '10px';
        btn.style.cursor = 'pointer';

        btn.addEventListener('click', saveAndNext);

        return btn;
    }

    // Make sure the custom button is beside the current
    // Canvas rubric submission button.
    function addNextRubric() {
        const saveBtn = document.querySelector(SAVE_SELECTOR);
        const existing = document.getElementById(CUSTOM_BUTTON_ID);

        if (!saveBtn || !saveBtn.parentNode) {
            if (existing) existing.remove();
            return;
        }

        // Button is already attached to the correct Save button.
        if (existing && existing.previousElementSibling === saveBtn) {
            return;
        }

        // Remove a stale button from the previous student.
        if (existing) existing.remove();

        const advance = createAdvanceButton();
        saveBtn.insertAdjacentElement('afterend', advance);
    }

    // Refresh the enhancements whenever Canvas changes.
    function scanCanvas() {
        if (!isSpeedGrader() || isSubmitting) return;

        showRubric();
        addNextRubric();
    }

    // Prevent excessive scanning during rapid DOM updates.
    function scheduleScan() {
        if (scanTimer !== null) return;

        scanTimer = window.setTimeout(() => {
            scanTimer = null;
            scanCanvas();
        }, 150);
    }

    // Observe Canvas rebuilding its interface.
    const observer = new MutationObserver(() => {
        scheduleScan();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });

    // Also listen for browser back/forward navigation.
    window.addEventListener('popstate', scheduleScan);

    // Initial setup.
    scanCanvas();

    console.log('WildWest 2.0 loaded.');

})();

