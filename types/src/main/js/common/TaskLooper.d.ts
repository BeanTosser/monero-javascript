export = TaskLooper;
/**
 * Run a task in a fixed period loop.
 */
declare class TaskLooper {
    /**
     * Build the looper with a function to invoke on a fixed period loop.
     *
     * @param {function} fn - the function to invoke
     */
    constructor(fn: Function);
    fn: Function;
    /**
     * Start the task loop.
     *
     * @@param {number} periodInMs the loop period in milliseconds
     */
    start(periodInMs: number): void;
    isStarted: boolean;
    /**
     * Stop the task loop.
     */
    stop(): void;
    _runLoop(periodInMs: any): Promise<void>;
    isLooping: boolean;
}
