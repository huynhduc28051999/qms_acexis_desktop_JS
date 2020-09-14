const { GET_COMPANY_ACTIVE, GET_KIOSK_BY_IPADDRESS } = require('../common/queries')
const { CREATE_NUMBERING } = require('../common/mutation')
const { PrintNumbering } = require('./print')

let company = {
  logo: '../assets/images/logo.png',
  name: 'ACEXIS | QMS'
}
const loadCompany = async() => {
  window.fetchApollo({
    query: GET_COMPANY_ACTIVE,
  }).then(res => {
    // const origin = `${window.location.origin}/images/qms/company`
    const origin = `https://qmstest.digihcs.com/images/qms/company`
    const { getCompanyActive } = res.data
    if (getCompanyActive) {
      company = getCompanyActive
      document.querySelector('#logo-company').src = `${origin}/${getCompanyActive.letterMarkLogo}`
      document.querySelector('#company-name').innerHTML = getCompanyActive.name
    }
  })
}
function getLocalIP() {
  return new Promise(((resolve, reject) => {
    // NOTE: window.RTCPeerConnection is 'not a constructor' in FF22/23
    const RTCPeerConnection = /* window.RTCPeerConnection || */ window.webkitRTCPeerConnection || window.mozRTCPeerConnection

    if (!RTCPeerConnection) {
      reject(new Error('Your browser does not support this API'))
    }

    const rtc = new RTCPeerConnection({ iceServers: [] })
    const addrs = {}
    addrs['0.0.0.0'] = false

    function grepSDP(sdp) {
        // const hosts = []
        let finalIP = ''
        sdp.split('\r\n').forEach((line) => {
          if (~line.indexOf('a=candidate')) { // eslint-disable-line no-bitwise
              const parts = line.split(' ')
              const addr = parts[4]
              const type = parts[7]
              if (type === 'host') {
                  finalIP = addr
              }
          } else if (~line.indexOf('c=')) { // eslint-disable-line no-bitwise
              const parts = line.split(' ')
              const addr = parts[2]
              finalIP = addr
          }
        })
        return finalIP
    }

    if (1 || window.mozRTCPeerConnection) { // FF [and now Chrome!] needs a channel/stream to proceed
        rtc.createDataChannel('', { reliable: false })
    }

    rtc.onicecandidate = (evt) => {
        // convert the candidate to SDP so we can run it through our general parser
        // see https://twitter.com/lancestout/status/525796175425720320 for details
        if (evt.candidate) {
          const addr = grepSDP(`a=${evt.candidate.candidate}`)
          resolve(addr)
        }
    }
    rtc.createOffer((offerDesc) => {
        rtc.setLocalDescription(offerDesc)
    }, (e) => { console.warn('offer failed', e) })
  }))
}
const getNumbering = ({ company, idQueue, kiosk }) => {
  try {
    window.fetchApollo({
      query: CREATE_NUMBERING,
      variables: { idQueue }
    })
      .then(res => {
        const { createNumbering } = res.data
        if (createNumbering) {
          PrintNumbering({
            company,
            number: createNumbering.number,
            curNumber: createNumbering.curNumber,
            content: kiosk.ticket.content
          })
        }
      })
  } catch (error) {
    console.log(error)
  }
}
const fetchDataKiosk = (IPaddress) => {
  try {
    window.fetchApollo({
      query: GET_KIOSK_BY_IPADDRESS,
      variables: { IPaddress }
    })
      .then(res => {
        const { getKioskByIPaddress = {} } = res.data
        if (getKioskByIPaddress?.IPaddress) {
          document.querySelector('#kiosk-content').innerHTML = getKioskByIPaddress.content
          document.querySelector('#kiosk-content').addEventListener('click', () => {
            getNumbering({
              company,
              idQueue: getKioskByIPaddress.idQueue,
              kiosk: getKioskByIPaddress
            })
          })
        }
      })
  } catch (error) {
    console.log(error)
  }
}
window.onload = () => {
  loadCompany()
  getLocalIP().then(address => {
    fetchDataKiosk(address)
  })
}