from collections import Counter, defaultdict, deque
from typing import List, Optional
import heapq
import json
import math
from functools import lru_cache


def _expect(actual, expected):
    assert actual == expected, f"Expected {expected!r}; got {actual!r}"
    if type(expected) is int:
        assert type(actual) is int, "Return an integer, not a boolean or float"
    if type(expected) is bool:
        assert type(actual) is bool, "Return a boolean, not an integer"


class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def list_nodes(values):
    dummy = ListNode()
    tail = dummy
    for value in values:
        tail.next = ListNode(value)
        tail = tail.next
    return dummy.next


def list_values(node):
    values, seen = [], set()
    while node:
        assert id(node) not in seen, "The result unexpectedly contains a cycle"
        seen.add(id(node))
        values.append(node.val)
        node = node.next
        assert len(values) < 1000, "Result list did not terminate"
    return values


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val, self.left, self.right = val, left, right


def tree_from(values):
    if not values or values[0] is None:
        return None
    root = TreeNode(values[0])
    queue = deque([root])
    index = 1
    while queue and index < len(values):
        node = queue.popleft()
        for side in ("left", "right"):
            if index < len(values) and values[index] is not None:
                child = TreeNode(values[index])
                setattr(node, side, child)
                queue.append(child)
            index += 1
    return root


def tree_values(root):
    if root is None:
        return []
    queue, result, seen = deque([root]), [], set()
    while queue:
        node = queue.popleft()
        if node is None:
            result.append(None)
        else:
            assert id(node) not in seen, "The result is cyclic or shares a child"
            seen.add(id(node))
            result.append(node.val)
            queue.extend((node.left, node.right))
    while result and result[-1] is None:
        result.pop()
    return result


class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []


def graph_from(adjacency):
    nodes = [Node(index + 1) for index in range(len(adjacency))]
    for node, neighbors in zip(nodes, adjacency):
        node.neighbors = [nodes[index - 1] for index in neighbors]
    return nodes[0] if nodes else None


def graph_nodes(root):
    queue, seen = deque([root] if root else []), set()
    while queue:
        node = queue.popleft()
        if node in seen:
            continue
        seen.add(node)
        queue.extend(node.neighbors)
    return seen


def graph_values(root):
    return {node.val: sorted(n.val for n in node.neighbors) for node in graph_nodes(root)}
