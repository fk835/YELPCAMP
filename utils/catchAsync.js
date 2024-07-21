module.exports = func => {
  return (req, res, next) => {
    func(req, res, next).catch((e)=> next(e))
  }
}

/* Basically this function accepts a 'func' and then 
return a function that if catches an error run the next
function that uses the next custome error middle-ware */