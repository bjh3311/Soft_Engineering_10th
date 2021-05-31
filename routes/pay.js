//Kakao Pay API Usage

//Using https and express.
const https = require('https');
const express = require('express');
const router = express.router();
const qs = require('qs');
//Pages for Simple messages.
router.get('/success', (req, res) => {
	res.send('Payment Success!')
})
router.get('/cancel', (req, res) => {
        res.send('Payment Canceled... -_-;;')
})
router.get('/fail', (req, res) => {
        res.send('Payment Failed... T_T')
})
router.get('/', function(req,res){
    const options = {
        hostname: 'kapi.kakao.com',
        path: '/v1/payment/ready',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          'Authorization': `KakaoAK 1f432cd048039296b0665c1c27a275db`
        }
      }

      const data = qs.stringify({
        cid: 'TC0ONETIME',
        partner_order_id: '00000001',
        partner_user_id: 'test_user',
        item_name: 'SeoulTech SE',
        quantity: 1,
        total_amount: 0,
        tax_free_amount: 0,
        approval_url: 'http://localhost:3000/pay/success',
        cancel_url: 'http://localhost:3000/pay/cancel',
        fail_url: 'http://localhost:3000/pay/cancel'
    })
});
//Using qs for parameters.


//Setting headers.
const options = {
  hostname: 'kapi.kakao.com',
  path: '/v1/payment/ready',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    'Authorization': `KakaoAK 1f432cd048039296b0665c1c27a275db`
  }
}

//Parameters - replace values as you want, **except cid**.
const data = qs.stringify({
	cid: 'TC0ONETIME',
	partner_order_id: '00000001',
	partner_user_id: 'test_user',
	item_name: 'SeoulTech SE',
	quantity: 1,
	total_amount: 0,
	tax_free_amount: 0,
	approval_url: 'http://localhost:3000/pay/success',
	cancel_url: 'http://localhost:3000/pay/cancel',
	fail_url: 'http://localhost:3000/pay/cancel'
})

//Request
const req = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`)
  res.on('data', d => {
	  process.stdout.write(d)
	  const json = JSON.parse(d)
	  router.get('/', (req, res) => {
		//Redirect to QR Code.
		  res.redirect(`${json.next_redirect_pc_url}`)
	  })
  })
})

req.on('error', error => {
  console.error(error)
})

req.write(data)
req.end()


module.exports = router;