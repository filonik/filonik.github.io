function identity(x) {
    return x;
}

function compose() {
    var args = arguments;
    return function (result) {
        for (let arg of args) {
            result = arg.call(this, result);
        }
        return result;
    };
}

function minmax(x, y) {
    return [Math.min(x[0], y[0]), Math.max(x[1], y[1])];
}

function* range() {
    var start = 0, end = 0, step = 1;
    switch(arguments.length) {
        case 1:
            end = arguments[0];
            break;
        case 2:
            start = arguments[0]; end = arguments[1];
            break;
        case 3:
            start = arguments[0]; end = arguments[1]; stop = arguments[2];
            break;
    }
    for(let i = start; i < end; i += step) {
        yield i;
    }
}

function normal(mu, sigma, nsamples){
    if(!nsamples) nsamples = 6
    if(!sigma) sigma = 1
    if(!mu) mu=0

    var run_total = 0
    for(var i=0 ; i<nsamples ; i++){
       run_total += Math.random()
    }

    return sigma*(run_total - nsamples/2)/(nsamples/2) + mu
}

function* randomNormal(mu, sigma, n) {
    for(let i = 0; i < n; i++) {
        yield normal(mu, sigma);
    }
}

function* randomUniform(lower, upper, n) {
    let delta = upper - lower;
    for(let i = 0; i < n; i++) {
        yield lower + Math.random() * delta;
    }
}

function* indices(items) {
    yield* range(items.length);
}

function* linspace(start, end, n) {
    let delta = (end - start) / (n - 1);
    for(let i = 0; i < n; i++) {
       yield start + (i * delta);
    }
}

function itemgetter(i) {
    return function(obj) {
        return obj[i];
    }
}

function itemsetter(i) {
    return function(obj, value) {
        obj[i] = value;
    }
}

function item(i){
    let result = itemgetter(i);
    result.get = itemgetter(i);
    result.set = itemsetter(i);
    return result;
}

function debounce(func, interval) {
    let timeout = undefined;
    return function() {
        let context = this;
        let args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function(){
            func.apply(context, args);
        }, interval);
    }
}

/*
for (let value of linspace(-1.0, +1.0, 10)) {
    console.log(value);
}
*/