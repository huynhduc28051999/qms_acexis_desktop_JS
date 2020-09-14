const moment = require('moment')
const { ipcRenderer } = require('electron')


function sendCommandToWorker(content) {
  ipcRenderer.send('print', content)
}

const PrintNumbering = async ({ company, number = 1, curNumber = 1, note = `
Lưu ý:
Bệnh nhân vui lòng nghe gọi STT để vào phòng khám`, content }) => {
  const mainContent = content.replace('${date}', moment().format('HH:mm DD/MM/YYYY')) /* eslint-disable-line */
    .replace('${number}', number) /* eslint-disable-line */
    .replace('${curNumber}', curNumber) /* eslint-disable-line */
    .replace('${note}', note) /* eslint-disable-line */
    const print =
    `
      <div style="display: flex; justify-content: space-between">
        <div>
          <img src=${company.logo} alt=${company.name} loading='lazy' width='200px' />
        </div>
        <div>
        ${company.name}
        </div>
      </div>
      <div style="text-align: center">
        ${mainContent}
      </div>
    `

    sendCommandToWorker(print)
  return true
}

module.exports = {
  PrintNumbering
}