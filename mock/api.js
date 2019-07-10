function getFakeCaptcha(req, res) {
  return res.json('captcha-xxx');
}

export default {
  'GET /api/captcha': getFakeCaptcha,
};
