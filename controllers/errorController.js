

// Intentional Error 500
exports.triggerError = async function (req, res, next) {
  try {
    throw new Error("Oops! This is an Intentional Server Error, you know I'm on my way to being a developer so I can as well have fun right?")
  } catch (err) {
    err.status = 500
    next(err)
  }
}