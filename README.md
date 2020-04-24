# gatsby-remark-interactive-gifs

A Gatsby plugin to add interactive animated gifs to markdown files.

## Install

`npm install --save gatsby-remark-interactive-gifs`

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
  },
}
```

* `pwd` - the absolute path to your project working directory
* `src` - where all the gifs you want processed are stored
* `dest` - a path in the `public` directory where your gifs will be referenced from
* `play` - an image to indicate that the gif can be interacted with
* `placeholder` - an image to show when the gif is missing in action

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

## License

MIT, by Clarice Bouwer
