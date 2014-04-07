# Application Form with scratchard - Chez Barney's

This app provides a simple form asking for a few personnal pieces of information and a sratchcard game. The number of winning cases and the winning probabilities can be customized.

## File organisation

- `./index.html` : The index file, it loads the application and dependencies
- `./manifest.json` : Kiwapp application manifest
- `./views/` : Folder of each pages (*partial views*)
- `./styles/` :
    - `main.css` : Your css
    - `normalize.css` : Normalize dependency
- `./scripts/` :
    - `kiwappbasicapp.js` : Our micro framework [see the documentation](KiwappBasicAppReadme.md)
    - `vendor.min.js` : Your JavaScript dependencies
- `./assets/` : Folder of assets as images,fonts...
    - `images/` : images
    - `fonts/` : fonts
    - `kiwapp_config.js/` : App configuration usefull for debug mode

## Dependencies

This application is build on top of :

- jQuery 2.0.3
- Normalize CSS 2.1.3
- Kiwapp ScratchCard Plugin
- Kiwapp Library
- Kiwapp basic app "Framework"

## Create a manifest and kiwapp_config.js

- [How to create a kiwapp manifest](#)
- [How to create a kiwapp_config](#)

## About the application

This application is built on top of **Kiwapp basic app framework**, so it's working through Ajax.

Your main application file is `index.html` :

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Chez Barney's Burger</title>
    <!-- Define the viewport and heigh=1 prevent bugs on iOS 7 -->
    <meta name="viewport" content="width=device-width, height=1">
    <link rel="stylesheet" href="styles/normalize.css">
    <link rel="stylesheet" href="styles/main.css">
    <script>
        // Define if you are on desktop or mobile
        var isTouch = !!('ontouchstart' in window);

        // Emulate the click for mobile
        var eventName = (isTouch) ? 'touchstart' : 'click';
    </script>
</head>
<!-- ontouchstart="" prevent the 300ms bug -->
<!-- data-page="home" define the first page to render on load -->
<body ontouchstart="" data-page="home">
<main id="wrapper"></main>
<!-- Include jQuery 2.0.3 and Kiwapp main library -->
<script src="js/vendor.min.js"></script>
<!-- Include the basic application "framework" -->
<script src="js/kiwappbasicapp.js"></script>
</body>
</html>
```

As you can see we have a tag : `<main id="wrapper"></main>`, it's the application container.

It means we will load each view inside of it thanks to jQuery Ajax method [$.load()](http://api.jquery.com/load/). Your views in the folder *views* will be loaded inside.

***You must keep the #wrapper as your main id***

> Your views must have a div as the first tag, only if you want to add a delay before openning a new page, when this page will be display

### A view

```html
<div class="page-demo">
    <h2>Page title</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex, tempora, sequi quaerat soluta ab recusandae dolore laudantium cupiditate culpa asperiores nulla maiores delectus quos officia porro natus sunt autem impedit.</p>
</div>
```
No `<body>` inside, this is only one div with your page's content. It's as simple as that.

And of course you can also add a `<script>` tag inside to execute a custom JavaScript on a view. It will be executed only for this view, as soon as you open the page.

> You can see a form validation inside `./view/formulaire.html` to see a case of use for a script tag.

## Customize the timeout

The application fires a timeout on each pages, it will automatically redirect you to the home page. It will close the current user's session and start a new one.

In the `./index.html` you have inside a script tag a var :

```JavaScript
TIMEOUT_BEFORE_HOME = 50;
```

It's the default value of the timeout. So after 50s of inactivity on a page you will be redirect to the home page.

> This var must be in a script tag after the load of Kiwapp basic framework, because it's defined inside of it.

## Customize images

You just have to replace each images of your choice inside `./assets/images/`.

If you do not have the same name as ours, do not forget to update the `main.css`.

## Customize winning probabilities

You have to open `./views/game.html`, inside of the file you have a script tag where you can read this :

```json
"picture" : [
  {
      "path" : "assets/images",
      "file": "scratch-freemeal.jpg",
      "luck" : 25,
      "event" : 'win',
      "details" : "freemeal"
  },{
      "path" : "assets/images",
      "file": "scratch-burger.jpg",
      "luck" : 25,
      "event" : 'win',
      "details" : "burger"
  },{
      "path" : "assets/images",
      "file": "scratch-dessert.jpg",
      "luck" : 25,
      "event" : 'win',
      "details" : "dessert"
  },
  {
      "path" : "assets/images",
      "file": "scratch-lost.jpg",
      "luck" : 25,
      "event" : 'lost',
      "details" : "lost"
  }
],
```

It defines our case for the scratch card, we have 3 winning cases and only one lost.

### Configuration

```json
{
  "path" : "assets/images",
  "file": "scratch-lost.jpg",
  "luck" : 25,
  "event" : 'lost',
  "details" : "lost"
}
```
This is one case, the lost one.

- **path** : Folder path for the image
- **file* : The filename inside the folder
- **luck* : Your probability, here 25%
- **event** : Event to trigger if we play this case
- **details** : Something to return inside the callback of an event

### Init the game

```JavaScript
var scracth = new ScratchCard(document.getElementById('scratchcard'),{
  "picture" : [
    {
        "path" : "assets/images",
        "file": "scratch-dessert.jpg",
        "luck" : 75,
        "event" : 'win',
        "details" : "dessert"
    },{
        "path" : "assets/images",
        "file": "scratch-lost.jpg",
        "luck" : 25,
        "event" : 'lost',
        "details" : "lost"
    }
  ],
  "foreground" : {
      "path" : "assets/images",
      "file" : "scratch-here.jpg"
  }
});
```

For this exemple, we create a new game attached to a div with the id **scratchcard**. Then we describe the scratchcard :

- There are two cases (inside "picture"):
    - win (probability: 75%)
    - lost (probability: 25%)
- foreground : It's the image to displayed before we start to scratch

### Listen an event, to find the case

```JavaScript
// Detect if you lost the game. Opt parameters is the key details of an image JSON
scracth.on('lost', function(opt) {
    console.log(opt);
    // opt = details for this case
});
```
So, as you can see the scratchcard has its own listener. You can listen an event using `scractch.on([eventName], callBack(keyDetailsForCase))`.

It listens the event lost, triggered by our second case. This case has keys **details**, inside of it you have a value : `lost`.

So opt = "lost", if in your case configuration you put an object instead of a string it works.

## Customize form upload URL

Inside the view `./view/formulaire.html` you can find :

```JavaScript
var uploadUrl = "http://mykiwapp.com/form/upload";
```

It's your upload URL, change `"http://mykiwapp.com/form/upload"` to yours in order to upload your form on your server.

Then you can use the *Kiwapp Library* method :

```JavaScript
Kiwapp.session().store(data,{
           url: uploadUrl,
           method:"POST"
}).send();
```

Data is an object, it can be an associative object (name=>value).

So in your view form, you can have these lines to submit a form to your server :

```JavaScript
    // Detect the click on the button play
    // It will parse the form and record it
    $('#playtoform').click(function() {

        var inputs        = $('#formbeforegame').serializeArray(),
            checkboxValue = $('#optin').is(':checked'),
            data          = {};

        // Build each input's value into a JSON {key:value}
        inputs.forEach(function(input,i) {
            data[input.name] = input.value;
        });

        data['optin'] = checkboxValue;

        // Send form data to my server
        Kiwapp.session().store(data,{
                   url: uploadUrl,
                   method:"POST"
        }).send();
        // Then we can open the page game
        openPage('game');
    });
```

You click on the button#playtoform, it will create an array of each input, you grab the value for the checkbox too. Then you create an associative array from your form's input.

You add the value of the checkbox into a key named optin.

Then, you submit these datas to your server and open a page : game.

### More informations

Please read [ScratchCard plugin documentation](#)

## Create a page

You just have to create a view inside `./views/`, then give a name without spaces for your file.

I want to create a page **about-the-app**, I just have to create a file inside `./views/` named : `about-the-app.html`. I can write something inside, perhaps the basic page templtate.

### Basic page

```html
<div class="page-demo">
    <h2>Page title</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex, tempora, sequi quaerat soluta ab recusandae dolore laudantium cupiditate culpa asperiores nulla maiores delectus quos officia porro natus sunt autem impedit.</p>
</div>
```

### Advanced page : as a button (click on the screen to open a page)

This template allows the page to redirect to another one as soon as you click on it.

```html
<div class="page-demo-2 open-page" data-page="about-me">
    <h2>Lorem ipsum dolor sit amet.</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsa, earum, eius, asperiores, nobis modi voluptatibus possimus mollitia voluptas blanditiis libero dolor accusantium veniam corporis incidunt alias suscipit optio fugit accusamus!</p>
</div>
```

- `data-page` : Page destination
- class with `open-page` : Allow the page to be as a button

> The className *open-page* doesn't add any CSS, it's just a class for Kiwapp base app framework. It marks a tag to be as a button and open a page on click. You must add the attribute data-page if you use the className. It specify which page to open.

### Advanced page : auto redirection with a delay

This template is usefull if you want to redirect someone, to another page when the page is open.

```html
<div class="page-demo-3" data-page="about-me" data-timeout="25">
    <h2>Lorem ipsum dolor sit amet.</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsa, earum, eius, asperiores, nobis modi voluptatibus possimus mollitia voluptas blanditiis libero dolor accusantium veniam corporis incidunt alias suscipit optio fugit accusamus!</p>
</div>
```

As soon as you open this page, it will trigger a timeout, so after 25s**** you will be redirected to the page **about-me**.

- `data-page` : Page destination
- `data-timeout` : Delay before we open the page

## Create a button

### Without any JavaScript

```html
<button class="btn-next open-page" type="button" data-page="about-me">About me !</button>
```

To create a button, you have to add two things :

- className : `open-page` : It creates a button for Kiwapp basic app framework, to open a page
- Attribute : `data-page` : It specifies the page to open

### With some JavaScript

```html
<button type="button" id="btnpage">Next</button>
<script>
    // We will use jQuery, because the app includes jQuery
    $('#btnpage').click(function() {
        openPage('about-me');
    });
</script>
```

With this method you have to manualy call the function `openPage` of the framework. Here you move to about-me if you click on this button.

## Play with the Kiwapp Lib

### Save and send data for a form

```JavaScript
Kiwapp.session().store(data).send();
```
`data` is a JavaScript object. Feel free to feed it with anything you want.

### Record a page for statistics

```JavaScript
Kiwapp.stats().page('formulaire');
```

I create here a record for the page formulaire.

### Record an event for statistics

```JavaScript
Kiwapp.stats().event('lost');
```

I create here a record for an event called lost. It's usefull for games, or steps.

### More informations

> Do not forget that, Kiwapp basic app framework takes care of loading the application inside a kiwapp context. It's also starting a session, and it records pages for you.

Please read [Kiwapp library documentation](#)

## Helpers from Kiwapp basic app framework

- `openPage(page, cb)` : *page* Your page name, a string; *cb* A callback

Example *You want to open a page, form and you want to log this action*:

```JavaScript
openPage('form', function() {
    console.log('Switch to page : form');
});
```


- `openPageAfterDelay(page,delay,cb)` : *page* Your page name, a string; *delay* Time delay before we really open the page, an integer; *cb* A callback

Exemple *You want to open a page, form after a delay of 50s and you want to log this action* :

```JavaScript
openPageAfterDelay('form', 50000, function() {
    console.log('Switch to page : form');
});
```

- `data-timeout`
- `data-page`
- `.open-page`

#### - className : open-page

It will create a button, *It doesn't add any CSS to your page*, it's usefull for the JavaScript only. It means :

> If you click on something with this class, we will open a page.

> The page name can be found inside `data-page`

Then we need to select the page.

#### - Custom attribute data-page

This attribute take a string, the page destination's name. So when we click on a button we know which page to open.

#### - Custom attribute data-timeout

This attribute allows you to open a page after a delay. It's working only with the data-page attribute. It cannot be set on a button, because a button with a delay to open a page makes no sense.

So it's only for a page, that means, we can say :

> An user will be redirect to another page after a delay when he displays this page.

> Our application use a lot this, look at the pages : `scratch-*`