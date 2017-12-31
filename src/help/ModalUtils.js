let modal = weex.requireModule('modal')

exports.mod = function(msg) {
  modal.toast({
    message:msg, duration:1
  })
}
