'use client';
import { useEffect, useRef } from 'react';

/**
 * Shared behaviour for every overlay in the storefront (auth, profile, cart
 * drawer, virtual try-on, mobile nav, chat, image preview).
 *
 * Before this existed each overlay was a bare <div>: no dialog role, focus left
 * behind on <body>, Escape did nothing, and Tab walked straight out of the
 * panel into the page underneath while the panel stayed open on top of it.
 *
 * Gives each panel:
 *   - focus moved inside on open (the panel itself unless something is marked
 *     [data-autofocus]), and returned to whatever opened it on close
 *   - Escape to dismiss
 *   - Tab / Shift+Tab cycled within the panel
 *   - everything outside the panel marked `inert` + aria-hidden, so assistive
 *     tech cannot browse the obscured page
 *
 * Pair with `dialogProps` for the ARIA wiring:
 *   const { panelRef, dialogProps } = useDialog({ isOpen, onClose, labelledBy: 'x' });
 *   <div className="auth-card" ref={panelRef} {...dialogProps}>
 *
 * Pass `modal: false` for a panel that deliberately sits alongside the page
 * rather than over it — the chat pill, which a shopper should be able to leave
 * open while carrying on browsing. Those still get a name, Escape and focus
 * restoration, but no focus trap and no inert background.
 */
export function useDialog({ isOpen, onClose, labelledBy, label, modal = true }) {
  const panelRef = useRef(null);
  const openerRef = useRef(null);
  const onCloseRef = useRef(onClose);

  // Keep the latest onClose without re-running the whole effect each render
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!isOpen || !panel) return;

    // Remember who opened us so focus can go home afterwards
    openerRef.current = document.activeElement;

    const FOCUSABLE = [
      'a[href]', 'button:not([disabled])', 'input:not([disabled])',
      'select:not([disabled])', 'textarea:not([disabled])', 'summary',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');
    const focusables = () => [...panel.querySelectorAll(FOCUSABLE)]
      .filter(el => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement);

    // Move focus in. Prefer an explicit [data-autofocus], else the panel itself
    // — landing on the panel lets a screen reader read the dialog's name first,
    // rather than dropping the user mid-form.
    const preferred = panel.querySelector('[data-autofocus]');
    if (preferred) {
      preferred.focus();
    } else {
      panel.setAttribute('tabindex', '-1');
      panel.focus();
    }

    // Hide everything outside the panel from pointer, keyboard and AT.
    // Walks up to <body>, marking each ancestor's other children inert.
    const marked = [];
    if (modal) {
      let node = panel;
      while (node && node !== document.body && node.parentElement) {
        for (const sibling of node.parentElement.children) {
          if (sibling === node) continue;
          if (sibling.hasAttribute('inert')) continue; // already hidden by an outer dialog
          sibling.setAttribute('inert', '');
          sibling.setAttribute('aria-hidden', 'true');
          marked.push(sibling);
        }
        node = node.parentElement;
      }
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onCloseRef.current?.();
        return;
      }
      if (!modal || event.key !== 'Tab') return;

      const items = focusables();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      // Cycle at the ends, and pull focus back in if it somehow sits outside
      if (event.shiftKey && (active === first || active === panel || !panel.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !panel.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      for (const el of marked) {
        el.removeAttribute('inert');
        el.removeAttribute('aria-hidden');
      }
      // Return focus to the trigger, if it is still in the document
      const opener = openerRef.current;
      if (opener && document.contains(opener) && typeof opener.focus === 'function') {
        opener.focus();
      }
    };
  }, [isOpen, modal]);

  const dialogProps = {
    role: 'dialog',
    ...(modal ? { 'aria-modal': 'true' } : {}),
    ...(labelledBy ? { 'aria-labelledby': labelledBy } : {}),
    ...(label ? { 'aria-label': label } : {}),
  };

  return { panelRef, dialogProps };
}
