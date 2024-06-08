# `binary_search_recursive` Function Documentation

## Description

The `binary_search_recursive` function performs a binary search to find the target element in a sorted array. This method uses a recursive approach to divide the search range in half until the target element is found or the search range becomes invalid.

## Function Signature

```python
def binary_search_recursive(arr, target, low=0, high=None):
```

## Parameters

- **arr** (`list`): The sorted array to search through.
- **target**: The element to search for.
- **low** (`int`, optional): The lower bound index of the search range. Default is `0`.
- **high** (`int`, optional): The upper bound index of the search range. Default is `None`.

## Returns

- **int**: The index of the target element if found, otherwise `-1`.

## Detailed Description

1. **Initialization**:
    - If the `high` parameter is `None` during the first call, it is initialized to the last index of the array (`len(arr) - 1`).

2. **Base Case**:
    - If the `low` index exceeds the `high` index, the search range is invalid, and the function returns `-1`.

3. **Middle Calculation**:
    - The middle index (`mid`) is calculated as the integer division of `(low + high) // 2`.

4. **Comparison**:
    - If the element at the middle index (`arr[mid]`) is equal to the `target`, the function returns the `mid` index.
    - If `arr[mid]` is less than the `target`, the search continues in the right half (`mid + 1` to `high`).
    - If `arr[mid]` is greater than the `target`, the search continues in the left half (`low` to `mid - 1`).

## Example Usage

```python
# Example array and target element
arr = [2, 3, 4, 10, 40]
target = 10

# Perform the binary search
result = binary_search_recursive(arr, target)

# Output the result
if result != -1:
    print("Element is present at index", str(result))
else:
    print("Element is not present in array")
```

### Expected Output

```
Element is present at index 3
```

## Notes

- Ensure that the input array `arr` is sorted. The binary search algorithm requires a sorted array to function correctly.
- The function operates with a time complexity of \(O(\log n)\) due to the halving of the search range at each step.
- The default parameters (`low=0` and `high=None`) make the function call simpler when searching through the entire array.