/*
 Résumé client.

 One job: open the intro card as a real modal.

 Everything the card needs to behave like a modal — trapping Tab inside it,
 closing on Escape, and marking the résumé pages behind it inert — comes from
 showModal(). None of the three is reachable from CSS, which is why this is the
 only script on the page.

 If it never runs, the <dialog> stays closed (a dialog without `open` is
 display:none) and the résumé is simply visible. That is the right failure mode
 for a splash screen: the content is never gated behind a script.
*/
(() => {
    const card = document.querySelector<HTMLDialogElement>('dialog.intro-card');

    // Guard the method, not just the element: a browser old enough to parse
    // <dialog> as an unknown element has no showModal, and calling it would
    // throw and leave the page with a dead overlay.
    if (!card || typeof card.showModal !== 'function') return;

    card.showModal();

    card.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;

        // Both actions dismiss. The click is never cancelled, so "Download"
        // still hands the href to the browser on its way out.
        if (target.closest('[data-intro-close]')) {
            card.close();
            return;
        }

        // A click on the backdrop is dispatched at the dialog itself — but so
        // is a click on the dialog's own padding, since ::backdrop is its
        // pseudo-element. Testing the target alone would therefore dismiss
        // when someone clicks the card's edge, so compare against the box.
        //
        // Keyboard activation is unaffected: Enter on a button reports
        // clientX/clientY of 0, which would read as "outside", but its target
        // is the button so it returns above before the geometry is consulted.
        if (target !== card) return;
        const box = card.getBoundingClientRect();
        const onCard =
            event.clientX >= box.left &&
            event.clientX <= box.right &&
            event.clientY >= box.top &&
            event.clientY <= box.bottom;
        if (!onCard) card.close();
    });
})();
