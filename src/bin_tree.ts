class MyNode {
    value: number;
    depth: number;
    left?: MyNode;
    right?: MyNode;

    constructor(value: number, depth: number) {
        this.value = value;
        this.depth = depth;
    }

    insert(value: number, depth: number): Error | undefined {
        if (value < this.value) {
            if (this.left) {
                return this.left.insert(value, depth + 1);
            } else {
                this.left = new MyNode(value, depth);
            }
        } else if (value > this.value) {
            if (this.right) {
                return this.right.insert(value, depth + 1);
            } else {
                this.right = new MyNode(value, depth);
            }
        } else {
            return Error(`duplicate value insertion '${value}'`);
        }
    }

    traverse() {
        if (this.left) {
            this.left.traverse();
        }
        console.log(`${'\t'.repeat(this.depth)}${this.value}`);
        if (this.right) {
            this.right.traverse();
        }
    }

    min(): number {
        if (this.left) {
            return this.left.min();
        }
        return this.value;
    }

    max(): number {
        if (this.right) {
            return this.right.max();
        }
        return this.value;
    }

    find(value: number): MyNode | undefined {
        if (this.value === value) {
            return this;
        } else if (value < this.value) {
            return this.left?.find(value);
        } else if (value > this.value) {
            return this.right?.find(value);
        }
    }

    isSubtree(other: MyNode): boolean {
        if (this.value !== other.value) {
            return false;
        }

        let isValid = true;

        if (other.left) {
            if (!this.left) {
                isValid = false;
            } else {
                isValid = isValid && this.left.isSubtree(other.left);
            }
        }

        if (other.right) {
            if (!this.right) {
                isValid = false;
            } else {
                isValid = isValid && this.right.isSubtree(other.right);
            }
        }

        return isValid;
    }
}

class Tree {
    root?: MyNode;
    errors: Error[] = [];
    nNodes: number = 0;

    insert(value: number) {
        if (this.root) {
            const maybeErr = this.root.insert(value, 1);
            if (maybeErr) {
                this.errors.push(maybeErr);
            } else {
                this.nNodes++;
            }
        } else {
            this.root = new MyNode(value, 0);
            this.nNodes++;
        }
    }

    traverse() {
        if (this.root) {
            this.root.traverse();
        }
    }

    checkErrors() {
        this.errors.forEach((err) => console.log(err.message));
    }

    min(): number | undefined {
        if (this.root) {
            return this.root.min();
        }
    }

    max(): number | undefined {
        if (this.root) {
            return this.root.max();
        }
    }

    bfs() {
        const queue: MyNode[] = [];
        if (this.root) {
            queue.push(this.root);
        }

        while (queue.length) {
            const curNode = queue.shift();
            console.log(curNode!.value);
            if (curNode!.left) {
                queue.push(curNode!.left);
            }
            if (curNode!.right) {
                queue.push(curNode!.right);
            }
        }
    }

    find(value: number): MyNode | undefined {
        if (this.root) {
            return this.root.find(value);
        }
    }
}

function isSubtree(tree: Tree, subtree: Tree): boolean {
    console.log(
        `comparing, tree1: #${tree.nNodes} nodes, tree2: #${subtree.nNodes} nodes`
    );
    if (!subtree.root) {
        return true;
    }

    const root = tree.find(subtree.root.value);
    if (!root) {
        return false;
    }

    if (tree.nNodes < subtree.nNodes) {
        return false;
    }

    return root.isSubtree(subtree.root);
}

const values = [10, 4, 5, 1, 20, 15, 25, 10, 5, 30, 23, 16, 100, 1000];
const tree = new Tree();
values.forEach((v) => tree.insert(v));
tree.checkErrors();
tree.traverse();
tree.bfs();
console.log(`tree min: ${tree.min()}`);
console.log(`tree max: ${tree.max()}`);
console.log(tree.find(11));

const tree2 = new Tree();
const values2 = [20, 15, 16, 25, 23];
values2.forEach((v) => tree2.insert(v));

console.log(isSubtree(tree, tree2));

// subtree has N nodes => words case O(n)
