const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const app = express();
const fs = require('fs');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
require('dotenv').config();

// const users = require('./routes/userRoutes');
// const post = require('./routes/postRoutes')
// const payment = require('./routes/paymentRoutes')
const AppError = require('./utils/appError');
const globalErrorHandlder = require('./controllers/errorController');
// const wallet = require('./routes/walletRoutes')
// const likes = require('./routes/likeRoutes')
// const comment = require('./routes/commentRoutes')
// const portfolio = require('./routes/portfolioRoutes')
// const sendEmail = require('')

//global middlewares
// set security http headers
app.use(helmet());

// development login
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// limit request from same ip
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'too many request for this ip,please try again in an hour',
});

app.use('/api', limiter);
app.use(cors({
  origin: '*',
}));

app.options('*', cors());


// body parser,reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// data saniization against noSql query injection
app.use(mongoSanitize());

// data saniization against xxs
app.use(xss());

// prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingAverage',
      'ratingQuantity',
      'maxGroupSize',
      'difficulty',
      'price'
    ],
  }),
);

// serving static files
app.use(express.static(`${__dirname}/public`));

// test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});


// app.use('/api/v1/users', users);
// app.use('/api/v1/post', post);;
// app.use('/api/v1/payment',payment)
// app.use('/api/v1/wallet',wallet)
// app.use('/api/v1/like',likes)
// app.use('/api/v1/comment',comment)
// app.use('/api/v1/portfolio',portfolio)



app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandlder);

module.exports = app;
