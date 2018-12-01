const cloudwatchMetrics = require('cloudwatch-metrics');

const noop = () => {};

exports.create = (options = {}) => {
  const environmentName = options.environmentName || process.env.NODE_ENV || 'not set';
  const tagName = options.tagName || process.env.TAG_NAME || 'not set';
  const metricsSentCallback = options.metricsSentCallback || noop;
  const enabled = typeof options.enabled === 'undefined' ? true : !!options.enabled;
  const region = options.region || 'eu-west-1';

  cloudwatchMetrics.initialize({ region });

  const cloudwatchOptions = {
    enabled,
    sendCallback: metricsSentCallback,
  };

  return new cloudwatchMetrics.Metric(
    'API',
    'Milliseconds',
    [
      { Name: 'environment', Value: environmentName },
      { Name: 'tag', Value: tagName },
    ],
    cloudwatchOptions);
};

exports.createDimensions = request => {
  const { path } = request.route;
  const { statusCode } = request.response;

  return [
    {
      Name: 'path',
      Value: path,
    },
    {
      Name: 'statusCode',
      Value: `${statusCode}`,
    },
    {
      Name: 'method',
      Value: request.method,
    },
  ];
};