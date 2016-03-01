# Polymor - Polymer for Meteor

This package is a replacement for blaze. It allows you to write you client side code as Polymer webcomponents using the power of Meteor through a bunch of meteor-specific components (see below).

## Installation

```bash
meteor create mypolymerproject
cd mypolymerproject
rm *.html *.js *.css
meteor remove blaze-html-templates
meteor add polymor
```

Then, create a Polymer component named "polymor-entry". It'll be you application main component. A very simple starting point can be this component copied into an .html file in the root folder of you app :

```html
<link rel="import" href="/bower_components/paper-styles/default-theme.html">
<link rel="import" href="/bower_components/paper-styles/typography.html">
<link rel="import" href="/bower_components/paper-styles/color.html">
<link rel="import" href="/bower_components/paper-button/paper-button.html">

<dom-module id="polymor-entry">
  <style>
    :host {
      @apply(--paper-font-common-base);
    }
    paper-button {
      background-color: var(--paper-pink-a200);
    }
  </style>

  <template>
    <h1>Welcome to Meteor, and Polymer !</h1>
    <paper-button raised on-click="clicked">Click Me</paper-button>
    <p>You've pressed the button {{counter}} times.</p>
  </template>

  <script>
    Polymer({
      is: "polymor-entry",
      properties: {
        counter: {
          type: Number,
          value: 0
        }
      },
      clicked: function(e) {
        this.counter++;
      }
    });
  </script>
</dom-module>
```

Then, just start polymer (or bundle your apps)

```bash
POLYMER_PATH="/absolute/path/to/polymer/install/" meteor run
```

## Meteor-specific components

Here is a list of components automatically available in your project (no html import needed)

- meteor-call
- meteor-collection
- meteor-connection
- meteor-query
- meteor-session
- meteor-subscribe
- meteor-user

More doc about thoses components can be found at http://atoy40.github.io/meteor-elements/

## Notes
