const resource = [

  /* --- CSS --- */
  '/https://n3sh47.github.io/assets/css/style.css',

  /* --- PWA --- */
  '/https://n3sh47.github.io/app.js',
  '/https://n3sh47.github.io/sw.js',

  /* --- HTML --- */
  '/https://n3sh47.github.io/index.html',
  '/https://n3sh47.github.io/404.html',
  
    '/https://n3sh47.github.io/categories/',
  
    '/https://n3sh47.github.io/tags/',
  
    '/https://n3sh47.github.io/archives/',
  
    '/https://n3sh47.github.io/about/',
  

  /* --- Favicons & compressed JS --- */
  
  
    '/https://n3sh47.github.io/assets/img/favicons/android-chrome-192x192.png',
    '/https://n3sh47.github.io/assets/img/favicons/android-chrome-512x512.png',
    '/https://n3sh47.github.io/assets/img/favicons/apple-touch-icon.png',
    '/https://n3sh47.github.io/assets/img/favicons/favicon-16x16.png',
    '/https://n3sh47.github.io/assets/img/favicons/favicon-32x32.png',
    '/https://n3sh47.github.io/assets/img/favicons/favicon.ico',
    '/https://n3sh47.github.io/assets/img/favicons/mstile-150x150.png',
    '/https://n3sh47.github.io/assets/img/favicons/safari-pinned-tab.svg',
    '/https://n3sh47.github.io/assets/js/dist/categories.min.js',
    '/https://n3sh47.github.io/assets/js/dist/commons.min.js',
    '/https://n3sh47.github.io/assets/js/dist/home.min.js',
    '/https://n3sh47.github.io/assets/js/dist/misc.min.js',
    '/https://n3sh47.github.io/assets/js/dist/page.min.js',
    '/https://n3sh47.github.io/assets/js/dist/post.min.js',
    '/https://n3sh47.github.io/assets/js/dist/pvreport.min.js'

];

/* The request url with below domain will be cached */
const allowedDomains = [
  
    'www.googletagmanager.com',
    'www.google-analytics.com',
  

  'localhost:4000',

  

  'fonts.gstatic.com',
  'fonts.googleapis.com',
  'cdn.jsdelivr.net',
  'polyfill.io'
];

/* Requests that include the following path will be banned */
const denyUrls = [
  
];

