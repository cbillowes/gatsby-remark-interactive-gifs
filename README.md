# gatsby-remark-interactive-gifs

[![npm](https://img.shields.io/npm/v/gatsby-remark-interactive-gifs)](https://www.npmjs.com/package/gatsby-remark-interactive-gifs)
[![Build Status](https://travis-ci.org/cbillowes/gatsby-remark-interactive-gifs.svg?branch=master)](https://travis-ci.org/cbillowes/gatsby-remark-interactive-gifs)
[![codecov](https://codecov.io/gh/cbillowes/gatsby-remark-interactive-gifs/branch/master/graph/badge.svg)](https://codecov.io/gh/cbillowes/gatsby-remark-interactive-gifs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Gatsby plugin to add interactive animated gifs to markdown files.

## Install

`npm install --save gatsby-remark-interactive-gifs`

## Overview

* Add a gif to your markdown with the gif protocol in inline code. `gif:<filename>.gif`.
  There are options to customize it defined later on.
* A still image is extracted and saved in the `dest` as `still-<filename>.gif`.
* Click events will toggle between play and playing.

> **Gotchas:** A fresh copy needs to be downloaded to play a gif from the beginning.
> * All caching strategies are bypassed.
> * This plugin is designed for images that fill a container. Custom styling is required to
>   cater for gifs not of 100% width.

> **Tips:**
> * Optimize your gifs!
> * For imagery, I use icons from [www.flaticon.com](https://www.flaticon.com/) and make sure I attribute them.
> * For spinners/loading indicators, I use [loading.io](https://loading.io/).

## Requirements

This plugin requires node >=10.

## Configure

gatsby-config.json:

```javascript
{
  resolve: `gatsby-transformer-remark`,
  options: {
    plugins: [
      {
        resolve: `gatsby-remark-interactive-gifs`,
        options: {
          root: `${__dirname}`,
          src: `${__dirname}/src/gifs`,
          dest: `${__dirname}/public/static/gifs`,
          play: `${__dirname}/src/images/play.gif`,
          placeholder: `${__dirname}/src/images/placeholder.gif`,
          loading: `${__dirname}/src/images/loading.gif`,
          relativePath: `/static/gifs`
        },
      },
    ]
  },
}
```

* `root` - The root of your project.
* `src` - Where all the gifs you want processed are stored. Absolute path.
* `dest` - A path in `public` where your gifs are stored. Absolute path.
* `play` - An image to indicate that the gif can be interacted with. Absolute path.
* `placeholder` - An image to show when the gif is missing in action. Absolute path.
* `loading` - An image which shows when the gif is downloading. Absolute path.
* `relativePath` - The relative path served from `public/`.

## How to query

Your animated gifs are available in GraphQL and the nodes can be access via `allInteractiveGif`.

```
query MyQuery {
  allInteractiveGif {
    edges {
      node {
        relativePath
        sourcePath
        stillRelativePath
        absolutePath
        base64
      }
    }
  }
}
```

## How to use

Simply reference your gif file name in the gif protocol in order to embed the interactive gif.

```
`gif:dolphin.gif`
```

You can customize it by adding attributes. They are in no particular order and neither are mandatory.

```
`gif:dolphin.gif:id=hitchikers-guide-to-the-galaxy;class=dolphin;caption=So long and thanks for all the fish`
```

* `id` adds element an ids on the gif container and a `still-<id>` on the still container.
* `class` adds a class to the parent interactive gif container.
* `caption` adds text to the bottom of the image.

## How to style

Below is sample styling in `CSS` to get you started.

```css
.interactive-gif {
  position: relative;
}

.interactive-gif .loading {
  position: absolute;
  height: 100%;
  width: 100%;
}

.interactive-gif .loading .indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  background-color: white;
  border-radius: 50%;
  border: solid 20px #ad1f4f;
}

.interactive-gif .placeholder {
  cursor: default;
  opacity: 0.5;
  text-align: center;
}

.interactive-gif .placeholder img {
  height: 150px;
}

.interactive-gif .gif-container,
.interactive-gif .still-container {
  position: relative;
  cursor: pointer;
  line-height: 0;
  font-size: 0;
}

.interactive-gif .gif-container .gif {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
}

.interactive-gif .still-container .still {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

.interactive-gif .still-container .play {
  filter: grayscale(100%);
  width: 20%;
  position: absolute;
  opacity: 0.5;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
}

.interactive-gif .caption {
  font-size: 90%;
  font-style: italic;
}
```

You can convert the above CSS to
[scss](https://jsonformatter.org/css-to-scss),
[sass](https://jsonformatter.org/css-to-sass) or
[less](https://jsonformatter.org/css-to-less).

## Example

```markdown
`gif:nyancat.gif:caption=Nyanyanyanyanyanyanya`
```

```html
<div class="interactive-gif ">
  <div>
    <div id="loading-nyancat.gif"
         class="loading"
         style="max-height: 300px; background-size: cover; background-image: url('/static/gifs/still-nyancat.gif');">
      <img class="indicator" src="/static/gifs/loading.gif">
    </div>
    <div id="nyancat.gif"
         class="gif-container"
         style="display: none; padding-top: 56.28517823639775%;"
         onclick="document.getElementById('nyancat.gif').style.display = 'none';
                  document.getElementById('still-nyancat.gif').style.display = 'block';">
      <img id="image-nyancat.gif" class="gif" data-original="/static/gifs/nyancat.gif">
    </div>

    <div id="still-nyancat.gif"
         class="still-container"
         onclick="var gif = document.getElementById('image-nyancat.gif');
                  gif.src = gif.dataset.original + '?t=' + new Date().getTime();
                  document.getElementById('still-nyancat.gif').style.display = 'none';
                  document.getElementById('nyancat.gif').style.display = 'block';">
      <img id="image-still-nyancat.gif" class="still" src="/static/gifs/still-nyancat.gif">
      <img class="play" src="/static/gifs/play.gif">
    </div>
  </div>
  <div class="caption">Nyanyanyanyanyanyanya</div>
</div>
```

> **Note:** The `padding-top` is added to maintain the aspect ratio for responsive images.
> This is to prevent elements from jumping up when the gifs is loaded as a height cannot be
> determined.

## Troubleshooting

Run a `gatsby clean` when your source nodes are no longer generated.

## Notes

The order of this plugin only matters when you use it together with `gatsby-remark-prismjs`. Prism transforms code blocks and I kind
of slapped a gif protocol in one which will confuse the daylight out of prism. Just reference this plugin somewhere above Prism.

## Contribute

Read the [guidelines](./CONTRIBUTE.md) to contribute to this plugin.

## License

MIT, by Clarice Bouwer
