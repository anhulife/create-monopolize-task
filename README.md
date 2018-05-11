# create-monopolize-task

创建可独占重复执行的任务

```javascript
let count = 0;
function asyncTask() {
    return new Promise((resolve) => {
        setTimeout(() => resolve(++count), 500);
    });
}

function onFulfilled(value) {
    console.log('task count is ${value}');
}

function onRejected(error) {
    console.error(error);
}

const newTask = createMonopolizeTask(asyncTask, onFulfilled, onRejected);

newTask();

setTimeout(newTask, 200);

// task count is 2
```

