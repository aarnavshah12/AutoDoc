# Binary Search Documentation

## Function: `binary_search`

Perform a binary search on a sorted list to find the index of the target value.

### Parameters

- **data** (`list`): A list of elements, must be sorted in ascending order.
- **target** (`any`): The element to search for in the list.

### Returns

- **`int`**: The index of the target element if found, otherwise `-1`.

### Example

```python
from binary_search import binary_search

# Sorted list of elements
data = [1, 3, 5, 7, 9, 11, 13, 15]

# Target value to search for
target = 7

# Perform binary search
index = binary_search(data, target)

print(f"Index of {target}: {index}")
# Output: Index of 7: 3
```

### Detailed Description

The `binary_search` function uses the binary search algorithm to find the index of a specified target value in a sorted list. The list must be sorted in ascending order for the function to work correctly.

1. **Initialization**: 
    - `low` is initialized to `0`, the start of the list.
    - `high` is initialized to `len(data) - 1`, the end of the list.

2. **Search Loop**:
    - A `while` loop continues as long as `low` is less than or equal to `high`.
    - The middle index (`mid`) of the current search range is calculated as `(low + high) // 2`.
    - The target value is compared with the element at the middle index:
        - If the element at `mid` matches the target, `mid` is returned as the index.
        - If the target is less than the element at `mid`, `high` is adjusted to `mid - 1` to search the lower half of the range.
        - If the target is greater than the element at `mid`, `low` is adjusted to `mid + 1` to search the upper half of the range.

3. **Target Not Found**:
    - If the loop completes without finding the target, `-1` is returned, indicating that the target value is not in the list.

### Function Code

```python
def binary_search(data, target):
    """
    Perform a binary search on a sorted list to find the index of the target value.

    Parameters:
    data (list): A list of elements, must be sorted in ascending order.
    target (any): The element to search for in the list.

    Returns:
    int: The index of the target element if found, otherwise -1.
    """
    low = 0  # Initialize the low end of the search range
    high = len(data) - 1  # Initialize the high end of the search range

    while low <= high:
        mid = (low + high) // 2  # Calculate the middle index of the current search range

        if data[mid] == target:
            return mid  # Target value found at index mid
        elif target < data[mid]:
            high = mid - 1  # Target is in the lower half, adjust the high end
        else:
            low = mid + 1  # Target is in the upper half, adjust the low end

    return -1  # Target value not found in the list
```