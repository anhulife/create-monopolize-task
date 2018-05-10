function createMonopolizeTask(task, onFulfilled, onRejected) {
  var curerntTaskId = 0;

  return function process() {
    var taskId = ++curerntTaskId;

    function execute(callback) {
      return function (result) {
        if (taskId === curerntTaskId) {
          callback(result);
        }
      };
    }

    task().then(
      execute(onFulfilled),
      execute(onRejected)
    );
  };
}

module.exports = createMonopolizeTask;
