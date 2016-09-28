"use strict";
var log = require('../logger');
var config = require('../../config');
var encryption = require('../encryption');
var debug = require('debug')('response');

module.exports = function(data){
	debug("sending ok response");
	var req = this.req;
	var res = this;

	if(req.header('x-tag') && req.method === 'POST' && config.secureMode && data){
		debug("i want to encrypt");
		var key = req.header('x-tag');
		debug('our encryption key: ', key);
		var text = JSON.stringify(data);
		debug("about to call encryption method");
		encryption.encrypt(text, key)
		.then(function(resp){
			debug("got response from encryption method: ",resp);
			log.info('Sending ok response: ', data);
			res.status(200).json({status: 'success', data: resp, secure: true});
		})
		.catch(function(err){
			debug("got error from encryption method: ", err);
			res.serverError(err,'Error encrypting response.');
		});
	}else{
		log.info('Sending ok response: ', data);
		if(data){
			res.status(200).json({status: 'success', data: data});
		}else{
			res.status(200).json({status: 'success'});
		}
	}
};
