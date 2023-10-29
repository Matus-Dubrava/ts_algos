// FIFO queue
// - array using push/shift methods
// - limit the number of concurrently running tasks
// - stores taskWrappers together with taskIds

// what is a taskWrapper
// - async function
// - uses the taskFactory to construct task
// - once the tasks is done
//      - decrement the number of running tasks
//      - call 'execute' again to execute next task in the queue
//      - on a failure, reject the task
//          - we can optinally retry, given retry limit

// taskFactory - a function that takes a taskId (number) and returns a new Promise

// 1. 'enqueue': enqueue task to queue, returns a promise
// 2. call execute task
// 3. 'execute':
// 4. check whether we are not at the limit of running tasks
// 5. pull task from a queue
// 6. increment number of running tasks
// 7. execute task

class TaskQueue {
    tasks: [number, () => Promise<any>][] = [];
    maxConcurrentTasks: number;
    runningTasks: number = 0;

    constructor(maxConcurrentTasks: number) {
        this.maxConcurrentTasks = maxConcurrentTasks;
    }

    async enqueue(id: number, retries: number = 3): Promise<any> {
        return new Promise(async (resolve, reject) => {
            let retriesLeft = retries;
            const taskWrapper = async () => {
                try {
                    const result = await taskFactory(id);
                    resolve(result);
                } catch (err) {
                    if (retriesLeft > 0) {
                        retriesLeft--;
                        console.log(
                            `retrying taks ${id} (${retriesLeft} retries left)`
                        );
                        await taskWrapper();
                    } else {
                        console.log(
                            `abandoning task ${id} after ${retries} failed attempts`
                        );
                        reject(id);
                    }
                } finally {
                    this.runningTasks--;
                    this.execute();
                }
            };
            this.tasks.push([id, taskWrapper]);
            this.execute();
        });
    }

    execute() {
        if (
            this.runningTasks < this.maxConcurrentTasks &&
            this.tasks.length > 0
        ) {
            const [id, taskWrapper] = this.tasks.shift()!;
            console.log(`executing task ${id}`);
            this.runningTasks++;
            taskWrapper();
        }
    }
}

function taskFactory(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
        const waitTime = Math.random() * 2000;
        setTimeout(() => {
            if (Math.random() < 0.75) {
                reject(id);
            } else {
                console.log(
                    `finished task ${id} in ${(waitTime / 1000).toFixed(2)}`
                );
                resolve(id);
            }
        }, waitTime);
    });
}

const queue = new TaskQueue(3);
for (let i = 0; i < 20; i++) {
    queue
        .enqueue(i)
        .then(() => console.log(`DONE: ${i}`))
        .catch(() => console.log(`FAILED: ${i}`));
}
