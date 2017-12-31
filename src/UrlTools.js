/*
exports.getUrlBase = function(bundleUrl) {
  let isAndroidAssets = bundleUrl.indexOf('file://assets/') >= 0
  let isIOSAssets = bundleUrl.indexOf('file:///') >= 0

  if(isAndroidAssets) {
    return 'file://assets'
  } else if(isIOSAssets) {
    return bundleUrl.substring(0, bundleUrl.lastIndexOf('/') - 4)
  } else {
    let host = '127.0.0.1:8080'
    let matches = /\/\/([^\/]+?)\//.exec(bundleUrl)
    if(matches && matches.length >= 2) {
      host = matches[1]
    }
    return 'http://' + host
  }
}*/

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
exports.getBaseURL = function () {
  var bundleUrl = weex.config.bundleUrl;
  var nativeBase;
  var isAndroidAssets = bundleUrl.indexOf('jwxpage://assets/') >= 0 || bundleUrl.indexOf('file://assets/')>=0;
  var isiOSAssets = bundleUrl.indexOf('file:///') >= 0 && bundleUrl.indexOf('WeexDemo.app') > 0;
  if (isAndroidAssets) {
    nativeBase = 'jwxpage://assets/dist/';
  }
  else if (isiOSAssets) {
    // file:///var/mobile/Containers/Bundle/Application/{id}/WeexDemo.app/
    // file:///Users/{user}/Library/Developer/CoreSimulator/Devices/{id}/data/Containers/Bundle/Application/{id}/WeexDemo.app/
    nativeBase = bundleUrl.substring(0, bundleUrl.lastIndexOf('/dist/') + 6);
  }
  else {
    var host = 'localhost:12580';
    var matches = /\/\/([^\/]+?)\//.exec(weex.config.bundleUrl);
    if (matches && matches.length >= 2) {
      host = matches[1];
    }
    nativeBase = 'http://' + host + '/dist/';
  }
  var h5Base = './vue.html?page=./dist/'
  // in Native
  var base = nativeBase;
  if (typeof window === 'object') {
    // in Browser or WebView
    base = h5Base;
  }
  return base
}
exports.getSub = function(url) {
  url = url.substring(0, url.lastIndexOf('/dist/'))
  url = url.substring(0, url.lastIndexOf('/'))
  return url + '/dist/'
}

exports.getBaseImageUrl = function() {
  var bundleUrl = weex.config.bundleUrl;
  let isAndroidAssets = bundleUrl.indexOf('jwxpage://assets/') >= 0 || bundleUrl.indexOf('file://assets/') >= 0
  let isIOSAssets = bundleUrl.indexOf('file:///') >= 0

  if(isAndroidAssets) {
    return 'asset:///dist/'
  } else if(isIOSAssets) {
    return bundleUrl.substring(0, bundleUrl.lastIndexOf('/') + 1)
  } else {
    let host = '127.0.0.1:8080/dist/'
    let matches = /\/\/([^\/]+?)\//.exec(bundleUrl)
    if(matches && matches.length >= 2) {
      host = matches[1]
    }
    return 'http://' + host + '/dist/'
  }
}


exports.getImageBase = function(bundleUrl) {
  let isAndroidAssets = bundleUrl.indexOf('jwxpage://assets/') >= 0 || bundleUrl.indexOf('file://assets/') >= 0
  let isIOSAssets = bundleUrl.indexOf('file:///') >= 0

  if(isAndroidAssets) {
    return 'asset://'
  } else if(isIOSAssets) {
    return bundleUrl.substring(0, bundleUrl.lastIndexOf('/') - 4)
  } else {
    let host = '127.0.0.1:8080'
    let matches = /\/\/([^\/]+?)\//.exec(bundleUrl)
    if(matches && matches.length >= 2) {
      host = matches[1]
    }
    return 'http://' + host
  }
}

exports.getParams = function(url) {
  let params = url.split('?')
  if(params.length > 0) {
    let res = {}
    params = params[1]
    let paramSplit = params.split('&')
    paramSplit.forEach(param => {
      let ps = param.split('=')
      if(ps.length === 2) {
        res[ps[0]] = ps[1]
      }
    })
    return res
  }
  return {}
}
