const { resolve } = require("./utils");

const cacheLoader = {
  loader: "cache-loader",
  options: {
    cacheDirectory: resolve(".cache-loader"),
  },
};

const threadLoader = (workParallelJobs) => {
  const options = { workParallelJobs };

  Object.assign(options, { poolTimeout: 2000 });

  return { loader: "thread-loader", options };
};

module.exports = {
  cacheLoader,
  threadLoader,
};
