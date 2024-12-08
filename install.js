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
      console.log('Install prompt saved');

      // Show the install button if available
      if (btnInstall) {
        btnInstall.style.display = 'block';
      }
    });

    // Listen for install button click
    if (btnInstall) {
      btnInstall.addEventListener('click', () => {
        if (deferredInstallPrompt) {
          deferredInstallPrompt.prompt();
          deferredInstallPrompt.userChoice.then((choice) => {
            if (choice.outcome === 'accepted') {
              console.log('User accepted the installation');
              btnInstall.style.display = 'none';
              localStorage.setItem('pwaInstalled', 'true');
            } else {
              console.log('User dismissed the installation');
            }
            deferredInstallPrompt = null; // Clear the deferred prompt
          });
        } else {
          // Custom message for unsupported browsers
          const message = isUnsupportedBrowser
            ? 'The install option is currently unavailable. This feature may not be supported in your browser (e.g., Safari or Firefox). Please try again later or refresh the page.'
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
