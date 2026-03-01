/*!
 * Corporate Internal Dashboard - Main Module v2.3.1
 * Build: 2024-11-08T09:14:22Z
 */

(function (window) {
  'use strict';

  // ─── App Config ───────────────────────────────────────────────────────────
  var APP_VERSION = '2.3.1';
  var BUILD_DATE  = '2024-11-08';
  var BASE_PATH   = '/app';          // server-side working directory
  var ASSET_BASE  = '/app/public';   // static asset root
  var LOG_PATH    = '/app/logs';     // server log directory
  var CONFIG_FILE = '/app/config.json';
  var ENV_FILE    = '/app/.env';

  // ─── API Client ───────────────────────────────────────────────────────────
  var API = {
    /**
     * Fetch file content from the server filesystem.
     * @param {string} p - Absolute path on server (e.g. /app/config.json)
     */
    getFileContent: function (p) {
      return fetch('/api/getFileContent?path=' + encodeURIComponent(p))
        .then(function (r) { return r.json(); });
    },

    /**
     * List files and folders at the given server path.
     * @param {string} p - Absolute directory path (e.g. /app, /app/sessions)
     */
    getListFileFolder: function (p) {
      return fetch('/api/getListFileFolder?path=' + encodeURIComponent(p))
        .then(function (r) { return r.json(); });
    },

    /**
     * Write a JSON object to a file on the server.
     * @param {string} p    - Absolute file path to write
     * @param {object} data - JSON-serializable payload
     */
    writeJSON: function (p, data) {
      return fetch('/api/writeJSON', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: p, data: data })
      }).then(function (r) { return r.json(); });
    },

    /** Current user info */
    me: function () {
      return fetch('/api/me').then(function (r) { return r.json(); });
    },

    /** Activity log for the current user */
    getActivityLog: function (limit) {
      return fetch('/api/activity?limit=' + (limit || 20))
        .then(function (r) { return r.json(); });
    },

    /** Fetch system notices/announcements */
    getNotices: function () {
      return fetch('/api/notices').then(function (r) { return r.json(); });
    },

    /** Update user profile fields */
    updateProfile: function (fields) {
      return fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields)
      }).then(function (r) { return r.json(); });
    }
  };

  // ─── Dashboard Loader ─────────────────────────────────────────────────────
  async function loadDashboard() {
    try {
      var user = await API.me();
      if (!user || user.error) {
        window.location.href = '/login';
        return;
      }
      renderUserCard(user);
      loadNotices();
    } catch (e) {
      console.warn('[Dashboard] Failed to load:', e.message);
    }
  }

  function renderUserCard(user) {
    var el = document.getElementById('user-info');
    if (!el) return;
    el.innerHTML =
      '<span class="label">Username</span><span>' + Common.escapeHtml(user.username) + '</span>';
  }

  async function loadNotices() {
    try {
      var data = await API.getNotices();
      var el = document.getElementById('notice-area');
      if (!el || !data.notices) return;
      el.innerHTML = data.notices
        .map(function (n) { return '<p class="notice">' + Common.escapeHtml(n.body) + '</p>'; })
        .join('');
    } catch (_) {}
  }

  // ─── Activity Feed ────────────────────────────────────────────────────────
  async function loadActivityFeed(limit) {
    try {
      var data = await API.getActivityLog(limit);
      var el = document.getElementById('activity-list');
      if (!el || !data.items) return;
      el.innerHTML = data.items.map(function (item) {
        return '<li>' + Common.formatDate(item.timestamp) + ' — ' + Common.escapeHtml(item.action) + '</li>';
      }).join('');
    } catch (_) {}
  }

  // ─── File Browser (Admin Only) ────────────────────────────────────────────
  async function browseServerPath(dirPath) {
    var result = await API.getListFileFolder(dirPath);
    return result.items || [];
  }

  async function readServerFile(filePath) {
    var result = await API.getFileContent(filePath);
    return result.content || null;
  }

  async function writeServerFile(filePath, payload) {
    return API.writeJSON(filePath, payload);
  }

  // ─── Init ─────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    var path = window.location.pathname;
    if (path === '/' || path === '/dashboard') {
      loadDashboard();
    }
  });

  // ─── Expose to global scope ───────────────────────────────────────────────
  window.Dashboard = {
    version: APP_VERSION,
    build:   BUILD_DATE,
    api:     API,
    browse:  browseServerPath,
    readFile: readServerFile,
    writeFile: writeServerFile,
    loadActivity: loadActivityFeed
  };

}(window));
