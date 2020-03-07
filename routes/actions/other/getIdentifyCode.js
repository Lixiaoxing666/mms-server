module.exports = (req, res) => {
  const str = '23456789abcdefghjklmnopqrstuvwxyz'
  const len = str.length
  let randomCaptcha = ''
  for (let i = 0; i < 4; i++) {
    randomCaptcha += str[Math.floor(Math.random() * (len - 1))]
  }
  res.send({
    data: randomCaptcha,
    status: 200,
    message: '获取验证码成功！'
  })
}