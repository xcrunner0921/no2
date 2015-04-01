
function wheelReport(ammout) {
    //wheel.innerHTML = 'wheel ammout: ' + ammout;
	console.log(amount);
}

function wheelCallback(event) {
    var normalized;
    if (event.wheelDelta) {
        normalized = (event.wheelDelta % 120 - 0) == -0 ? event.wheelDelta / 120 : event.wheelDelta / 12;
    } else {
        var rawAmmount = event.deltaY ? event.deltaY : event.detail;
        normalized = -(rawAmmount % 3 ? rawAmmount * 10 : rawAmmount / 3);
    }
    //wheelReport(normalized);
    
    if (Math.abs(normalized) > 0)
    	scrollOn = true;
}

var event = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
window.addEventListener(event, wheelCallback);

var scrollOn = false;