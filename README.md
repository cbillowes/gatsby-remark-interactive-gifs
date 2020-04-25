# gatsby-remark-interactive-gifs

![npm](https://img.shields.io/npm/v/gatsby-remark-interactive-gifs)
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
> * There is no loading mechanism which could be trouble for larger gifs.
> * Any caching strategies are bypassed.

> **Tips:**
> * Optimize your gifs!
> * For imagery, I use icons from [www.flaticon.com](https://www.flaticon.com/) and make sure I attribute them.


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
          pwd: `${__dirname}`,
          src: `${__dirname}/src/gifs`,
          dest: `${__dirname}/static/gifs`,
          play: `${__dirname}/src/images/play.gif`,
          placeholder: `${__dirname}/src/images/placeholder.gif`,
          relativePath: `/static/gifs`
        },
      },
    ]
  },
}
```

* `pwd` - The absolute path to your project's working directory.
* `src` - Where all the gifs you want processed are stored. Absolute path.
* `dest` - A path in `public` where your gifs are stored. Absolute path.
* `play` - An image to indicate that the gif can be interacted with. Absolute path.
* `placeholder` - An image to show when the gif is missing in action. Absolute path.
* `relativePath` - The relative path served to the public.

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

* `id` adds element ids' on the gif container and a `still-<id>` on the still container.
* `class` adds a class to the parent interactive gif container.
* `caption` adds text to the bottom of the image.

## How to style

Below is a sample `scss` snippet that can be used to get started.

```scss
.interactive-gif {

  .placeholder {
    cursor: default;
    opacity: .5;
    text-align: center;

    img {
      height: 150px;
    }
  }

  .gif-container,
  .still-container {
    position: relative;
    cursor: pointer;
    line-height: 0;
    font-size: 0;
  }

  .gif-container {
    .gif {
     //img
      width: 100%;
      height: 100%;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
    }
  }

  .still-container {
    .still {
      //img
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
    }

    .play {
      //img
      filter: grayscale(100%);
      width: 20%;
      position: absolute;
      opacity: .5;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
    }
  }

  .caption {
    font-size: 90%;
    font-style: italic;
  }
}
```

## Example

```markdown
`gif:dolphin.gif:caption=So long and thanks for all the fish`
```

```html
<div class="interactive-gif unadjusted">
  <div id="dolphin.gif"
       class="gif-container"
       style="display: none; padding-top: 83.6%;"
       onclick="document.getElementById('dolphin.gif').style.display = 'none';
                document.getElementById('still-dolphin.gif').style.display = 'block';">
    <img id="image-dolphin.gif" class="gif" data-original="/static/gifs/dolphin.gif">
  </div>

  <div id="still-dolphin.gif"
       class="still-container"
       onclick="var gif = document.getElementById('image-dolphin.gif');
                gif.src = gif.dataset.original + '?t=' + new Date().getTime();
                document.getElementById('still-dolphin.gif').style.display = 'none';
                document.getElementById('dolphin.gif').style.display = 'block';">
    <img id="image-still-dolphin.gif" class="still" src="/static/gifs/still-dolphin.gif">
    <img class="play" src="/static/gifs/play.gif">
  </div>

  <div class="caption">So long and thanks for all the fish.</div>
</div>
```

> **Note:** The `padding-top` is added to maintain the aspect ratio for responsive images.
> This is to prevent elements from jumping up when the gifs is loaded as a height cannot be
> determined.

## Notes

The order of this plugin only matters when you use it together with `gatsby-remark-prismjs`. Prism transforms code blocks and I kind
of slapped a gif protocol in one which will confuse the daylight out of prism. Just reference this plugin somewhere above Prism.

## Contribute

Read the [guidelines](./CONTRIBUTE.md) to contribute to this plugin.

## License

MIT, by Clarice Bouwer
