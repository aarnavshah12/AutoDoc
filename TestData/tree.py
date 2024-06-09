python
class Node:
    def __init__(self, data):
        self.data = data  # Initialize the node's data
        self.left = None  # Initialize the left child as None
        self.right = None  # Initialize the right child as None

class BinaryTree:
    def __init__(self, root_data=None):
        if root_data is not None:
            self.root = Node(root_data)  # Create the root node if root_data is given
        else:
            self.root = None  # Initialize root as None if no root_data is provided

    def insert(self, data):
        """
        Inserts a node into the binary tree following the binary search tree property.
        """
        if self.root is None:
            self.root = Node(data)  # If tree is empty, create the root node
            return

        current = self.root
        while True:
            if data < current.data:
                # Go to the left subtree
                if current.left is None:
                    current.left = Node(data)  # Insert new node as left child
                    break
                current = current.left
            else:
                # Go to the right subtree
                if current.right is None:
                    current.right = Node(data)  # Insert new node as right child
                    break
                current = current.right

    def inorder_traversal(self, node):
        """
        Performs an in-order traversal of the binary tree.
        Visits nodes in the order: left subtree, root, right subtree.
        """
        if node is None:
            return
        
        self.inorder_traversal(node.left)  # Traverse the left subtree
        print(node.data, end=" ")  # Visit the root node
        self.inorder_traversal(node.right)  # Traverse the right subtree

    def preorder_traversal(self, node):
        """
        Performs a pre-order traversal of the binary tree.
        Visits nodes in the order: root, left subtree, right subtree.
        """
        if node is None:
            return

        print(node.data, end=" ")  # Visit the root node
        self.preorder_traversal(node.left)  # Traverse the left subtree
        self.preorder_traversal(node.right)  # Traverse the right subtree

    def postorder_traversal(self, node):
        """
        Performs a post-order traversal of the binary tree.
        Visits nodes in the order: left subtree, right subtree, root.
        """
        if node is None:
            return

        self.postorder_traversal(node.left)  # Traverse the left subtree
        self.postorder_traversal(node.right)  # Traverse the right subtree
        print(node.data, end=" ")  # Visit the root node

# Example usage:
tree = BinaryTree()
# Insert nodes into the binary tree
tree.insert(50)
tree.insert(30)
tree.insert(20)
tree.insert(40)
tree.insert(70)
tree.insert(60)
tree.insert(80)

# Perform different tree traversals
print("In-order traversal:")
tree.inorder_traversal(tree.root)
print("\nPre-order traversal:")
tree.preorder_traversal(tree.root)
print("\nPost-order traversal:")
tree.postorder_traversal(tree.root)