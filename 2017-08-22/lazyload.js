!function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory;
    } else {
        console.log(root)
        root.lazyLoad = factory;
    }
}(this, function() {
    checkImgs();
    function isInSight(el) {
        var bound = el.getBoundingClientRect();
        var clientH = window.innerHeight;

        return bound.top <= clientH + 50;
    }

    function checkImgs() {
        var imgs = document.querySelectorAll('img');
        var tempArr = [];
        tempArr = Array.from ? Array.from(imgs) : Array.prototype.slice.call(imgs);
        tempArr.forEach(function(val, index) {
            if (val.dataset.load) return false;
            isInSight(val) ? loadImg(val) : '';
        })
    }

    function loadImg(el) {
        var load = el.dataset.load ? el.dataset.load : el.getAttribute('data-load')
        if (!load) {
            el.src = el.dataset.src;
            el.setAttribute('data-load',1);
        }
    }

    function throttle(func, wait, options) {
        var timeout, context, args, result;
        var previous = 0;
        if (!options) options = {};

        var later = function() {
            previous = options.leading === false ? 0 : new Date().getTime();
            timeout = null;
            func.apply(context, args);
            if (!timeout) context = args = null;
        };

        var throttled = function() {
            var now = new Date().getTime();
            if (!previous && options.leading === false) previous = now;
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                previous = now;
                func.apply(context, args);
                if (!timeout) context = args = null;
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
        };

        throttled.cancel = function() {
            clearTimeout(timeout);
            previous = 0;
            timeout = null;
        };

        return throttled;
    }
    window.onscroll = throttle(checkImgs,500,{});
})
