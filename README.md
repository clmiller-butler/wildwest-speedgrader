# WildWest for Canvas SpeedGrader

A Tampermonkey userscript that opens the Canvas rubric and adds a purple **Submit & Go Next** button beside the rubric save button.

## Install

1. Install Tampermonkey in your browser if it is not already installed.
2. Open [wildwest.user.js](https://github.com/clmiller-butler/wildwest-speedgrader/raw/refs/heads/main/wildwest.user.js).
3. When Tampermonkey opens its installation screen, choose **Install**.
4. Disable any older copy of WildWest in Tampermonkey to avoid duplicate scripts.
5. Open or reload a Canvas SpeedGrader page.

If the link displays source code instead of an installation screen, create a new script in the Tampermonkey dashboard, replace the example contents with the complete contents of `wildwest.user.js`, and save.

## Use

1. Open an assignment in Canvas SpeedGrader.
2. The script attempts to open the rubric automatically.
3. Complete the rubric assessment.
4. Click **Submit & Go Next** to click Canvas's rubric save button, wait 1.2 seconds, and click the next-student button.

## Compatibility

- Version: **2.0**
- Runs on `https://*.instructure.com/courses/*/gradebook/speed_grader*`.
- Requires Canvas rubric controls matching the selectors in the script.
- Canvas sites using a custom domain are not covered by the current match rule.
- No build process, API key, or external library is required.

## Current limitations

The 1.2-second wait is a delay, not confirmation that Canvas saved the rubric successfully. Check that grades are saved when using the script, especially on a slow connection.

Canvas interface changes may require updating the button selectors. The existing script can also leave its custom button disabled and labeled "Saving..." if Canvas keeps the same rubric save button after submission; reloading the page resets it.

## Updates

This repository stores the original script behavior. GitHub automatic-update metadata has not been added. To update an installed copy, open the script link again and review the changes in Tampermonkey, or replace the dashboard contents manually.

## Validation

Repository setup verifies that the uploaded script matches the supplied code apart from leading whitespace in the userscript header. Live Canvas behavior has not been tested as part of this setup.
