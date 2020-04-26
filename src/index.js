const path = require(`path`)
const visit = require(`async-unist-util-visit`)
const img = require(`image-size`)

/**
 * @typedef {object} PluginOptions
 * @property {string} dest A path in public where your gifs are stored. Absolute path.
 * @property {string} play An image to indicate that the gif can be interacted with. Absolute path.
 * @property {string} placeholder An image to show when the gif is missing in action. Absolute path.
 * @property {string} loading An image which shows when the gif is downloading. Absolute path.
 * @property {string} relativePath The relative path served to the public.
 */

/**
 * These options are used to generate the HTML node value for said gif.
 * @typedef {object} Options
 * @property {boolean} exists Indicates if the gif or placeholder needs to be embedded.
 * @property {string} relativePath? The path relative to the image file names.
 * @property {string} id? The element ID which can be set to ensure a unique gif is embedded.
 * @property {string} play? The play image file name.
 * @property {string} placeholder? The placeholder image file name.
 * @property {string} loading? The loading image file name.
 * @property {string} gif? The gif file name.
 * @property {string} still? The still image file name.
 * @property {string} caption? The caption to be embedded.
 * @property {string} class? A custom class name for the embedded gif container.
 * @property {number} width? The original width of the gif.
 * @property {number} height? The original height of the gif.
 */

/**
 * @param {string} value the inline code being parsed
 * @returns {boolean}
 */
const matchesProtocol = (value) => {
  return value.startsWith(`gif:`)
}

/**
 * @param {string} value the inline code being parsed
 * @returns {object}
 */
const parseProtocol = (value) => {
  const params = value.split(`:`)
  const gif = params[1]
  const options = (params.length > 2 ? params[2] : ``).split(`;`)

  let protocol = {
    gif,
    id: gif,
    caption: ``,
    class: ``,
  }
  options.forEach((opt) => {
    const attribs = opt.split(`=`)
    protocol[attribs[0]] = attribs[1]
  })
  return protocol
}

/**
 * @param {PluginOptions} pluginOptions
 * @param {object} params
 * @returns {object}
 */
const getNodeHtmlOptions = (pluginOptions, params) => {
  const image = path.join(pluginOptions.dest, params.gif)
  let dimensions = { width: 0, height: 0 }
  let exists = false

  try {
    dimensions = img.imageSize(image)
    exists = true
  } catch (e) {
    console.warn(`${image} does not exist.`)
  }

  return {
    exists: exists,
    relativePath: pluginOptions.relativePath,
    id: params.id,
    play: path.basename(pluginOptions.play),
    placeholder: path.basename(pluginOptions.placeholder),
    loading: path.basename(pluginOptions.loading),
    gif: params.gif,
    still: `still-${params.gif}`,
    caption: params.caption,
    class: params.class,
    width: dimensions.width,
    height: dimensions.height,
  }
}

/**
 * Generates the html to be embedded on the markdown page.
 * @param {Options} options
 * @returns {string}
 */
const getNodeHtml = (options) => {
  if (options.exists) {
    const gifElementId = options.id
    const stillElementId = `still-${options.id}`
    const responsiveness = (options.height / options.width) * 100
    return `
      <div class="interactive-gif ${options.class}">
        <div class="embedded" style="padding-top: ${responsiveness}%">
          <div id="loading-${gifElementId}"
              class="loading" style="background-size: cover; background-image: url('${options.relativePath}/${options.still}');">
              <img class="indicator" src="${options.relativePath}/${options.loading}" />
          </div>
          <div id="${gifElementId}"
              class="gif-container"
              style="display: none;"
              onclick="document.getElementById('${gifElementId}').style.display = 'none';
                        document.getElementById('${stillElementId}').style.display = 'block';">
            <img id="image-${gifElementId}"
                class="gif"
                data-original="${options.relativePath}/${options.gif}" />
          </div>

          <div id="${stillElementId}"
              class="still-container"
              onclick="var gif = document.getElementById('image-${gifElementId}');
                        gif.src = gif.dataset.original + '?t=' + new Date().getTime();
                        document.getElementById('${stillElementId}').style.display = 'none';
                        document.getElementById('${gifElementId}').style.display = 'block';">
            <img id="image-${stillElementId}"
                class="still"
                src="${options.relativePath}/${options.still}" />
            <img class="play"
                src="${options.relativePath}/${options.play}" />
          </div>
        </div>
        <div class="caption">${options.caption ? options.caption : ``}</div>
      </div>
    `
  } else {
    return `
      <div class="interactive-gif">
        <div class="placeholder">
          <img src="${options.relativePath}/${options.placeholder}" />
        </div>
      </div>
    `
  }
}

/**
 * @param {{ markdownAST: any;}} defaultProps
 * @param {PluginOptions} pluginOptions
 * @returns {Promise}
 */
module.exports = async ({ markdownAST }, pluginOptions) => {
  return visit(markdownAST, `inlineCode`, (node) => {
    const value = node.value.toString()
    if (matchesProtocol(value)) {
      const params = parseProtocol(value)
      const options = getNodeHtmlOptions(pluginOptions, params)
      const html = getNodeHtml(options)
      node = Object.assign(node, {
        type: `html`,
        value: html,
      })
    }
    return markdownAST
  })
}
