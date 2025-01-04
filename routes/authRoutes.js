const express = require('express');
const axios = require('axios');
const User = require('../models/User'); // User 모델 가져오기
const router = express.Router();

// 환경 변수 설정
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

// Google 로그인 시작
router.get('/', (req, res) => {
  let url = 'https://accounts.google.com/o/oauth2/v2/auth';
  url += `?client_id=${GOOGLE_CLIENT_ID}`;
  url += `&redirect_uri=${GOOGLE_REDIRECT_URI}`;
  url += `&response_type=code`;
  url += `&scope=email profile`;
  res.redirect(url);
});

// Google 로그인 후 리디렉션
// Google 로그인 후 리디렉션
router.get('/redirect', async (req, res) => {
  const { code } = req.query;

  try {
    // Google에서 Access Token 요청
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', null, {
      params: {
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      },
    });

    const { access_token } = tokenResponse.data;

    // Google 사용자 정보 요청
    const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const userInfo = userInfoResponse.data;

    // 데이터베이스에 사용자 저장
    let user = await User.findOne({ email: userInfo.email }); // 이메일로 기존 사용자 확인
    if (!user) {
      // 신규 사용자 생성
      user = new User({
        name: userInfo.name,
        email: userInfo.email,
      });
      await user.save();
    }

    // 사용자 정보를 포함하여 프론트엔드로 리디렉션
    res.redirect(
      `http://localhost:3001?name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&picture=${encodeURIComponent(userInfo.picture)}`
    );
  } catch (error) {
    console.error('Google OAuth Error:', error.response?.data || error.message);
    res.status(500).send('Something went wrong');
  }
});

module.exports = router;