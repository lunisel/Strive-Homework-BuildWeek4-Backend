export const notFoundHandler = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(err.status).send({ message: err.message || 'Not found!' })
  } else {
    next(err)
  }
}

export const badRequestHandler = (err, req, res, next) => {
  if (err.status === 400 || err.name === 'ValidationError') {
    res.status(400).send({ message: err.errors || 'Bad Request!' })
  } else {
    next(err)
  }
}

export const genericErrorHandler = (err, req, res, next) => {
  console.log(err)
  res.status(500).send({ message: 'Generic Server Error!' })
}
