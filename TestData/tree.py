python
class Node:
    def __init__(self, data):
        self.data = data  
        self.left = None  
        self.right = None  

class BinaryTree:
    def __init__(self, root_data=None):
        if root_data is not None:
            self.root = Node(root_data)  
        else:
            self.root = None 

    def insert(self, data):
        
        if self.root is None:
            self.root = Node(data)
            return

        current = self.root
        while True:
            if data < current.data:
            
                if current.left is None:
                    current.left = Node(data)  
                    break
                current = current.left
            else:
                # Go to the right subtree
                if current.right is None:
                    current.right = Node(data)  
                    break
                current = current.right

    def inorder_traversal(self, node):
       
        if node is None:
            return
        
        self.inorder_traversal(node.left)  
        print(node.data, end=" ")  
        self.inorder_traversal(node.right) 

    def preorder_traversal(self, node):
       
        if node is None:
            return

        print(node.data, end=" ")  
        self.preorder_traversal(node.left) 
        self.preorder_traversal(node.right) 

    def postorder_traversal(self, node):
       
        if node is None:
            return

        self.postorder_traversal(node.left)  
        self.postorder_traversal(node.right)  
        print(node.data, end=" ")

tree = BinaryTree()
tree.insert(50)
tree.insert(30)
tree.insert(20)
tree.insert(40)
tree.insert(70)
tree.insert(60)
tree.insert(80)

print("In-order traversal:")
tree.inorder_traversal(tree.root)
print("\nPre-order traversal:")
tree.preorder_traversal(tree.root)
print("\nPost-order traversal:")
tree.postorder_traversal(tree.root)