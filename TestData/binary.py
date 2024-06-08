python
def binary_search_recursive(arr, target, low=0, high=None):
    """
    Perform a binary search to find the target element in a sorted array.

    Parameters:
    arr (list): The sorted array to search through.
    target: The element to search for.
    low (int): The lower bound index of the search range.
    high (int): The upper bound index of the search range.

    Returns:
    int: The index of the target element if found, otherwise -1.
    """
    # Initialize the high index during the first call
    if high is None:
        high = len(arr) - 1

    # Base case: If the search range is invalid
    if low > high:
        return -1

    # Calculate the middle index
    mid = (low + high) // 2

    # Check if the middle element is the target
    if arr[mid] == target:
        return mid
    # If the middle element is less than the target, search the right half
    elif arr[mid] < target:
        return binary_search_recursive(arr, target, mid + 1, high)
    # If the middle element is greater than the target, search the left half
    else:
        return binary_search_recursive(arr, target, low, mid - 1)

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