// Timing marker script
// Creates a hidden element that only exists for 2 seconds on FRESH loads
// When served from SW cache, this script runs but the timing is off,
// or the cached HTML doesn't have the element yet

(function() {
    // Create the marker element
    var marker = document.createElement('div');
    marker.id = '__poc_marker__';
    marker.style.display = 'none';
    document.body.appendChild(marker);

    console.log('[MARKER] Created timing marker element');

    // Remove it after 2 seconds
    setTimeout(function() {
        if (marker.parentNode) {
            marker.parentNode.removeChild(marker);
            console.log('[MARKER] Removed timing marker element');
        }
    }, 2000);
})();
