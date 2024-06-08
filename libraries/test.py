python
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