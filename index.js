const express = require('express')
const {json} = require('body-parser')
const aws = require('aws-sdk')
const config = require('./config')

// Configure the library with your API keys and info
aws.config.update({
   accessKeyId: config.accessKeyId,
   secretAccessKey: config.secretAccessKey,
   region: config.region,
   signatureVersion: config.signatureVersion
})

const app = express()
const port = 3000

app.use(express.static(__dirname + '/public'))

app.use(json())
app.get('/api/s3', function(req, res, next) {
   const s3 = new aws.S3()
   const s3Config = {
      Bucket: config.bucketName,
      Key: req.query.file_name,
      Expires: 60,
      ContentType: req.query.file_type,
      ACL: 'public-read'
   }
   s3.getSignedUrl('putObject', s3Config, function(err, response) {
      if (err) {
         return next(err)
      }
      const data = {
         signed_request: response,
         url: `https://${config.bucketName}.s3.amazonaws.com/${req.query.file_name}`
      }
      return res.status(200).json(data)
   })

})
app.listen(port, () => {
   console.log("Listening on port" + port)
})