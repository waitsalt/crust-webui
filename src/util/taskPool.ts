class Node<T> {
  value: T;
  next: Node<T> | null;

  constructor(value: T) {
    this.value = value;
    this.next = null;
  }
}

class Queue<T> {
  private head: Node<T> | null;
  private tail: Node<T> | null;
  private size: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  enqueue(value: T): void {
    const node = new Node(value);
    if (this.tail) {
      this.tail.next = node;
    } else {
      this.head = node;
    }
    this.tail = node;
    this.size++;
  }

  dequeue(): T | null {
    if (!this.head) return null;
    const value = this.head.value;
    this.head = this.head.next;
    if (!this.head) {
      this.tail = null;
    }
    this.size--;
    return value;
  }

  isEmpty(): boolean {
    return this.size === 0;
  }
}

type Task = {
  taskFn: () => Promise<void>; // 任务函数
};

class TaskPool {
  private limit: number;
  private queue: Queue<Task>;
  private running: number;

  constructor(limit: number = 5) {
    this.limit = limit;
    this.queue = new Queue();
    this.running = 0;
  }

  add(taskFn: () => Promise<void>): void {
    this.queue.enqueue({ taskFn });
    this.run();
  }

  private run(): void {
    while (this.running < this.limit && !this.queue.isEmpty()) {
      const task = this.queue.dequeue();
      if (task) {
        this.running++;
        this.executeTask(task);
      }
    }
  }

  private executeTask(task: Task): void {
    task
      .taskFn()
      .catch((error) => {
        console.error("Task failed:", error);
      })
      .finally(() => {
        this.running--;
        this.run(); // 继续执行下一个任务
      });
  }

  async waitForCompletion(): Promise<void> {
    // 等待所有任务完成
    while (this.running > 0 || !this.queue.isEmpty()) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

  }
}

export { Queue, TaskPool };
