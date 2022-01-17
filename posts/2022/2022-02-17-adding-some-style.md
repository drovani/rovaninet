---
title: Adding Some Style
category: Rovani's Vue
date: 2022-02-17
series: HSMercs From Scratch
step: 4
tags:
  - vuejs
  - tailwindcss
---

Creating a handful of components to render the data that loaded from a JSON file was covered in the [previous post](/posts/2022/first-rudimentary-mercenary-components/). It can feel a little defeating to just have a dump of content without any style to it. This step of the tutorial will cover implementing TailwindCSS to our project and adding some basic styling.

![No one is as pretty as Varden](/images/hsmercs-banner-varden.png)

> The fourth in a series of posts on ['HSMercs Helper From Scratch'](/hs-mercs-from-scratch), a tutorial for recreating _[HSMercs Helper](https://hsmercs.rovani.net)_.

The native [tutorial for installing](https://tailwindcss.com/docs/guides/vite) Tailwind CSS with Vue 3 and Vite is straightforward and easy to follow. Most of what you'll see in this post is following the steps in that post.

```bash
yarn add -D tailwindcss postcss autoprefixer
```

_[PostCSS](https://postcss.org/)_ is a tool for transforming styles with JS plugins. These plugins can lint the CSS, support variables and mixins, transpile future CSS syntax, create inline images, and more. The _[Autoprefixer](https://github.com/postcss/autoprefixer)_ plugin parses CSS and adds vendor prefixes to CSS rules using values from _[Can I Use](https://caniuse.com/)_. Together, these provide the functionality that Tailwind uses to pump out the CSS we need it to.

The official tutorial now instructs you to run the command `yarn tailwindcss init -p` which creates a `postcss.config.js` file for _PostCSS_ configuration and a `tailwind.config.js` file for Tailwind specific configuration.

#### postcss.config.js
```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

This tells _PostCSS_ to utilize the `tailwindcss` and `autoprefixer` plugins.

#### tailwind.config.js
```js
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,ts}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

Additional configuration is provided to _TailwindCSS_ informing it to parse the root `/index.html` file and all `.vue` and `.ts` files anywhere under the `src` folder.

#### src/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

These three layers are where PostCSS and Autoprefixer inject the styles that Tailwind generates.

#### src/main.ts
```diff
  import { createApp } from 'vue'
  import App from './App.vue'
+ import './index.css'
  import { store } from './store'
  
  
  createApp(App)
      .use(store)
      .mount('#app')
```

This pulls the newly-created CSS file into the Vue app.

#### index.html
```diff
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>HSMercs Helper</title>
  </head>
  <body>
-   <div id="app"></div>
+   <div id="app" class="max-w-screen-lg mx-auto"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

These two classes are fairly standard for a website. `max-w-screen-lg` can be read as "the max width of this element should be equivalent to the screen-large setting." The class `mx-auto` sets the left and right margin to auto, which has the effect of centering the content.

#### src/components/Mercenaries.vue
```diff
<template>
  <section>
    <h1>Mercenaries</h1>
-   <div>
+   <div class="flex flex-wrap gap-4 px-2">
      <MercenaryCard
        v-for="(merc, mercName) in mercenaries"
        :key="mercName"
        v-bind="merc"
+       class="w-72 rounded-md border"
        >{{ mercName }}
      </MercenaryCard>
    </div>
  </section>
</template>
```

When there is a set of cards, and we don't particularly care how many are in a row, the best case is to use `flex` on the container, instructing it to wrap entries that won't fit in one line. `px-2` means to put a small padding on the left and right side of the container and `gap-4` instructs flex to keep a small space between elements. `w-72` translates to 18rem or 288px, which is a nice width for a summary card, and will neatly fit three cards across. We are also adding a simple rounded corner and giving the cards a little spacing.

```bash
yarn dev
```

![A little style!](/images/hsmercs-mercstyled.png)

One of this first things I panicked on when I first installed Tailwind was that all of my text was suddenly the same size. What did I screw up?!

Well, fear not; this is intentional. The directive `@tailwind base` contains reset rules (called [Preflight](https://tailwindcss.com/docs/preflight))that clear all of the browser defaults. Since each browser has slightly different default stylying, the first thing Tailwind does is strip it all out.

## Style Some More Components

Most of the styling is going to be inside the Mercenary Card or one of its children. We can start by throwing around a couple classes and seeing what happens. How about this?

#### src/components/MercenaryCard.vue
```diff
<template>
+ <div class="grid grid-cols-2">
+   <div class="row-span-2">
+     <h2 class="font-bold"><slot /></h2>
      <Rarity :rarity="rarity" />
      <Tribe v-if="tribe" :tribe="tribe" />
      <Role :role="role" />
      <Attack :role="role" :attack="attack" />
      <Health :role="role" :health="health" />
    </div>
+   <div class="grid grid-cols-3">
      <Ability
        v-for="(ability, abilityName) in abilities"
        :key="abilityName"
        :ability="ability"
        >{{ abilityName }}
      </Ability>
    </div>
+   <div class="grid grid-cols-3">
      <Item v-for="(item, itemName) in equipment" :key="itemName" :item="item"
        >{{ itemName }}
      </Item>
    </div>
  </div>
</template>
```

![HS Mercs - 3 column card looks terrible](/image/hsmercs-mcard-3col.png)

Well that looks absolutely terrible, but if you squint, you can see all of the elements in their place.

Let's have a second go at it. Instead of doing half the card with the Mercenary stats and the other half split between the abilities and items, let's do them as three rows inside the card.

#### src/components/MercenaryCard.vue
```diff
<template>
- <div class="grid grid-cols-2">
+ <div class="grid grid-row-3">
-   <div class="row-span-2">
+   <div>
      <h2 class="font-bold"><slot /></h2>
      <Role :role="role" />
      <Tribe v-if="tribe" :tribe="tribe" />
      <Rarity :rarity="rarity" />
      <Attack :role="role" :attack="attack" />
      <Health :role="role" :health="health" />
    </div>
    <div class="grid grid-cols-3">
      <Ability
        v-for="(ability, abilityName) in abilities"
        :key="abilityName"
        :ability="ability"
        >{{ abilityName }}
      </Ability>
    </div>
    <div class="grid grid-cols-3">
      <Item v-for="(item, itemName) in equipment" :key="itemName" :item="item"
        >{{ itemName }}
      </Item>
    </div>
  </div>
</template>
```

**This right here** is why I think CSS is so frickin' cool. We made a small adjustment to the CSS and BOOM, it's an entirely new layout.

![HS Mercs - 3 row card looks useable](/image/hsmercs-mcard-3row.png)
