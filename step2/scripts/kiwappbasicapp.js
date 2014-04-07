window.APP_DEBUG = true;/**
 * Select the main#wrapper in the dom. It's the main container of the
 * application. Then we assign to this wrapper the viewport.
 */
var wrap = document.getElementById('wrapper'),
    $wrap = $(wrap);

/**
 * The main timeout value.
 * It will be used for the default return to home delay
 * @type {Number}
 */
var TIMEOUT_BEFORE_HOME = 50;

(function() {
    "use strict";
    /**
     * Store all the timeout for the application
     * @type {Array}
     */
    window.appTimesout = [];

    /**
     * Path to the file kiwapp_config.js
     * The default value is the path from kiwapp Retails app
     * @type {String}
     */
    var kiwappConfigUrl = "../config/kiwapp_config.js";


    // If debug mode is active, allow the load inside a browser
    if(window.APP_DEBUG) {
        kiwappConfigUrl = "assets/kiwapp_config.js";
        TIMEOUT_BEFORE_HOME = 5000;

    }

    /**
     * Detect if you are on an iPad or an Android device.
     * Default value is the browser so we add a className to the body
     *     - iPad : className = ipad
     *     - android : className = android
     *     - default : className = web-browser
     */
    var detectDevice = function detectDevice() {

        var className = (navigator.userAgent.indexOf('iPad') > -1) ? 'ipad' : 'android';
        if((navigator.userAgent.indexOf('Android') === -1) && (navigator.userAgent.indexOf('iPad') === -1)) {
            className = 'web-browser';
        }

        // We use the classList API from HTML5
        document.body.classList.add(className);
    }();

    /**
     * To prevent Memory leak we must reset each timeout after they are triggered
     * It also prevent from bugs
     */
    var resetTimeout = function() {
        if(window.appTimesout.length) {
            console.log('[App@Kiwapp] Reset timeout for ' + TIMEOUT_BEFORE_HOME + 's');
            window.appTimesout.forEach(function(item) {
                clearTimeout(item);
            });
        }
    };

    /**
     * Hook fired after a page open.
     * It will create and save an interaction for each page opened.
     * It will trigger a page open for the home page, so if you are 4 pages
     * and someone leave the app after the page 3 we return to home after a timeout
     * the one you can configure in {TIMEOUT_BEFORE_HOME}.
     *
     * It will close the user session, then your next user will have it's own session.
     * @param  {String} page The page name
     */
    var afterOpen = function(page) {

        if('home' !== page) {
            console.log('[App@PageOpen] '+ page);
            Kiwapp.stats().page(page);
            resetTimeout();

            openPageAfterDelay('home',TIMEOUT_BEFORE_HOME, function() {
                Kiwapp.stats().page('home');
                Kiwapp.session().end();
                console.log('[App@Kiwapp] close session');
            });
        }
    };

    /**
     * Hook fired before a page open
     * It creates a new session for a user
     * @param  {String} page The page name
     */
    var beforeOpen = function(page) {
        if('home' === page) {
            Kiwapp.session().start();
        }
    };

    /**
     * Your public helper to open a page from another.
     * you just have to call:
     *      openPage('my-page');
     * You can also pass a callback as the second argument
     * @param  {String}   page Your page name
     * @param  {Function} cb   custom callback
     */
    window.openPage = function(page, cb) {
        cb = cb || function(){
            // Auto detect an openPage after a timeout on the new page you open
            // so it will fire the {openPageAfterDelay} for you
            var $div = $wrap.find('div').get(0);
            if($div && $div.hasAttribute('data-timeout')) {

                var timeout = $div.getAttribute('data-timeout'),
                    page    = $div.getAttribute('data-page');
                openPageAfterDelay(page,timeout);
            }
        };

        beforeOpen(page);
        $wrap.load('views/'+page +'.html', cb);
        afterOpen(page);
    };

    /**
     * Your public helper to open a page from another with a delay.
     * you just have to call to open your page after 5s of delay:
     *      openPageAfterDelay('my-page',5000);
     * You can also pass a callback as the second argument
     * @param  {String}   page Your page name
     * @param  {Integer}  delay Timeout before the openPage is fired
     * @param  {Function} cb   custom callback
     */
    window.openPageAfterDelay = function(page, delay, cb) {
        window.appTimesout.push(setTimeout(function() {
            openPage(page,cb);
        },delay * 1000));
    };

    /**
     * Load the parse configuration
     * @return {void}
     */
    window.initParse = function() {
        $.getJSON('parse.json', function(json) {
            window.PARSE_APP_KEY  = json.api_key;
            window.PARSE_APP_ID   = json.api_id;
            window.PARSE_APP_NAME = json.api_name;
        });
    };

    /**
     * Main helper to auto open a page when you click on a button or anything else
     * with the classe open-page and this attribute :
     *     - data-page = the page to open
     */
    $wrap.on(eventName,'.open-page',function() {
        var dest = this.getAttribute('data-page');
        openPage(dest);
    });

    /**
     * Load the application from the kiwapp configuration
     * Your body must have a data-page attribute
     */
    Kiwapp(kiwappConfigUrl, function(){
        // Trigger an event to the webview to launch the application

        Kiwapp.ready();
        // // Allow only landscape mode
        Kiwapp.driver().trigger('callApp', {
            call: 'ipadPath',
            data: {
                "orientation" : 10
            }
        });

        openPage(document.body.getAttribute('data-page'));
    });
})();