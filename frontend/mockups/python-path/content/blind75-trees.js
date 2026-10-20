import { problem as p, cases as c } from './problem.js'
import { check } from './lesson.js'

export default [
  p(104,'maxDepth','root','Return a binary tree depth, counting nodes on its longest root-to-leaf path. An empty tree has depth 0.',`if not root: return 0
return 1+max(self.maxDepth(root.left),self.maxDepth(root.right))`,c('maxDepth',[['tree_from([3,9,20,None,None,15,7])','3'],['None','0'],['tree_from([1])','1']])),
  p(100,'isSameTree','p, q','Return whether two trees have the same values in the same structure.',`if not p or not q: return p is q
return p.val==q.val and self.isSameTree(p.left,q.left) and self.isSameTree(p.right,q.right)`,c('isSameTree',[['tree_from([1,2,3]),tree_from([1,2,3])','True'],['tree_from([1,2]),tree_from([1,None,2])','False'],['None,None','True']])),
  p(226,'invertTree','root','Swap left and right children at every node and return the resulting root.',`if root:
    root.left,root.right=self.invertTree(root.right),self.invertTree(root.left)
return root`,[check('Inverted structure','assert tree_values(Solution().invertTree(tree_from([4,2,7,1,3,6,9])))==[4,7,2,9,6,3,1]'),check('Empty tree','assert Solution().invertTree(None) is None')]),
  p(124,'maxPathSum','root','Return the maximum sum of a nonempty path in a nonempty binary tree. A path may start/end anywhere but cannot branch or revisit a node.',`best=-float('inf')
def gain(node):
    nonlocal best
    if node is None: return 0
    left=max(0,gain(node.left)); right=max(0,gain(node.right))
    best=max(best,node.val+left+right)
    return node.val+max(left,right)
gain(root)
return best`,c('maxPathSum',[['tree_from([-10,9,20,None,None,15,7])','42'],['tree_from([-3])','-3'],['tree_from([1,2,3])','6']])),
  p(102,'levelOrder','root','Return a list of levels, with node values from left to right within each level.',`answer=[]
queue=deque([root] if root else [])
while queue:
    row=[]
    for _ in range(len(queue)):
        node=queue.popleft(); row.append(node.val)
        if node.left: queue.append(node.left)
        if node.right: queue.append(node.right)
    answer.append(row)
return answer`,c('levelOrder',[['tree_from([3,9,20,None,None,15,7])','[[3],[9,20],[15,7]]'],['None','[]']])),
  p(297,'serialize','root','Implement Codec.serialize(root) returning text and Codec.deserialize(text) rebuilding the tree. Round-trip values and missing-child structure with no retained instance state.', '',[check('Round-trip structure across instances','for values in [[],[1],[1,None,2,3],[-1,-2,3]]:\n    source=tree_from(values)\n    encoded=Codec().serialize(source)\n    assert type(encoded) is str\n    decoded=Codec().deserialize(encoded)\n    assert tree_values(decoded)==tree_values(source)\n    if source: assert decoded is not source')],{
    initialFiles:{'main.py':'class Codec:\n    def serialize(self, root):\n        pass\n\n    def deserialize(self, text):\n        pass\n'},
    solutionFiles:{'main.py':`class Codec:
    def serialize(self,root):
        values=[]
        queue=deque([root])
        while queue:
            node=queue.popleft()
            if node is None: values.append(None)
            else:
                values.append(node.val)
                queue.extend((node.left,node.right))
        return json.dumps(values)
    def deserialize(self,text):
        values=json.loads(text)
        if not values or values[0] is None: return None
        root=TreeNode(values[0]); queue=deque([root]); index=1
        while queue and index<len(values):
            node=queue.popleft()
            for side in ('left','right'):
                if index<len(values) and values[index] is not None:
                    child=TreeNode(values[index]); setattr(node,side,child); queue.append(child)
                index+=1
        return root`},
  }),
  p(572,'isSubtree','root, subRoot','Return whether root contains a node whose complete subtree equals subRoot in structure and values. An empty subRoot is accepted here.',`def same(a,b):
    if not a or not b: return a is b
    return a.val==b.val and same(a.left,b.left) and same(a.right,b.right)
if not subRoot: return True
if not root: return False
return same(root,subRoot) or self.isSubtree(root.left,subRoot) or self.isSubtree(root.right,subRoot)`,c('isSubtree',[['tree_from([3,4,5,1,2]),tree_from([4,1,2])','True'],['tree_from([3,4,5,1,2,None,None,None,None,0]),tree_from([4,1,2])','False']])),
  p(105,'buildTree','preorder, inorder','Reconstruct a binary tree from matching preorder and inorder traversals with unique values. Return its root.',`positions={value:index for index,value in enumerate(inorder)}
index=0
def build(lo,hi):
    nonlocal index
    if lo>=hi: return None
    value=preorder[index]; index+=1
    mid=positions[value]
    node=TreeNode(value)
    node.left=build(lo,mid); node.right=build(mid+1,hi)
    return node
return build(0,len(inorder))`,[check('Reconstructed tree','assert tree_values(Solution().buildTree([3,9,20,15,7],[9,3,15,20,7]))==[3,9,20,None,None,15,7]'),check('Empty and one node','assert Solution().buildTree([],[]) is None\nassert tree_values(Solution().buildTree([-1],[-1]))==[-1]')]),
  p(98,'isValidBST','root','Return whether every node strictly satisfies all ancestor BST bounds. Duplicate values are invalid.',`def valid(node,low,high):
    if not node: return True
    return low<node.val<high and valid(node.left,low,node.val) and valid(node.right,node.val,high)
return valid(root,-float('inf'),float('inf'))`,c('isValidBST',[['tree_from([2,1,3])','True'],['tree_from([5,1,4,None,None,3,6])','False'],['tree_from([5,4,6,None,None,3,7])','False'],['tree_from([2,2,3])','False']])),
  p(230,'kthSmallest','root, k','Return the kth smallest value in a BST, counting k from 1. The tree and k are valid.',`stack=[]
while root or stack:
    while root: stack.append(root); root=root.left
    root=stack.pop(); k-=1
    if k==0: return root.val
    root=root.right`,c('kthSmallest',[['tree_from([3,1,4,None,2]),1','1'],['tree_from([5,3,6,2,4,None,None,1]),3','3'],['tree_from([1]),1','1']])),
  p(235,'lowestCommonAncestor','root, p, q','Return the existing node that is the lowest common ancestor of the supplied distinct nodes in a BST.',`while root:
    if p.val<root.val and q.val<root.val: root=root.left
    elif p.val>root.val and q.val>root.val: root=root.right
    else: return root`,[check('Split and ancestor cases use existing nodes','root=tree_from([6,2,8,0,4,7,9,None,None,3,5])\nassert Solution().lowestCommonAncestor(root,root.left,root.right) is root\nassert Solution().lowestCommonAncestor(root,root.left,root.left.right) is root.left')]),
  p(208,'insert','word','Implement Trie with insert(word), search(word) and startsWith(prefix). A prefix alone is not a stored word.', '',[check('Words versus prefixes','t=Trie()\nt.insert("apple")\nassert t.search("apple") is True and t.search("app") is False\nassert t.startsWith("app") is True\nt.insert("app")\nassert t.search("app") is True\nassert t.startsWith("z") is False')],{
    initialFiles:{'main.py':'class Trie:\n    def __init__(self):\n        pass\n    def insert(self, word):\n        pass\n    def search(self, word):\n        pass\n    def startsWith(self, prefix):\n        pass\n'},
    solutionFiles:{'main.py':`class Trie:
    def __init__(self): self.root={}
    def insert(self,word):
        node=self.root
        for char in word: node=node.setdefault(char,{})
        node['$']=True
    def find(self,text):
        node=self.root
        for char in text:
            if char not in node: return None
            node=node[char]
        return node
    def search(self,word):
        node=self.find(word)
        return node is not None and '$' in node
    def startsWith(self,prefix): return self.find(prefix) is not None`},
  }),
  p(211,'addWord','word','Implement WordDictionary.addWord(word) and search(pattern). A dot in the pattern matches exactly one character.', '',[check('Wildcard and literal searches','d=WordDictionary()\nfor word in ["bad","dad","mad"]: d.addWord(word)\nassert d.search("pad") is False\nassert d.search("bad") is True\nassert d.search(".ad") is True\nassert d.search("b..") is True\nassert d.search("..") is False')],{
    initialFiles:{'main.py':'class WordDictionary:\n    def __init__(self):\n        pass\n    def addWord(self, word):\n        pass\n    def search(self, pattern):\n        pass\n'},
    solutionFiles:{'main.py':`class WordDictionary:
    def __init__(self): self.root={}
    def addWord(self,word):
        node=self.root
        for char in word: node=node.setdefault(char,{})
        node['$']=True
    def search(self,pattern):
        def find(index,node):
            if index==len(pattern): return '$' in node
            char=pattern[index]
            if char=='.': return any(find(index+1,child) for key,child in node.items() if key!='$')
            return char in node and find(index+1,node[char])
        return find(0,self.root)`},
  }),
  p(212,'findWords','board, words','Return each word found by an orthogonally adjacent path on the board, without reusing a cell within a word. Return each word at most once; ordering does not matter.',`root={}
for word in words:
    node=root
    for char in word: node=node.setdefault(char,{})
    node['$']=word
found=set(); seen=set()
rows,cols=len(board),len(board[0]) if board else 0
def visit(r,c,node):
    if not (0<=r<rows and 0<=c<cols) or (r,c) in seen or board[r][c] not in node: return
    node=node[board[r][c]]
    if '$' in node: found.add(node['$'])
    seen.add((r,c))
    for nr,nc in ((r+1,c),(r-1,c),(r,c+1),(r,c-1)): visit(nr,nc,node)
    seen.remove((r,c))
for r in range(rows):
    for col in range(cols): visit(r,col,root)
return list(found)`,[check('Find multiple words','board=[["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]]\nassert sorted(Solution().findWords(board,["oath","pea","eat","rain"]))==["eat","oath"]'),check('No repeated cell or duplicate word','assert Solution().findWords([["a","a"]],["aaa"])==[]\nassert Solution().findWords([["a"]],["a"])==["a"]')]),
  p(347,'topKFrequent','nums, k','Return the k most frequent values, in any order. Fixtures have no frequency tie at the cutoff.',`counts=Counter(nums)
return heapq.nlargest(k,counts,key=counts.get)`,[check('Top frequencies','assert set(Solution().topKFrequent([1,1,1,2,2,3],2))=={1,2}'),check('One value','assert Solution().topKFrequent([4],1)==[4]')]),
  p(295,'addNum','num','Implement MedianFinder.addNum(num) and findMedian(), returning the median after insertions. findMedian is only called with a nonempty stream.', '',[check('Odd and even sizes','m=MedianFinder()\nm.addNum(1)\nm.addNum(2)\nassert m.findMedian()==1.5\nm.addNum(3)\nassert m.findMedian()==2'),check('Negative numbers and duplicates','m=MedianFinder()\nfor value in [-2,-2,8,10]: m.addNum(value)\nassert m.findMedian()==3')],{
    initialFiles:{'main.py':'class MedianFinder:\n    def __init__(self):\n        pass\n    def addNum(self, num):\n        pass\n    def findMedian(self):\n        pass\n'},
    solutionFiles:{'main.py':`class MedianFinder:
    def __init__(self): self.low=[]; self.high=[]
    def addNum(self,num):
        heapq.heappush(self.low,-num)
        heapq.heappush(self.high,-heapq.heappop(self.low))
        if len(self.high)>len(self.low): heapq.heappush(self.low,-heapq.heappop(self.high))
    def findMedian(self):
        if len(self.low)>len(self.high): return -self.low[0]
        return (-self.low[0]+self.high[0])/2`},
  }),
]
