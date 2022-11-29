const tutor = document.getElementById('starter-btn')


tutor.addEventListener('click', () => {
    introJs().setOptions({
        tooltipClass: 'customTooltip'
    }).start()
})

