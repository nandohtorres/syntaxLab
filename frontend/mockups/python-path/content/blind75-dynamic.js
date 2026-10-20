import { problem as p, cases as c } from './problem.js'
import { check } from './lesson.js'

export default [
  p(70,'climbStairs','n','Count ways to reach step n using moves of one or two steps. Treat zero steps as one empty sequence.',`a,b=1,1
for _ in range(n): a,b=b,a+b
return a`,c('climbStairs',[['2','2'],['3','3'],['5','8'],['0','1']])),
  p(322,'coinChange','coins, amount','Using unlimited coins of each positive denomination, return the fewest coins totaling amount; return -1 if impossible.',`dp=[0]+[float('inf')]*amount
for total in range(1,amount+1):
    for coin in coins:
        if coin<=total: dp[total]=min(dp[total],dp[total-coin]+1)
return -1 if dp[amount]==float('inf') else dp[amount]`,c('coinChange',[['[1,2,5],11','3'],['[2],3','-1'],['[1],0','0']])),
  p(300,'lengthOfLIS','nums','Return the length of a strictly increasing subsequence; it need not be contiguous. Equal values do not extend it.',`if not nums: return 0
dp=[1]*len(nums)
for i in range(len(nums)):
    for j in range(i):
        if nums[j]<nums[i]: dp[i]=max(dp[i],dp[j]+1)
return max(dp)`,c('lengthOfLIS',[['[10,9,2,5,3,7,101,18]','4'],['[7,7,7]','1'],['[]','0']])),
  p(1143,'longestCommonSubsequence','text1, text2','Return the length of a longest subsequence shared by both strings; retained characters stay in order but may skip positions.',`dp=[0]*(len(text2)+1)
for a in text1:
    next_row=[0]
    for j,b in enumerate(text2):
        next_row.append(dp[j]+1 if a==b else max(next_row[-1],dp[j+1]))
    dp=next_row
return dp[-1]`,c('longestCommonSubsequence',[['"abcde","ace"','3'],['"abc","def"','0'],['"","a"','0'],['"abc","abc"','3']])),
  p(139,'wordBreak','s, wordDict','Return whether s can be fully segmented into dictionary words. A word can be used repeatedly.',`words=set(wordDict)
dp=[True]+[False]*len(s)
for end in range(1,len(s)+1):
    dp[end]=any(dp[start] and s[start:end] in words for start in range(end))
return dp[-1]`,c('wordBreak',[['"leetcode",["leet","code"]','True'],['"applepenapple",["apple","pen"]','True'],['"catsandog",["cats","dog","sand","and","cat"]','False']])),
  p(39,'combinationSum','candidates, target','Return unique combinations of positive, distinct candidates totaling target. A candidate can be used repeatedly. Order is irrelevant.',`answer=[]
candidates=sorted(candidates)
def visit(index,remaining,path):
    if remaining==0:
        answer.append(path.copy())
        return
    for i in range(index,len(candidates)):
        value=candidates[i]
        if value>remaining: break
        path.append(value)
        visit(i,remaining-value,path)
        path.pop()
visit(0,target,[])
return answer`,[check('Combinations without duplicate arrangements','assert sorted(tuple(sorted(row)) for row in Solution().combinationSum([2,3,6,7],7))==[(2,2,3),(7,)]'),check('No solution','assert Solution().combinationSum([2],1)==[]'),check('Repeated candidate allowed','assert Solution().combinationSum([3],9)==[[3,3,3]]')]),
  p(198,'rob','nums','Return the maximum sum of nonadjacent nonnegative house values.',`skip=take=0
for value in nums: skip,take=max(skip,take),skip+value
return max(skip,take)`,c('rob',[['[1,2,3,1]','4'],['[2,7,9,3,1]','12'],['[]','0'],['[5]','5']])),
  p(213,'rob','nums','Houses form a circle, so the first and last are adjacent. Return the maximum sum without taking adjacent houses.',`def linear(values):
    a=b=0
    for value in values: a,b=b,max(b,a+value)
    return b
if len(nums)<=1: return sum(nums)
return max(linear(nums[:-1]),linear(nums[1:]))`,c('rob',[['[2,3,2]','3'],['[1,2,3,1]','4'],['[1]','1'],['[1,2]','2']])),
  p(91,'numDecodings','s','Digits encode letters 1 through 26. Return the number of full decodings. A standalone zero is invalid.',`if not s: return 0
dp=[1]+[0]*len(s)
for i in range(1,len(s)+1):
    if s[i-1]!='0': dp[i]+=dp[i-1]
    if i>=2 and 10<=int(s[i-2:i])<=26: dp[i]+=dp[i-2]
return dp[-1]`,c('numDecodings',[['"12"','2'],['"226"','3'],['"06"','0'],['"10"','1'],['"100"','0']])),
  p(62,'uniquePaths','m, n','Count routes from the top-left of an m-by-n grid to the bottom-right using only right and down moves. Both dimensions are positive.',`dp=[1]*n
for _ in range(1,m):
    for col in range(1,n): dp[col]+=dp[col-1]
return dp[-1]`,c('uniquePaths',[['3,7','28'],['3,2','3'],['1,1','1']])),
  p(55,'canJump','nums','Each nonnegative value is the furthest jump from that position. Return whether you can reach the last position of the nonempty list.',`reach=0
for index,length in enumerate(nums):
    if index>reach: return False
    reach=max(reach,index+length)
return True`,c('canJump',[['[2,3,1,1,4]','True'],['[3,2,1,0,4]','False'],['[0]','True'],['[2,0,0]','True']])),
  p(73,'setZeroes','matrix','Modify matrix in place: every row or column containing an original zero becomes all zeros. Do not let new zeros spread further.',`rows=set()
cols=set()
for r,row in enumerate(matrix):
    for col,value in enumerate(row):
        if value==0: rows.add(r); cols.add(col)
for r,row in enumerate(matrix):
    for col in range(len(row)):
        if r in rows or col in cols: row[col]=0`,[check('In-place row and column changes','a=[[1,1,1],[1,0,1],[1,1,1]]\nSolution().setZeroes(a)\nassert a==[[1,0,1],[0,0,0],[1,0,1]]'),check('Original zeros only','a=[[0,1,2],[3,4,5]]\nSolution().setZeroes(a)\nassert a==[[0,0,0],[0,4,5]]')]),
  p(54,'spiralOrder','matrix','Return matrix values in clockwise spiral order, starting at the top-left.',`if not matrix: return []
top,bottom,left,right=0,len(matrix)-1,0,len(matrix[0])-1
answer=[]
while top<=bottom and left<=right:
    answer.extend(matrix[top][left:right+1]); top+=1
    for row in range(top,bottom+1): answer.append(matrix[row][right])
    right-=1
    if top<=bottom:
        answer.extend(matrix[bottom][left:right+1][::-1]); bottom-=1
    if left<=right:
        for row in range(bottom,top-1,-1): answer.append(matrix[row][left])
        left+=1
return answer`,c('spiralOrder',[['[[1,2,3],[4,5,6],[7,8,9]]','[1,2,3,6,9,8,7,4,5]'],['[[1,2,3]]','[1,2,3]'],['[[1],[2],[3]]','[1,2,3]'],['[]','[]']])),
  p(48,'rotate','matrix','Rotate a square matrix 90 degrees clockwise in place.',`n=len(matrix)
for row in range(n):
    for col in range(row+1,n): matrix[row][col],matrix[col][row]=matrix[col][row],matrix[row][col]
for row in matrix: row.reverse()`,[check('Square rotation','a=[[1,2,3],[4,5,6],[7,8,9]]\nSolution().rotate(a)\nassert a==[[7,4,1],[8,5,2],[9,6,3]]'),check('Single cell','a=[[4]]\nSolution().rotate(a)\nassert a==[[4]]')]),
  p(79,'exist','board, word','Return whether word can be formed by orthogonally adjacent cells, using each cell at most once in that path.',`if not word: return True
if not board: return False
rows,cols=len(board),len(board[0])
seen=set()
def visit(r,c,index):
    if index==len(word): return True
    if not (0<=r<rows and 0<=c<cols) or (r,c) in seen or board[r][c]!=word[index]: return False
    seen.add((r,c))
    found=any(visit(nr,nc,index+1) for nr,nc in [(r+1,c),(r-1,c),(r,c+1),(r,c-1)])
    seen.remove((r,c))
    return found
return any(visit(r,c,0) for r in range(rows) for c in range(cols))`,c('exist',[['[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]],"ABCCED"','True'],['[["A","B"],["C","D"]],"ABA"','False'],['[["a"]],"a"','True']])),
]
