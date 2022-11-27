const tour = new Sheperd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
        classes: 'shadow-mg bg-purple-dark sheperd-theme-arrows',
        scrollTo: true
    }
});

tour.addStep({
    id: 'first-step',
    text: 'This step is attached to the bottom of the <code>.example-css-selector</code> element.',
    attachTo: {
        element: '.canvas',
        on: 'bottom'
    },
    buttons: [
        {
            text: 'Next',
            action:  tour.next
        }
    ]
})

tour.start();