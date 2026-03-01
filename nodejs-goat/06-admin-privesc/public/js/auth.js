/*!
 * Corporate Internal Dashboard - Auth Helper v2.3.1
 */

(function (window) {
  'use strict';

  // ─── Cookie Helpers ───────────────────────────────────────────────────────
  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  function setCookie(name, value, days) {
    var expires = '';
    if (days) {
      var d = new Date();
      d.setTime(d.getTime() + days * 864e5);
      expires = '; expires=' + d.toUTCString();
    }
    document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/; SameSite=Lax';
  }

  function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }

  // ─── Session State ────────────────────────────────────────────────────────
  function isAuthenticated() {
    return !!getCookie('session');
  }

  function getSessionToken() {
    return getCookie('session') || null;
  }

  function clearSession() {
    deleteCookie('session');
    deleteCookie('csrf_token');
    if (window.Common && window.Common.Store) {
      window.Common.Store.clear();
    }
  }

  // ─── Logout ───────────────────────────────────────────────────────────────
  function logout() {
    clearSession();
    window.location.href = '/login';
  }

  // ─── CSRF Token ───────────────────────────────────────────────────────────
  function getCsrfToken() {
    var meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? meta.getAttribute('content') : getCookie('csrf_token');
  }

  function injectCsrfHeader(headers) {
    var token = getCsrfToken();
    if (token) headers['X-CSRF-Token'] = token;
    return headers;
  }

  // ─── Auth Guard ───────────────────────────────────────────────────────────
  function requireAuth(redirectTo) {
    if (!isAuthenticated()) {
      window.location.href = redirectTo || '/login';
      return false;
    }
    return true;
  }

  // ─── Idle Timeout ─────────────────────────────────────────────────────────
  var _idleTimer = null;
  var IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

  function resetIdleTimer() {
    clearTimeout(_idleTimer);
    _idleTimer = setTimeout(function () {
      if (isAuthenticated()) {
        clearSession();
        window.location.href = '/login?reason=idle';
      }
    }, IDLE_TIMEOUT_MS);
  }

  function startIdleWatch() {
    ['mousemove', 'keydown', 'click', 'scroll'].forEach(function (evt) {
      document.addEventListener(evt, resetIdleTimer, { passive: true });
    });
    resetIdleTimer();
  }

  function stopIdleWatch() {
    clearTimeout(_idleTimer);
    ['mousemove', 'keydown', 'click', 'scroll'].forEach(function (evt) {
      document.removeEventListener(evt, resetIdleTimer);
    });
  }

  // ─── Expose ───────────────────────────────────────────────────────────────
  window.Auth = {
    isAuthenticated: isAuthenticated,
    getSessionToken: getSessionToken,
    getCsrfToken: getCsrfToken,
    injectCsrfHeader: injectCsrfHeader,
    requireAuth: requireAuth,
    logout: logout,
    clearSession: clearSession,
    startIdleWatch: startIdleWatch,
    stopIdleWatch: stopIdleWatch,
    getCookie: getCookie,
    setCookie: setCookie,
    deleteCookie: deleteCookie
  };

}(window));
