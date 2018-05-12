# Lab 19 - Authorization - File Management
**Author**: Carl Olson
**Version**: 1.2.0

## Overview
This is a continuation of previous labs using basic/bearer authentication and MongoDB/mongoose schemas. For this lab, I added a third model (image) which represents a file asset and can be stored on AWS S3. The metadata about the image file is stored in MongDB.

## Testing
To start the server for testing, enter in the command line: ```npm run dbon```. Then to start the test, enter: ```npm run test```. To turn the server off, enter: ```npm run dboff```.

#### Image Model

A ```POST``` request to the /images endpoint will use the AWS SDK to post the image to my S3 Bucket, and return a 200 status code response. If the requests is sent without the proper data it will return a 400 code, and without a proper authentication token it will return a 401 code. 

A ```GET``` request to the /images/:id endpoint will retrieve the image and return a 200 status code response, if successful. If the requests is sent without the proper data it will return a 404 code, and without a proper authentication token it will return a 401 code. 

A ```DELETE``` request will remove an asset from the db and return a status code of 204. If improper or incomplete data is sent it will return a 400, and if an invalid token is sent it will return a 401 code. 

#### Account Model
A successful status code of 200 is sent as the response if an account and token are created with the data sent in the POST request. If necessary data is not included in the request, a 400 status code will be sent in response. And if the request includes data that attemps to use a duplicate key (email and username must be unique), a 409 code is sent in response. 

There is also a test for /login with username and password using basic authentication. If successful, a 200 status code is sent in response.

#### Profile Model
The Profile model has a required reference to the Account model, meaning an Account must be created first. A successfully created profile (POST request) will send a 200 status code in response. If the request data is incomplete, a status code of 400 will be send. And using bearer authorization, if a token is not sent, it will register a 401 error code. Similarly for a GET request completing successfully, a 200 status code is sent in response. If the account requested is not valid, a 404 error code is sent. And if a valid token is not sent,it will register a 401 error code.