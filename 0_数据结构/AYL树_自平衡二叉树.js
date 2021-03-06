// AVL树是一种自平衡树。添加或移除节点时，AVL树会尝试保持自平衡。任意一个节点（不论
// 深度）的左子树和右子树高度最多相差 1。添加或移除节点时，AVL树会尽可能尝试转换为完全树。


// 计算节点高度，最低是0，右-左
// 节点的高度是从节点到其任意子节点的边的最大值。
// function getNodeHeight(node){ 
//   if (node == null) { 
//   return -1; 
//   } 
//   return Math.max(  this.getNodeHeight(node.left), this.getNodeHeight(node.right) ) + 1; 
// }

/*
在 AVL 树中，需要对每个节点计算右子树高度（hr）和左子树高度（hl）之间的差值，该
值（左高-右高）应为 0、1 或 -1。如果结果不是这三个值之一，则需要平衡该 AVL 树。这就是平衡
因子的概念。
*/  


// * 左-左（LL）：左重    向右的单旋转   子节点向左
// function rotationLL(node){ 
//   const tmp = node.left;  
//   node.left = tmp.right; 
//   tmp.right = node;  
//   return tmp; 
//  }


// * 右-右（RR）：  右重   向左的单旋转  子节点向右
// function rotationRR(node) { 
//   const tmp = node.right; // {1} 
//   node.right = tmp.left; // {2} 
//   tmp.left = node; // {3} 
//   return tmp; 
//  }

// * 左-右（LR）：先转为左重，再LL   ， 向右的双旋转
// function rotationLR(node) { 
//   node.left = this.rotationRR(node.left); 
//   return this.rotationLL(node); 
//  }

// * 右- 左（RL）：先转为右重，再RR 向左的双旋转

// function rotationRL(node) { 
//   node.right = this.rotationLL(node.right); 
//   return this.rotationRR(node); 
//  }



const Compare = {
  LESS_THAN: -1,
  BIGGER_THAN: 1,
  EQUALS: 0
};
class Node {
  constructor(data) {
          // this.root = this //根节点
          this.data = data //当前数据
          this.left = null //左子树
          this.right = null //右子树
        }
  toString() {
    return `${this.data}`;
  }
}


const BalanceFactor = {
  unbalance_right: 1,
  s_unbalance_right: 2,
  balance: 3,
  s_unbalance_left: 4,
  unbalance_left: 5
};

class AVLTree {
  constructor() {
    this.root = null;
  }
  getNodeHeight(node) {
    if (node == null) {
      return -1;
    }
    return Math.max(this.getNodeHeight(node.left), this.getNodeHeight(node.right)) + 1;
  }
  /**
   * Left left case: rotate right
   *
   *       b                           a
   *      / \                         / \
   *     a   e -> rotationLL(b) ->   c   b
   *    / \                             / \
   *   c   d                           d   e
   *
   * @param node Node<T>
   */
  rotationLL(node) {
    const tmp = node.left;
    node.left = tmp.right;
    tmp.right = node;
    return tmp;
  }
  /**
   * Right right case: rotate left
   *
   *     a                              b
   *    / \                            / \
   *   c   b   -> rotationRR(a) ->    a   e
   *      / \                        / \
   *     d   e                      c   d
   *
   * @param node Node<T>
   */
  rotationRR(node) {
    const tmp = node.right;
    node.right = tmp.left;
    tmp.left = node;
    return tmp;
  }

  rotationLR(node) {
    node.left = this.rotationRR(node.left);
    return this.rotationLL(node);
  }

  rotationRL(node) {
    node.right = this.rotationLL(node.right);
    return this.rotationRR(node);
  }
  getBalanceFactor(node) {
    const heightDifference = this.getNodeHeight(node.left) - this.getNodeHeight(node.right);
    switch (heightDifference) {
      case -2:
        return BalanceFactor.unbalance_right;
      case -1:
        return BalanceFactor.s_unbalance_right;
      case 1:
        return BalanceFactor.s_unbalance_left;
      case 2:
        return BalanceFactor.unbalance_left;
      default:
        return BalanceFactor.balance;
    }
  }
    //最小值----在左树上最左的点
    getMin(node) {
    const minNode = (node) => {
      return node ? (node.left ? minNode(node.left) : node) : null
    }
    return minNode(node || this.root)
  }
  //最大值----在右树上最右的点
  getMax(node) {
    const maxNode = (node) => {
      return node ? (node.right ? maxNode(node.right) : node) : null
    }
    return maxNode(node || this.root)
  }

    //查找特定值
    find(data) {
    const findNode = (node, data) => {
      if (node === null) return false
      if (node.data === data) return node
      // 没有的话继续迭代，判断：小值的话继续找左树，大值的话继续找右树
      return findNode(data < node.data ? node.left : node.right, data)
    }
    return findNode(this.root, data)
  }
  insert(data) {
    this.root = this.insertNode(this.root, data);
  }
  insertNode(node, data) {
    // 像在 BST 树中一样插入节点
    if (node === null) {
      return new Node(data);
    } else if (data< node.data) {
      // 向左树插入
      node.left = this.insertNode(node.left, data);
    } else if (data> node.data) {
      // 向右边插入
      node.right = this.insertNode(node.right, data);
    } else {
      return node; // 插入重复的值
    }


    //  如果需要，将树进行平衡操作
    const balanceFactor = this.getBalanceFactor(node);
    // 左树重
    if (balanceFactor === BalanceFactor.unbalance_left) {
      if (data< node.data) {
        // 向左树插入，左树更重
        node = this.rotationLL(node);
      } else {
         // 向右树插入，右树更重
        return this.rotationLR(node);
      }
    }
    // 右树重
    if (balanceFactor === BalanceFactor.unbalance_right) {
      if ( data>node.data) {
        // 向左树插入，左树更重
        node = this.rotationRR(node);
      } else {
         // 向右树插入，右树更重
        return this.rotationRL(node);
      }
    }
    return node;
  }
  remove(data) {
            // 找1
          const removeNode = (node, data) => {
            if (this.find(data) === false) {
              return null
            }
            // 若小于，左树找
            if (data < node.data) {
              node.left = removeNode(node.left, data)
              return node
            //   若大于， 右树找
            } else if (data> node.data) {
              node.right = removeNode(node.right, data)
              return node
            } else {
              // 键等于 node.data
              // 第一种情况---删除子节点
              if (node.left == null && node.right == null) {
                node = null
                return node
              }
              // 第二种情况---- 删除的结点有右树
              if (node.left == null) {
                node = node.right
                return node
                // 删除的结点有左树
              } else if (node.right == null) {
                node = node.left
                return node
              }
              // 第三种情况----删除的结点左右树都有
              const temp = this.getMin(node.right)
              node.data = temp.data
              node.right = removeNode(node.right, temp.data)
              return node
            }
          }
          return removeNode(this.root, data)
        }
  

  removeNode1(node, key) {
   node=this.remove(node)
    if (node == null) {
      return node;
    }
    // remove完成后校验并且自平衡
    const balanceFactor = this.getBalanceFactor(node);
    // 左重
    if (balanceFactor === BalanceFactor.unbalance_left) {
      if (
        this.getBalanceFactor(node.left) === BalanceFactor.balance ||
        this.getBalanceFactor(node.left) === BalanceFactor.s_unbalance_left
      ) {
        return this.rotationLL(node);
      }
      if (this.getBalanceFactor(node.left) === BalanceFactor.s_unbalance_right) {
        return this.rotationLR(node.left);
      }
    }
    // 右重
    if (balanceFactor === BalanceFactor.unbalance_right) {
      if (
        this.getBalanceFactor(node.right) === BalanceFactor.balance ||
        this.getBalanceFactor(node.right) === BalanceFactor.s_unbalance_right
      ) {
        return this.rotationRR(node);
      }
      // 左重
      if (this.getBalanceFactor(node.right) === BalanceFactor.s_unbalance_left) {
        return this.rotationRL(node.right);
      }
    }
    return node;
  }


};



const tree = new AVLTree()
      tree.insert(1)
      tree.insert(2)
      tree.insert(3)
      tree.insert(4)
      tree.insert(5)
      tree.insert(6)
      tree.insert(7)
      tree.insert(8)
      tree.removeNode1(4)
      // tree.insert(10)
      // tree.insert(13)
      // tree.insert(12)
      // tree.insert(14)
      // tree.insert(20)

      console.log(tree);


/*   自平衡二叉树结果
                 4
               /   \
              2     6
             / \   / \
            1   3 5   7
                       \
                        8
        
删除4后
      5
    /   \
   2     6
  / \   / \
 1   3  7  8
*/