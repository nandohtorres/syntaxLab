import { problem as p, cases as c } from './problem.js'
import { check } from './lesson.js'

export default [
  p(133,'cloneGraph','node','Deep-copy the connected graph reachable from node. Node(val, neighbors) is supplied. Cloned nodes must not be original objects.',`if node is None: return None
copies={node:Node(node.val)}
queue=deque([node])
while queue:
    current=queue.popleft()
    for neighbor in current.neighbors:
        if neighbor not in copies:
            copies[neighbor]=Node(neighbor.val)
            queue.append(neighbor)
        copies[current].neighbors.append(copies[neighbor])
return copies[node]`,[check('Structure and deep copy','source=graph_from([[2,4],[1,3],[2,4],[1,3]])\nclone=Solution().cloneGraph(source)\nassert graph_values(clone)==graph_values(source)\nassert graph_nodes(clone).isdisjoint(graph_nodes(source)), "Every cloned node must be new"'),check('Empty and isolated graph','assert Solution().cloneGraph(None) is None\na=Node(1)\nb=Solution().cloneGraph(a)\nassert b is not a and b.val==1 and b.neighbors==[]')]),
  p(207,'canFinish','numCourses, prerequisites','Pairs [course, prerequisite] require the prerequisite first. Return whether all courses can be completed.',`adj=[[] for _ in range(numCourses)]
degree=[0]*numCourses
for course,before in prerequisites:
    adj[before].append(course)
    degree[course]+=1
queue=deque(i for i in range(numCourses) if degree[i]==0)
count=0
while queue:
    current=queue.popleft()
    count+=1
    for after in adj[current]:
        degree[after]-=1
        if degree[after]==0: queue.append(after)
return count==numCourses`,c('canFinish',[['2,[[1,0]]','True'],['2,[[1,0],[0,1]]','False'],['3,[]','True'],['1,[[0,0]]','False']])),
  p(417,'pacificAtlantic','heights','Return [row,col] cells from which water can reach both the top/left boundary and bottom/right boundary. Water moves orthogonally to equal or lower heights. Result order is irrelevant.',`if not heights: return []
rows,cols=len(heights),len(heights[0])
def reach(starts):
    seen=set(starts)
    stack=list(seen)
    while stack:
        r,c=stack.pop()
        for nr,nc in ((r+1,c),(r-1,c),(r,c+1),(r,c-1)):
            if 0<=nr<rows and 0<=nc<cols and (nr,nc) not in seen and heights[nr][nc]>=heights[r][c]:
                seen.add((nr,nc))
                stack.append((nr,nc))
    return seen
pacific=reach([(r,0) for r in range(rows)]+[(0,c) for c in range(cols)])
atlantic=reach([(r,cols-1) for r in range(rows)]+[(rows-1,c) for c in range(cols)])
return [list(cell) for cell in pacific & atlantic]`,[check('Both boundaries','grid=[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]\nanswer=Solution().pacificAtlantic(grid)\nassert sorted(map(tuple,answer))==[(0,4),(1,3),(1,4),(2,2),(3,0),(3,1),(4,0)]'),check('Single cell','assert Solution().pacificAtlantic([[7]])==[[0,0]]')]),
  p(200,'numIslands','grid','Count orthogonally connected groups of "1" cells in a grid of "0"/"1" strings.',`if not grid: return 0
rows,cols=len(grid),len(grid[0])
seen=set()
count=0
for r in range(rows):
    for c in range(cols):
        if grid[r][c]!='1' or (r,c) in seen: continue
        count+=1
        stack=[(r,c)]
        seen.add((r,c))
        while stack:
            x,y=stack.pop()
            for nx,ny in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
                if 0<=nx<rows and 0<=ny<cols and grid[nx][ny]=='1' and (nx,ny) not in seen:
                    seen.add((nx,ny)); stack.append((nx,ny))
return count`,c('numIslands',[['[["1","1","0"],["0","1","0"],["1","0","1"]]','3'],['[["0"]]','0'],['[["1"]]','1'],['[]','0']])),
  p(128,'longestConsecutive','nums','Return the length of the longest run of consecutive integer values, irrespective of input order. Duplicates do not extend it.',`values=set(nums)
best=0
for start in values:
    if start-1 in values: continue
    end=start
    while end in values: end+=1
    best=max(best,end-start)
return best`,c('longestConsecutive',[['[100,4,200,1,3,2]','4'],['[1,2,0,1]','3'],['[]','0']])),
  p(269,'alienOrder','words','Words are sorted by an unknown alphabet. Return any ordering containing all distinct characters that makes the words sorted. Return "" for an invalid prefix or cycle.',`adj={char:set() for word in words for char in word}
degree={char:0 for char in adj}
for a,b in zip(words,words[1:]):
    if len(a)>len(b) and a.startswith(b): return ''
    for x,y in zip(a,b):
        if x!=y:
            if y not in adj[x]: adj[x].add(y); degree[y]+=1
            break
queue=deque(char for char in degree if degree[char]==0)
answer=[]
while queue:
    char=queue.popleft(); answer.append(char)
    for after in adj[char]:
        degree[after]-=1
        if degree[after]==0: queue.append(after)
return ''.join(answer) if len(answer)==len(degree) else ''`,[check('Any valid alphabet accepted','for words in [["wrt","wrf","er","ett","rftt"],["ab","ac"],["z"]]:\n    answer=Solution().alienOrder(words)\n    chars=set("".join(words))\n    assert len(answer)==len(chars) and set(answer)==chars\n    positions={char:i for i,char in enumerate(answer)}\n    for a,b in zip(words,words[1:]):\n        for x,y in zip(a,b):\n            if x!=y:\n                assert positions[x]<positions[y]\n                break'),check('Invalid prefix and cycle','assert Solution().alienOrder(["abc","ab"])==""\nassert Solution().alienOrder(["z","x","z"])==""')]),
  p(261,'validTree','n, edges','Return whether an undirected graph on vertices 0..n-1 is a single tree. Assume n >= 1.',`if len(edges)!=n-1: return False
adj=[[] for _ in range(n)]
for a,b in edges: adj[a].append(b); adj[b].append(a)
seen=set()
stack=[0]
while stack:
    node=stack.pop()
    if node in seen: continue
    seen.add(node); stack.extend(adj[node])
return len(seen)==n`,c('validTree',[['5,[[0,1],[0,2],[0,3],[1,4]]','True'],['5,[[0,1],[1,2],[2,0],[3,4]]','False'],['1,[]','True']])),
  p(323,'countComponents','n, edges','Count connected components in an undirected graph on vertices 0..n-1, including isolated vertices.',`adj=[[] for _ in range(n)]
for a,b in edges: adj[a].append(b); adj[b].append(a)
seen=set()
count=0
for root in range(n):
    if root in seen: continue
    count+=1
    stack=[root]
    while stack:
        node=stack.pop()
        if node in seen: continue
        seen.add(node); stack.extend(adj[node])
return count`,c('countComponents',[['5,[[0,1],[1,2],[3,4]]','2'],['3,[]','3'],['0,[]','0']])),
  p(206,'reverseList','head','Reverse a supplied ListNode chain by changing links. Return its new head.',`previous=None
while head:
    following=head.next
    head.next=previous
    previous,head=head,following
return previous`,[check('Reverse and terminate','assert list_values(Solution().reverseList(list_nodes([1,2,3])))==[3,2,1]'),check('Empty and one node','assert Solution().reverseList(None) is None\na=ListNode(5)\nassert Solution().reverseList(a) is a and a.next is None')]),
  p(141,'hasCycle','head','Return whether following next references can revisit a node. Compare object identity, not values.',`slow=fast=head
while fast and fast.next:
    slow=slow.next
    fast=fast.next.next
    if slow is fast: return True
return False`,[check('Cycle to an earlier node','a=list_nodes([3,2,0,-4])\na.next.next.next.next=a.next\nassert Solution().hasCycle(a) is True'),check('Repeated values do not imply a cycle','assert Solution().hasCycle(list_nodes([1,1,1])) is False\nassert Solution().hasCycle(None) is False')]),
  p(21,'mergeTwoLists','list1, list2','Merge two sorted ListNode chains into a sorted chain and return its head.',`dummy=ListNode()
tail=dummy
while list1 and list2:
    if list1.val<=list2.val: tail.next,list1=list1,list1.next
    else: tail.next,list2=list2,list2.next
    tail=tail.next
tail.next=list1 or list2
return dummy.next`,[check('Merge two inputs','assert list_values(Solution().mergeTwoLists(list_nodes([1,2,4]),list_nodes([1,3,4])))==[1,1,2,3,4,4]'),check('Empty inputs','assert Solution().mergeTwoLists(None,None) is None\nassert list_values(Solution().mergeTwoLists(None,list_nodes([0])))==[0]')]),
  p(23,'mergeKLists','lists','Merge a list of sorted ListNode chains. Return one sorted chain. Equal values must not require comparing node objects.',`heap=[]
counter=0
for node in lists:
    if node:
        heapq.heappush(heap,(node.val,counter,node)); counter+=1
dummy=ListNode()
tail=dummy
while heap:
    value,_,node=heapq.heappop(heap)
    tail.next=node; tail=node
    if node.next:
        heapq.heappush(heap,(node.next.val,counter,node.next)); counter+=1
tail.next=None
return dummy.next`,[check('Equal heap priorities','heads=[list_nodes([1,4,5]),list_nodes([1,3,4]),list_nodes([2,6])]\nassert list_values(Solution().mergeKLists(heads))==[1,1,2,3,4,4,5,6]'),check('No lists','assert Solution().mergeKLists([]) is None\nassert Solution().mergeKLists([None]) is None')]),
  p(19,'removeNthFromEnd','head, n','Remove the nth node from the end of a nonempty ListNode chain and return its head. n is valid.',`dummy=ListNode(0,head)
fast=slow=dummy
for _ in range(n): fast=fast.next
while fast.next: fast=fast.next; slow=slow.next
slow.next=slow.next.next
return dummy.next`,[check('Middle removal','assert list_values(Solution().removeNthFromEnd(list_nodes([1,2,3,4,5]),2))==[1,2,3,5]'),check('Head and only node','assert list_values(Solution().removeNthFromEnd(list_nodes([1,2]),2))==[2]\nassert Solution().removeNthFromEnd(list_nodes([1]),1) is None')]),
  p(143,'reorderList','head','Reorder the supplied chain in place as first, last, second, second-last, and so on. Preserve node identities; do not just change their values.',`if not head or not head.next: return
slow,fast=head,head.next
while fast and fast.next: slow=slow.next; fast=fast.next.next
second=slow.next
slow.next=None
previous=None
while second:
    following=second.next; second.next=previous
    previous,second=second,following
first,second=head,previous
while second:
    a,b=first.next,second.next
    first.next=second; second.next=a
    first,second=a,b`,[check('Even length and identities','a=list_nodes([1,2,3,4])\nold=[a,a.next,a.next.next,a.next.next.next]\nSolution().reorderList(a)\nassert list_values(a)==[1,4,2,3]\nassert a.next is old[3] and a.next.next is old[1]'),check('Odd length','a=list_nodes([1,2,3,4,5])\nSolution().reorderList(a)\nassert list_values(a)==[1,5,2,4,3]')]),
]
