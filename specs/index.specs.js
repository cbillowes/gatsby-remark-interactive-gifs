const remark = require("remark")
const plugin = require("../src/index")

/*
 * dolphin.gif courtesy of giphy.com:
 * > https://giphy.com/gifs/dolphin-Vt4wDrLAnH1tu
 *
 * play and placeholder images courtesy of flaticon:
 * > https://www.flaticon.com/free-icon/play_2819037
 * > https://www.flaticon.com/free-icon/photo_2793644
 */

const getNodeContent = node => node.children[0].children[0]

const options = {
  pwd: `${__dirname}`,
  relativePath: `/static/gifs`,
  src: `${__dirname}/images`,
  dest: `${__dirname}/images`,
  play: `${__dirname}/images/play.gif`,
  placeholder: `${__dirname}/images/placeholder.gif`,
}

describe(`gatsby-remark-interactive-gifs`, () => {

  it(`inline code not matching the protocol`, async () => {
    const markdown = "`npm i gatsby-remark-interactive-gifs`"
    const markdownAST = remark().parse(markdown)
    const processed = await plugin({ markdownAST }, options)
    expect(processed).toBeTruthy()
    expect(getNodeContent(markdownAST)).toMatchSnapshot()
  })

  it(`should embed the placeholder when the image does not exist`, async () => {
    const markdown = "`gif:porpoise.gif`"
    const markdownAST = remark().parse(markdown)
    const processed = await plugin({ markdownAST }, options)
    expect(processed).toBeTruthy()
    expect(getNodeContent(markdownAST)).toMatchSnapshot()
  })

  it(`should embed the gif`, async () => {
    const markdown = "`gif:dolphin.gif`"
    const markdownAST = remark().parse(markdown)
    const processed = await plugin({ markdownAST }, options)
    expect(processed).toBeTruthy()
    expect(getNodeContent(markdownAST)).toMatchSnapshot()
  })

  it(`should embed the gif with a specified element id`, async () => {
    const markdown = "`gif:dolphin.gif:id=i-am-a-dolphin`"
    const markdownAST = remark().parse(markdown)
    const processed = await plugin({ markdownAST }, options)
    expect(processed).toBeTruthy()
    expect(getNodeContent(markdownAST)).toMatchSnapshot()
  })

  it(`should embed the gif with a caption`, async () => {
    const markdown = "`gif:dolphin.gif:caption=So long and thanks for all the fish`"
    const markdownAST = remark().parse(markdown)
    const processed = await plugin({ markdownAST }, options)
    expect(processed).toBeTruthy()
    expect(getNodeContent(markdownAST)).toMatchSnapshot()
  })

  it(`should embed the gif with a class`, async () => {
    const markdown = "`gif:dolphin.gif:class=do-not-stretch-me`"
    const markdownAST = remark().parse(markdown)
    const processed = await plugin({ markdownAST }, options)
    expect(processed).toBeTruthy()
    expect(getNodeContent(markdownAST)).toMatchSnapshot()
  })

  it(`should embed the gif with an id, caption and class`, async () => {
    const markdown = "`gif:dolphin.gif:caption=So long and thanks for all the fish;class=do-not-stretch-me;id=am-i-a-fishy`"
    const markdownAST = remark().parse(markdown)
    const processed = await plugin({ markdownAST }, options)
    expect(processed).toBeTruthy()
    expect(getNodeContent(markdownAST)).toMatchSnapshot()
  })
})
