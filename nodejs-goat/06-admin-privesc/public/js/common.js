/*!
 * Corporate Internal Dashboard - Common Utilities v2.3.1
 */

(function (window) {
  'use strict';

  // ─── String Helpers ───────────────────────────────────────────────────────
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function truncate(str, maxLen) {
    if (!str) return '';
    return str.length > maxLen ? str.slice(0, maxLen) + '…' : str;
  }

  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  function slugify(str) {
    return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  }

  // ─── Date Helpers ─────────────────────────────────────────────────────────
  function formatDate(iso) {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
      });
    } catch (e) { return iso; }
  }

  function timeAgo(iso) {
    var diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60)   return 'just now';
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    return Math.floor(diff / 86400) + 'd ago';
  }

  function isoNow() {
    return new Date().toISOString();
  }

  // ─── DOM Helpers ──────────────────────────────────────────────────────────
  function showMessage(el, msg, type) {
    if (!el) return;
    el.className = 'alert alert-' + (type || 'info');
    el.textContent = msg;
    el.style.display = 'block';
  }

  function hideMessage(el) {
    if (!el) return;
    el.style.display = 'none';
    el.textContent = '';
  }

  function setLoading(el, state) {
    if (!el) return;
    el.disabled = state;
    el.dataset.originalText = el.dataset.originalText || el.textContent;
    el.textContent = state ? 'Loading…' : el.dataset.originalText;
  }

  function $(selector, ctx) {
    return (ctx || document).querySelector(selector);
  }

  function $$(selector, ctx) {
    return Array.from((ctx || document).querySelectorAll(selector));
  }

  // ─── Object / Data Helpers ────────────────────────────────────────────────
  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function pick(obj, keys) {
    return keys.reduce(function (acc, k) {
      if (k in obj) acc[k] = obj[k];
      return acc;
    }, {});
  }

  function omit(obj, keys) {
    return Object.keys(obj).reduce(function (acc, k) {
      if (keys.indexOf(k) === -1) acc[k] = obj[k];
      return acc;
    }, {});
  }

  function isEmpty(val) {
    if (val === null || val === undefined) return true;
    if (typeof val === 'string') return val.trim().length === 0;
    if (Array.isArray(val)) return val.length === 0;
    if (typeof val === 'object') return Object.keys(val).length === 0;
    return false;
  }

  // ─── Storage Helpers ──────────────────────────────────────────────────────
  var Store = {
    get: function (key) {
      try { return JSON.parse(sessionStorage.getItem('__app_' + key)); } catch (e) { return null; }
    },
    set: function (key, val) {
      try { sessionStorage.setItem('__app_' + key, JSON.stringify(val)); } catch (e) {}
    },
    remove: function (key) {
      try { sessionStorage.removeItem('__app_' + key); } catch (e) {}
    },
    clear: function () {
      try { sessionStorage.clear(); } catch (e) {}
    }
  };

  // ─── Event Bus ────────────────────────────────────────────────────────────
  var _handlers = {};
  var EventBus = {
    on: function (event, fn) {
      (_handlers[event] = _handlers[event] || []).push(fn);
    },
    off: function (event, fn) {
      if (!_handlers[event]) return;
      _handlers[event] = _handlers[event].filter(function (h) { return h !== fn; });
    },
    emit: function (event, data) {
      (_handlers[event] || []).forEach(function (fn) {
        try { fn(data); } catch (e) { console.warn('[EventBus]', e); }
      });
    }
  };

  // ─── Expose ───────────────────────────────────────────────────────────────
  window.Common = {
    escapeHtml: escapeHtml,
    truncate: truncate,
    capitalize: capitalize,
    slugify: slugify,
    formatDate: formatDate,
    timeAgo: timeAgo,
    isoNow: isoNow,
    showMessage: showMessage,
    hideMessage: hideMessage,
    setLoading: setLoading,
    $: $,
    $$: $$,
    deepClone: deepClone,
    pick: pick,
    omit: omit,
    isEmpty: isEmpty,
    Store: Store,
    EventBus: EventBus
  };

}(window));
