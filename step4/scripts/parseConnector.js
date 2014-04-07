;(function() {
    "use strict";

    /**
     * Connect service to Parse
     * It sends your form to parse
     * @param {String} apiKey Your API key
     * @param {String} appId  Your application ID
     */
    function ParseConnector(apiKey, appId) {
        this.APP_KEY  = apiKey || '';
        this.APP_ID   = appId || '';
        this.APP_NAME = '';
    }

    /**
     * Set the name for your app. It's the class from Parse.
     * @param  {String} appName Class from Parse
     * @return {ParseConnector}
     */
    ParseConnector.prototype.app = function app(appName) {

        if(!appName || !appName.length) {
            throw new Error('You must set a name for the form submission');
        }

        // parse doesn't accept -
        this.APP_NAME = appName.replace("-","_");
        return this;
    };

    /**
     * Check the validity for your credentials
     * @throws {Error} If it's invalid
     * @return {void}
     */
    ParseConnector.prototype.checkCredentials = function checkCredentials() {

        if(!this.APP_KEY.length) {
            throw new Error('You must set your Parse API key\'s');
        }

        if(!this.APP_ID.length) {
            throw new Error('You must set your Parse Application ID\'s');
        }
    };

    /**
     * Send to parse
     * @param  {Object} json
     * @return {void}
     */
    ParseConnector.prototype.send = function send(json) {

        this.checkCredentials();

        var customHeaders = {
            "X-Parse-REST-API-Key"   : this.APP_KEY,
            "X-Parse-Application-Id" : this.APP_ID,
            "Content-Type"           : "application/json"
        },
            urlPost = "https://api.parse.com/1/classes/"+this.APP_NAME+"/";

        $.ajax({
            headers: customHeaders,

            url    : urlPost ,
            method : "POST",
            data   : JSON.stringify(json),

            error : function error(request,statusText,err) {
                Kiwapp.log('[ParseConnector@send] : ' + err +" "+ statusText);

                Kiwapp.session().store(json,{
                    url     : urlPost,
                    headers : customHeaders,
                    method  : "POST"
                }).send();
            },

            success : function success(){
                Kiwapp.log('[ParseConnector@send] : Send success');
            }
        });

    };

    window.ParseConnector = ParseConnector;

})();