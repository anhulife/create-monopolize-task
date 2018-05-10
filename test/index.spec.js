var delay = require('delay');

var createMonopolizeTask = require('..');

const TASK_DURATION = 50;

describe('独占任务', () => {
  it('独占任务，应该可以正常单次执行', async () => {
    const task = () => new Promise(resolve => resolve('hello, world'));
    const onFulfilled = jest.fn();
    const onRejected = jest.fn();

    const newTask = createMonopolizeTask(task, onFulfilled, onRejected);
    newTask();

    await delay(0);

    expect(onFulfilled).toBeCalledWith('hello, world');
  });

  it('独占任务，在连续两次时应该以第二次的结果为准', async () => {
    let count = 0;
    const task = () => new Promise(resolve => resolve(`count is ${++count}`));
    const onFulfilled = jest.fn();
    const onRejected = jest.fn();

    const newTask = createMonopolizeTask(task, onFulfilled, onRejected);

    // 第一次执行
    newTask();
    // 第二次执行
    newTask();

    // 等待执行完成
    await delay(0);

    expect(onFulfilled).toBeCalledWith('count is 2');
  });

  it('独占任务，在上一次执行未完成时继续执行应该以第二次的结果为准', async () => {
    let count = 0;
    const task = () => new Promise(resolve => setTimeout(() => resolve(`count is ${++count}`), TASK_DURATION));
    const onFulfilled = jest.fn();
    const onRejected = jest.fn();

    const newTask = createMonopolizeTask(task, onFulfilled, onRejected);

    // 第一次执行
    newTask();

    // 未等待第一次执行完成
    await delay(40);

    // 第二次执行
    newTask();

    // 等待执行完成
    await delay(TASK_DURATION);

    expect(onFulfilled).toBeCalledWith('count is 2');
  });

  it('独占任务，在上次执行完成后应该可以正常处理后续的执行指令', async () => {
    let count = 0;
    const task = () => new Promise(resolve => setTimeout(() => resolve(`count is ${++count}`), TASK_DURATION));
    const onFulfilled = jest.fn();
    const onRejected = jest.fn();

    const newTask = createMonopolizeTask(task, onFulfilled, onRejected);

    // 第一次执行
    newTask();
    // 等待第一次执行完成
    await delay(TASK_DURATION);

    expect(onFulfilled).toBeCalledWith('count is 1');

    // 第二次执行
    newTask();
    // 等待第二次执行完成
    await delay(TASK_DURATION);

    expect(onFulfilled).toBeCalledWith('count is 2');
  });
});
