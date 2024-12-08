document.addEventListener('DOMContentLoaded', () => {
  const btnInstall = document.getElementById('btnInstall');
  let deferredInstallPrompt;
  const unsupportedBrowsers = ['Safari', 'Firefox'];

  // Function to detect unsupported browsers
  const isUnsupportedBrowser = unsupportedBrowsers.some(browser => navigator.userAgent.includes(browser));

  // Check if the app is running as a PWA
  const isPWA = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

  // If the app is running as a PWA, hide the install button
  if (isPWA) {
    if (btnInstall) {
      btnInstall.style.display = 'none';
    }
  } else {
    // Listen for 'beforeinstallprompt' to save the install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredInstallPrompt = e;
      console.log('beforeinstallprompt event fired');
      
      // Show the install button if available
      if (btnInstall) {
        btnInstall.style.display = 'block';
      }

      // Define autoClick function to simulate a button click
      const autoClick = () => {
        if (deferredInstallPrompt) {
          console.log('Auto-click triggered');
          deferredInstallPrompt.prompt();
          deferredInstallPrompt.userChoice.then((choice) => {
            if (choice.outcome === 'accepted') {
              console.log('User accepted the installation (auto prompt)');
              btnInstall.style.display = 'none';
              localStorage.setItem('pwaInstalled', 'true');
            } else {
              console.log('User dismissed the installation (auto prompt)');
            }
            deferredInstallPrompt = null; // Clear the deferred prompt
          });
        } else {
          console.log('No deferredInstallPrompt available');
        }
      };

      // Trigger the install prompt after a 10-second delay by simulating a click
      setTimeout(autoClick, 10000); // 10-second delay
    });

    // Listen for install button click
    if (btnInstall) {
      btnInstall.addEventListener('click', () => {
        if (deferredInstallPrompt) {
          deferredInstallPrompt.prompt();
          deferredInstallPrompt.userChoice.then((choice) => {
            if (choice.outcome === 'accepted') {
              console.log('User accepted the installation (button click)');
              btnInstall.style.display = 'none';
              localStorage.setItem('pwaInstalled', 'true');
            } else {
              console.log('User dismissed the installation (button click)');
            }
            deferredInstallPrompt = null; // Clear the deferred prompt
          });
        } else {
          // Custom message for unsupported browsers
          const message = isUnsupportedBrowser
            ? 'Currently unavailable. Please try again later or wait 10 seconds then refresh the page.'
            : 'The installation prompt is not available at the moment.';
          alert(message);
        }
      });
    }

    // Listen for the 'appinstalled' event
    window.addEventListener('appinstalled', () => {
      console.log('App installed');
      if (btnInstall) {
        btnInstall.style.display = 'none'; // Hide the install button
      }
      localStorage.setItem('pwaInstalled', 'true');
    });
  }
});
