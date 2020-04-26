const path = require(`path`)
const fs = require(`fs-extra`)
const gifFrames = require(`gif-frames`)

let Reporter = console

/**
 * @typedef {object} PluginOptions
 * @property {string} root Project's working directory. Absolute path.
 * @property {string} src Where all the interactive gifs are stored. Absolute path.
 * @property {string} dest A directory in public where the gifs should be copied to. Absolute path.
 * @property {string} play The image that indicates that the gif can be interacted with. Absolute path.
 * @property {string} placeholder The image which shows when the gif is missing in action. Absolute path.
 */

/**
 * Verifies if the path exists.
 * @param {string} option
 * @param {string} path
 * @returns {Promise}
 */
async function verifyPathExists(option, path) {
  return fs.pathExists(path, (err, exists) => {
    if (err || !exists)
      Reporter.error(`Path does not exist [${option}]: ${path}`)
    return exists
  })
}

/**
 * Validate if all required paths exist.
 * @param {PluginOptions} pluginOptions
 * @returns {boolean}
 */
const validate = (pluginOptions) => {
  const verifies = [
    verifyPathExists(`root`, pluginOptions.root),
    verifyPathExists(`src`, pluginOptions.src),
    verifyPathExists(`play`, pluginOptions.play),
    verifyPathExists(`placeholder`, pluginOptions.placeholder),
  ]
  return verifies.every(Boolean)
}

/**
 * Gets that bas64 contents of a file.
 * @param {string} pathAndfilename
 * @returns {string}
 */
const getBase64 = (pathAndfilename) => {
  return Buffer.from(fs.readFileSync(pathAndfilename)).toString(`base64`)
}

/**
 * Copy gifs, play and placeholder images from src to dest.
 * @param {string[]} files A list of all gif file names to be copied.
 * @param {PluginOptions} pluginOptions
 * @returns {void}
 */
const copyFiles = (files, pluginOptions) => {
  let copy = files.map((filename) => path.join(pluginOptions.src, filename))
  copy.push(pluginOptions.play)
  copy.push(pluginOptions.placeholder)
  copy.map((src) => {
    const dest = path.join(pluginOptions.dest, path.basename(src))
    fs.copyFile(src, dest)
  })
}

/**
 * Create the still image from a gif.
 * @param {string} file A file name for the gif that will generate a still image from src to dest.
 * @param {PluginOptions} pluginOptions
 * @returns {void}
 */
const createStill = (file, pluginOptions) => {
  const src = path.join(pluginOptions.src, file)
  const dest = path.join(pluginOptions.dest, `still-${path.basename(src)}`)

  // @es-ignore
  gifFrames({ url: src, frames: 0 })
    // @ts-ignore
    .then((frameData) => {
      frameData[0].getImage().pipe(fs.createWriteStream(dest))
    })
}

/**
 * Gets the relative path of a file from its absolute path.
 * @param {string} absolutePath
 * @param {string} filePath
 * @returns {string}
 */
const getRelativePath = (absolutePath, filePath) => {
  return path.relative(absolutePath, filePath).replace(/public/gi, ``)
}

/**
 * Create the node data.
 * @param {string} filename
 * @param {string} base64
 * @param {PluginOptions} pluginOptions
 * @returns {object}
 */
const createNodeData = (filename, base64, pluginOptions) => {
  const src = path.join(pluginOptions.src, filename)
  const dest = path.join(pluginOptions.dest, filename)
  const still = path.join(pluginOptions.dest, `still-${filename}`)
  const root = pluginOptions.root
  return {
    absolutePath: dest,
    sourcePath: src,
    relativePath: getRelativePath(root, dest),
    stillRelativePath: getRelativePath(root, still),
    base64: base64,
  }
}

/**
 * @param {string} filename
 * @param {string} base64
 * @param {Function} createNodeId
 * @param {Function} createContentDigest
 * @returns {object}
 */
const createNodeMeta = (
  filename,
  base64,
  createNodeId,
  createContentDigest
) => {
  return {
    id: createNodeId(`interactive-gif-${filename}`),
    parent: null,
    children: [],
    internal: {
      type: `InteractiveGif`,
      mediaType: `image/gif`,
      content: filename,
      contentDigest: createContentDigest(base64),
    },
  }
}

/**
 * Creates the source node.
 * @param {string} filename Of the gif to be added to GraphQL.
 * @param {object} options
 * @param {PluginOptions} pluginOptions
 * @returns {void}
 */
const createSourceNode = (filename, options, pluginOptions) => {
  const { actions, createNodeId, createContentDigest } = options
  const { createNode } = actions
  const base64 = getBase64(path.join(pluginOptions.src, filename))
  const data = createNodeData(filename, base64, pluginOptions)
  const meta = createNodeMeta(
    filename,
    base64,
    createNodeId,
    createContentDigest
  )
  const node = Object.assign(data, meta)
  createNode(node)
}

/**
 * @param {{ reporter: object; }} options
 * @param {PluginOptions} pluginOptions
 * @returns {void}
 */
exports.sourceNodes = (options, pluginOptions) => {
  const { reporter } = options
  Reporter = reporter

  if (validate(pluginOptions)) {
    fs.mkdirp(pluginOptions.dest, (err) => {
      if (err)
        Reporter.error(
          `Cannot make directory [dest]: ${pluginOptions.dest} -> ${err}`
        )
    })

    fs.readdir(pluginOptions.src, (err, files) => {
      if (err) {
        Reporter.error(
          `Cannot read directory [src]: ${pluginOptions.src} -> ${err}`
        )
        return
      }

      copyFiles(files, pluginOptions)
      files.forEach((filename) => {
        createStill(filename, pluginOptions)
        createSourceNode(filename, options, pluginOptions)
      })
    })
  }
}
