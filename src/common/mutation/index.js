const CREATE_NUMBERING = `
  mutation ($idQueue: ID!) {
    createNumbering(idQueue: $idQueue) {
      _id
      number
      state
      curNumber
      createdAt
      updatedAt
    }
  }
`
module.exports = {
  CREATE_NUMBERING
}