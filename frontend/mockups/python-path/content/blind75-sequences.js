import { problem as p, cases as c } from './problem.js'
import { check } from './lesson.js'

export default [
  p(1,'twoSum','nums, target','Return the indices of two different positions whose values sum to target. Each fixture has one answer; index order may vary.',`seen={}
for index,value in enumerate(nums):
    if target-value in seen: return [seen[target-value],index]
    seen[value]=index`,[
    ...[[[2,7,11,15],9],[[3,2,4],6],[[3,3],6]].map(([a,t],i)=>check(`Pair ${i+1}`,`nums=${JSON.stringify(a)}\nanswer=Solution().twoSum(nums,${t})\nassert len(answer)==2 and answer[0]!=answer[1]\nassert all(type(i) is int and 0<=i<len(nums) for i in answer)\nassert nums[answer[0]]+nums[answer[1]]==${t}`)),
  ]),
  p(121,'maxProfit','prices','Return the largest gain from one buy followed by a later sell. Return 0 when no profitable trade exists.',`low=float('inf')
best=0
for price in prices:
    best=max(best,price-low)
    low=min(low,price)
return best`,c('maxProfit', [['[7,1,5,3,6,4]','5'],['[7,6,4,3,1]','0'],['[1]','0']])),
  p(217,'containsDuplicate','nums','Return True if any integer appears more than once, otherwise False.',`seen=set()
for value in nums:
    if value in seen: return True
    seen.add(value)
return False`,c('containsDuplicate',[['[1,2,3,1]','True'],['[1,2,3]','False'],['[]','False'],['[0,0]','True']])),
  p(238,'productExceptSelf','nums','Return one product per position: all other elements multiplied together. Handle zeros. Practice prefix/suffix products without division.',`answer=[1]*len(nums)
prefix=1
for i,value in enumerate(nums):
    answer[i]=prefix
    prefix*=value
suffix=1
for i in range(len(nums)-1,-1,-1):
    answer[i]*=suffix
    suffix*=nums[i]
return answer`,c('productExceptSelf',[['[1,2,3,4]','[24,12,8,6]'],['[-1,1,0,-3,3]','[0,0,9,0,0]'],['[0,0]','[0,0]']])),
  p(53,'maxSubArray','nums','Return the maximum sum of a nonempty contiguous part of nums. The input is nonempty.',`best=current=nums[0]
for value in nums[1:]:
    current=max(value,current+value)
    best=max(best,current)
return best`,c('maxSubArray',[['[-2,1,-3,4,-1,2,1,-5,4]','6'],['[-3,-1,-2]','-1'],['[5]','5']])),
  p(152,'maxProduct','nums','Return the largest product from a nonempty contiguous part of nums. Negative values can swap the smallest and largest running products.',`low=high=best=nums[0]
for value in nums[1:]:
    options=(value,low*value,high*value)
    low,high=min(options),max(options)
    best=max(best,high)
return best`,c('maxProduct',[['[2,3,-2,4]','6'],['[-2,0,-1]','0'],['[-2,3,-4]','24'],['[-2]','-2']])),
  p(153,'findMin','nums','A nonempty sorted distinct array was rotated, possibly zero times. Return its minimum.',`lo,hi=0,len(nums)-1
while lo<hi:
    mid=(lo+hi)//2
    if nums[mid]>nums[hi]: lo=mid+1
    else: hi=mid
return nums[lo]`,c('findMin',[['[3,4,5,1,2]','1'],['[1,2,3]','1'],['[1]','1'],['[2,1]','1']])),
  p(33,'search','nums, target','Search a rotated sorted distinct array. Return the target index or -1.',`lo,hi=0,len(nums)-1
while lo<=hi:
    mid=(lo+hi)//2
    if nums[mid]==target: return mid
    if nums[lo]<=nums[mid]:
        if nums[lo]<=target<nums[mid]: hi=mid-1
        else: lo=mid+1
    else:
        if nums[mid]<target<=nums[hi]: lo=mid+1
        else: hi=mid-1
return -1`,c('search',[['[4,5,6,7,0,1,2],0','4'],['[4,5,6,7,0,1,2],3','-1'],['[1],0','-1'],['[],4','-1']])),
  p(15,'threeSum','nums','Return every unique triple of values summing to zero. Do not reuse an input position. Result order does not matter.',`nums=sorted(nums)
result=[]
for i in range(len(nums)-2):
    if i and nums[i]==nums[i-1]: continue
    left,right=i+1,len(nums)-1
    while left<right:
        total=nums[i]+nums[left]+nums[right]
        if total<0: left+=1
        elif total>0: right-=1
        else:
            result.append([nums[i],nums[left],nums[right]])
            left+=1
            right-=1
            while left<right and nums[left]==nums[left-1]: left+=1
return result`,[check('Unique triples','assert sorted(tuple(sorted(row)) for row in Solution().threeSum([-1,0,1,2,-1,-4]))==[(-1,-1,2),(-1,0,1)]'),check('Repeated zeros','assert Solution().threeSum([0,0,0,0])==[[0,0,0]]'),check('No triple','assert Solution().threeSum([1,2])==[]')]),
  p(11,'maxArea','height','Choose two positions forming a container. Its area is their distance times the shorter height. Return the maximum area.',`left,right=0,len(height)-1
best=0
while left<right:
    best=max(best,(right-left)*min(height[left],height[right]))
    if height[left]<height[right]: left+=1
    else: right-=1
return best`,c('maxArea',[['[1,8,6,2,5,4,8,3,7]','49'],['[1,1]','1'],['[4,3,2,1,4]','16']])),
  p(3,'lengthOfLongestSubstring','s','Return the length of the longest contiguous substring with no repeated character.',`seen={}
left=best=0
for right,char in enumerate(s):
    if char in seen: left=max(left,seen[char]+1)
    seen[char]=right
    best=max(best,right-left+1)
return best`,c('lengthOfLongestSubstring',[['"abcabcbb"','3'],['"bbbbb"','1'],['""','0'],['"abba"','2']])),
  p(424,'characterReplacement','s, k','For an uppercase string, return the largest window that can become one repeated character by replacing at most k characters.',`counts=Counter()
left=best=0
for right,char in enumerate(s):
    counts[char]+=1
    while right-left+1-max(counts.values())>k:
        counts[s[left]]-=1
        left+=1
    best=max(best,right-left+1)
return best`,c('characterReplacement',[['"ABAB",2','4'],['"AABABBA",1','4'],['"ABC",0','1'],['"",1','0']])),
  p(76,'minWindow','s, t','Return the shortest substring of s covering every character of t with its multiplicity. Return an empty string if impossible. Fixtures have a unique shortest answer.',`if not t: return ''
need=Counter(t)
missing=len(t)
left=0
best=(0,len(s)+1)
for right,char in enumerate(s):
    if need[char]>0: missing-=1
    need[char]-=1
    while missing==0:
        if right-left+1<best[1]-best[0]: best=(left,right+1)
        need[s[left]]+=1
        if need[s[left]]>0: missing+=1
        left+=1
return '' if best[1]>len(s) else s[best[0]:best[1]]`,c('minWindow',[['"ADOBECODEBANC","ABC"','"BANC"'],['"a","aa"','""'],['"aa","aa"','"aa"'],['"abc",""','""']])),
  p(242,'isAnagram','s, t','Return whether the two strings have exactly the same character counts.',`return Counter(s)==Counter(t)`,c('isAnagram',[['"anagram","nagaram"','True'],['"rat","car"','False'],['"aacc","ccac"','False']])),
  p(49,'groupAnagrams','strs','Group words by character counts. Preserve duplicates. Group and word ordering do not matter.',`groups=defaultdict(list)
for word in strs:
    groups[tuple(sorted(word))].append(word)
return list(groups.values())`,[check('Groups','a=Solution().groupAnagrams(["eat","tea","tan","ate","nat","bat"])\nassert sorted(sorted(g) for g in a)==[["ate","eat","tea"],["bat"],["nat","tan"]]'),check('Empty strings and duplicates','assert Solution().groupAnagrams(["",""])==[["",""]]')]),
  p(20,'isValid','s','The string contains only ()[]{}. Return whether every opener is closed in the right order.',`stack=[]
pairs={')':'(',']':'[','}':'{'}
for char in s:
    if char not in pairs: stack.append(char)
    elif not stack or stack.pop()!=pairs[char]: return False
return not stack`,c('isValid',[['"()[]{}"','True'],['"([)]"','False'],['"("','False'],['""','True']])),
  p(125,'isPalindrome','s','Ignore non-alphanumeric characters and case. Return whether the remaining text reads the same in both directions.',`left,right=0,len(s)-1
while left<right:
    if not s[left].isalnum(): left+=1
    elif not s[right].isalnum(): right-=1
    elif s[left].lower()!=s[right].lower(): return False
    else: left+=1; right-=1
return True`,c('isPalindrome',[['"A man, a plan, a canal: Panama"','True'],['"race a car"','False'],['" "','True']])),
  p(5,'longestPalindrome','s','Return any longest palindromic substring. Either equally long answer is accepted.',`best=''
for center in range(len(s)):
    for left,right in ((center,center),(center,center+1)):
        while left>=0 and right<len(s) and s[left]==s[right]:
            if right-left+1>len(best): best=s[left:right+1]
            left-=1
            right+=1
return best`,[check('Equal longest answers allowed','assert Solution().longestPalindrome("babad") in {"bab","aba"}'),check('Even center','assert Solution().longestPalindrome("cbbd")=="bb"'),check('Single character','assert Solution().longestPalindrome("a")=="a"')]),
  p(647,'countSubstrings','s','Count palindromic substrings by position, including single characters.',`total=0
for center in range(len(s)):
    for left,right in ((center,center),(center,center+1)):
        while left>=0 and right<len(s) and s[left]==s[right]:
            total+=1
            left-=1
            right+=1
return total`,c('countSubstrings',[['"abc"','3'],['"aaa"','6'],['""','0']])),
  p(271,'encode','strings','Implement Codec.encode(strings) and Codec.decode(text) to round-trip arbitrary strings, including empty strings and delimiter characters.', '',[
    check('Round trip','for words in [[],[""],["api","db"],["3#abc","#","","a\\nb"]]:\n    encoded=Codec().encode(words)\n    assert type(encoded) is str\n    assert Codec().decode(encoded)==words'),
  ],{initialFiles:{'main.py':'class Codec:\n    def encode(self, strings):\n        pass\n\n    def decode(self, text):\n        pass\n'},solutionFiles:{'main.py':`class Codec:
    def encode(self,strings):
        return ''.join(str(len(word))+'#'+word for word in strings)
    def decode(self,text):
        result=[]
        index=0
        while index<len(text):
            stop=text.index('#',index)
            size=int(text[index:stop])
            start=stop+1
            result.append(text[start:start+size])
            index=start+size
        return result`}}),
  p(57,'insert','intervals, newInterval','Insert one closed interval into sorted non-overlapping closed intervals, merging overlaps. Touching endpoints merge.',`result=[]
start,end=newInterval
for a,b in intervals:
    if b<start: result.append([a,b])
    elif a>end:
        result.append([start,end])
        start,end=a,b
    else: start,end=min(start,a),max(end,b)
return result+[[start,end]]`,c('insert',[['[[1,3],[6,9]],[2,5]','[[1,5],[6,9]]'],['[],[2,3]','[[2,3]]'],['[[1,2],[3,5],[6,7],[8,10],[12,16]],[4,8]','[[1,2],[3,10],[12,16]]']])),
  p(56,'merge','intervals','Merge overlapping closed intervals and return them ordered by start. Touching endpoints merge.',`result=[]
for start,end in sorted(intervals):
    if result and start<=result[-1][1]: result[-1][1]=max(result[-1][1],end)
    else: result.append([start,end])
return result`,c('merge',[['[[1,3],[2,6],[8,10],[15,18]]','[[1,6],[8,10],[15,18]]'],['[[1,4],[4,5]]','[[1,5]]'],['[]','[]']])),
  p(435,'eraseOverlapIntervals','intervals','Return the fewest intervals to remove so the rest do not overlap. Touching endpoints are allowed.',`end=-float('inf')
removed=0
for start,stop in sorted(intervals,key=lambda row:row[1]):
    if start<end: removed+=1
    else: end=stop
return removed`,c('eraseOverlapIntervals',[['[[1,2],[2,3],[3,4],[1,3]]','1'],['[[1,2],[1,2],[1,2]]','2'],['[]','0']])),
  p(252,'canAttendMeetings','intervals','Return whether one person can attend all meetings. Meetings are half-open intervals; touching endpoints do not conflict.',`ordered=sorted(intervals)
return all(ordered[i-1][1]<=ordered[i][0] for i in range(1,len(ordered)))`,c('canAttendMeetings',[['[[0,30],[5,10],[15,20]]','False'],['[[1,2],[2,3]]','True'],['[]','True']])),
  p(253,'minMeetingRooms','intervals','Return the minimum rooms needed for half-open meetings with start < end.',`ends=[]
best=0
for start,end in sorted(intervals):
    while ends and ends[0]<=start: heapq.heappop(ends)
    heapq.heappush(ends,end)
    best=max(best,len(ends))
return best`,c('minMeetingRooms',[['[[0,30],[5,10],[15,20]]','2'],['[[1,2],[2,3]]','1'],['[]','0']])),
  p(371,'getSum','a, b','Add two signed 32-bit integers using bit operations. Return the signed result, with 32-bit wrapping.',`mask=0xffffffff
while b:
    a,b=(a^b)&mask,((a&b)<<1)&mask
return a if a<0x80000000 else ~(a^mask)`,c('getSum',[['1,2','3'],['-2,3','1'],['-4,-5','-9'],['2147483647,1','-2147483648']])),
  p(191,'hammingWeight','n','Count the set bits in a nonnegative 32-bit integer.',`count=0
while n:
    n&=n-1
    count+=1
return count`,c('hammingWeight',[['11','3'],['0','0'],['4294967295','32']])),
  p(338,'countBits','n','Return the number of set bits for every integer from 0 through n.',`answer=[0]*(n+1)
for i in range(1,n+1): answer[i]=answer[i>>1]+(i&1)
return answer`,c('countBits',[['5','[0,1,1,2,1,2]'],['0','[0]']])),
  p(268,'missingNumber','nums','A distinct list contains every integer from 0 through n except one, where n is its length. Return the missing value.',`answer=len(nums)
for index,value in enumerate(nums): answer^=index^value
return answer`,c('missingNumber',[['[3,0,1]','2'],['[0,1]','2'],['[1]','0']])),
  p(190,'reverseBits','n','Reverse exactly 32 bits of a nonnegative 32-bit integer. Leading zeros count.',`answer=0
for _ in range(32):
    answer=(answer<<1)|(n&1)
    n>>=1
return answer`,c('reverseBits',[['43261596','964176192'],['0','0'],['1','2147483648']])),
]
