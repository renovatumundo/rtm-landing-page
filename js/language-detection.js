const userLang = navigator.language || navigator.userLanguage;
const currentPath = window.location.pathname;

if (!window.localStorage.getItem('lang')) {
  if (userLang.startsWith('ru')) {
    window.location.href = '/ru';
  } else if (userLang.startsWith('es')) {
    window.location.href = '/es';
  } else if (userLang.startsWith('uk')) {
    window.location.href = '/ua';
  }

  window.localStorage.setItem('lang', userLang);
}