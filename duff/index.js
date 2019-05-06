var getContext = function (width, height) {
    var canvas = document.createElement('canvas');
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    return canvas.getContext('2d');
};
var getImageData = function (src, scale) {
    if (scale === void 0) scale = 1;

    var img = new Image();
    if (!src.startsWith('data')) {
        img.crossOrigin = 'Anonymous';
    }
    return new Promise(function (resolve, reject) {
        img.onload = function () {
            var width = img.width * scale;
            var height = img.height * scale;
            var context = getContext(width, height);
            context.drawImage(img, 0, 0, width, height);
            var ref = context.getImageData(0, 0, width, height);
            var data = ref.data;
            resolve(data);
        };

        var errorHandler = function () {
            return reject(new Error('An error occurred attempting to load image'));
        };

        img.onerror = errorHandler;
        img.onabort = errorHandler;
        img.src = src;
    });
};
var getCounts = function (data, ignore) {
    var countMap = {};
    /* var iterations = Math.ceil(data.length / 32);
	var startAt = (data.length / 4) % 8;
	var i = 0; 
	do {
	    switch(startAt) {
	        case 0 : process(i++);
	        case 7 : process(i++);
	        case 6 : process(i++);
	        case 5 : process(i++);
	        case 4 : process(i++);
	        case 3 : process(i++);
	        case 2 : process(i++);
	        case 1 : process(i++);
	    }
	    startAt = 0;
    }while(--iterations > 0); */
    

    var iterations = Math.ceil(data.length / 32);
    var leftover = (data.length / 4) % 8;
    var i = 0; 
    if(leftover > 0) {
        do {
            process(i++);
        }while(--leftover > 0);
    }	 
    do {
        process(i++);
        process(i++);
        process(i++);
        process(i++);
        process(i++);
        process(i++);
        process(i++);
        process(i++);
    }while(--iterations > 0);
    

    // for (var i = 0; i < data.length / 4; i ++) {
    //     process(i);
    // }

    function process(i) {
        var alpha = data[4*i + 3];
        if (alpha === 0) {
            return;
        }
        var rgbComponents = Array.from(data.subarray(4*i, 4*i + 3));
        if (rgbComponents.indexOf(undefined) !== -1) {
            return;
        }
        var color = alpha && alpha !== 255 ? ("rgba(" + (rgbComponents.concat([alpha]).join(',')) + ")") : ("rgb(" + (rgbComponents.join(',')) + ")");
        if (ignore.indexOf(color) !== -1) {
            return;
        }

        if (countMap[color]) {
            countMap[color].count++;
        } else {
            countMap[color] = {
                color: color,
                count: 1
            };
        }
    }


    var counts = Object.values(countMap);
    return counts.sort(function (a, b) {
        return b.count - a.count;
    });
};

var defaultOpts = {
    ignore: [],
    scale: 1
};
var index = (function (src, opts) {
    if (opts === void 0) opts = defaultOpts;

    try {
        opts = Object.assign({}, defaultOpts,
            opts);
        var ignore = opts.ignore;
        var scale = opts.scale;

        if (scale > 1 || scale <= 0) {
            console.warn(("You set scale to " + scale + ", which isn't between 0-1. This is either pointless (> 1) or a no-op (≤ 0)"));
        }

        return Promise.resolve(getImageData(src, scale)).then(function (data) {
            return getCounts(data, ignore);
        });
    } catch (e) {
        return Promise.reject(e);
    }
});
console.time()
var data = index('https://b-gold-cdn.xitu.io/v3/static/img/frontend.1dae74a.png')
data.then(res => {
    console.log(res)
    console.timeEnd()
});