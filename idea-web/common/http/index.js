import util from '@/common/util.js'
export default {
	config: {
		baseUrl: "",
		headers: {},
		dataType: "json",
		responseType: "text"
	},
	interceptor: {
		request: null,
		response: null
	},
	request(options) {
		return new Promise((resolve, reject) => {
			let _config = null
			options.url = this.config.baseUrl + options.url
			options.complete = (response) => {
				let statusCode = response.statusCode

				response.config = _config

				/* if (process.env.NODE_ENV === 'development') {
					if (statusCode === 200) {
						console.log("【" + _config.requestId + "】 结果：" + JSON.stringify(response.data))
					}
				} */
				try{
					if (this.interceptor.response) {
						response = this.interceptor.response(response)
					}
				}catch(e){
					reject(response)
				}
				if (statusCode === 200) { //成功
					resolve(response);
				} else {
					reject(response)
				}
			}

			_config = Object.assign({}, this.config, options)
			_config.requestId = new Date().getTime()

			if (this.interceptor.request) {
				this.interceptor.request(_config)
			}

			/* if (process.env.NODE_ENV === 'development') {
				console.log("【" + _config.requestId + "】 地址：" + _config.url)
				if (_config.data) {
					console.log("【" + _config.requestId + "】 参数：" + JSON.stringify(_config.data))
				}
			} */

			uni.request(_config);
		});
	},
	get(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'GET'
		return this.request(options)
	},
	post(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url 
		options.data = data
		options.method = 'POST'
		return this.request(options)
	},
	posts(url, data, options) {
	    return this.post(url, data, options).then(e => {
	        if (e.code == '0000') {
	            return e.data;
	        }else {
	            util.WU.toast(e.msg)
	            throw new BreakSignal();
	        }
	    })
	},
	gets(url, data, options) {
		 return this.get(url, data, options).then(e => {
		    if (e.code == '0000') {
		        return e.data;
		    } else {
		        util.WU.toast(e.msg)
		        throw new BreakSignal();
		    }
		})
	},
	put(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'PUT'
		return this.request(options)
	},
	delete(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'DELETE'
		return this.request(options)
	}
}
