const GET_KIOSK_BY_IPADDRESS = `
  query ($IPaddress: String) {
    getKioskByIPaddress(IPaddress: $IPaddress) {
      _id
      idQueue
      title
      content
      isActive
      location
      IPaddress
      MACaddress
      createdAt
      updatedAt
      createdBy {
        username
        fullName
      }
      updatedBy {
        username
        fullName
      }
      ticket {
        content
      }
    }
  }
`

const GET_COMPANY_ACTIVE = `
  query {
    getCompanyActive {
      _id
      isActive
      name
      code
      address
      phone
      logo
      banner
      letterMarkLogo
    }
  }
`
module.exports = {
  GET_KIOSK_BY_IPADDRESS,
  GET_COMPANY_ACTIVE
}
