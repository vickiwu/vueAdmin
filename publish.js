const args = process.argv.splice(2)
const remoteName = args[0]
console.log('所传递的环境：', `->${remoteName}<-`)
const Remote = {
  dev: {
    host: '120.48.19.218',
    port: '22',
    username: 'root',
    password: 'Wcgj2020*',
    remotePath: '/frontend/wwwroot/wl'
  }
}
if (!remoteName || !Remote[remoteName]) {
  return console.error('error', '没有目标服务器连接参数')
}

const localWebPath = './dist'
const localBackupPath = './backup'

const Client = require('ssh2-sftp-client')
const sftp = new Client()
const { host, port, username, password, remotePath } = Remote[remoteName]
sftp
  .connect({
    host,
    port,
    username,
    password
  })

  .then(() => {
    // 上传本地目录到目标服务器
    return sftp.uploadDir(localWebPath, `${remotePath}`)
  })
  .then((info) => {
    console.log(`success:${info}`, '上传完毕')
  })
  .then(() => {
    // 上传本地目录到目标服务器
    return sftp.uploadDir(localBackupPath, `${remotePath}/backup`)
  })
  .then((info) => {
    console.log(`success:${info}`, '上传完毕')
  })
  .catch((err) => {
    console.log('error', err)
  })
  .finally(() => {
    console.log('全部执行完毕')
    sftp.end()
  })
