const { createApolloFetch } = require('apollo-fetch')

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

const domain = window.location.host // 'tms2.digihcs.com'
const endPoint = `${process.env.END_POINT}` || 'graphqlqms'
const urn = process.env.GRAPHQL_URN || `${domain}/${endPoint}`
window.fetchApollo = createApolloFetch({
  uri: `http://${urn}`,
})