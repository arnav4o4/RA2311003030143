# Stage 1: Priority Inbox Design

## Approach
The Priority Inbox is designed to help students focus on the most critical notifications amidst high volume. The priority is determined by a combination of **Category Weight** and **Recency**.

### Sorting Logic
1.  **Weight-based Priority:** Different types of notifications are assigned weights:
    *   `Placement`: 3 (Highest)
    *   `Result`: 2
    *   `Event`: 1 (Lowest)
2.  **Recency:** Within the same category, newer notifications (based on `Timestamp`) take precedence.

The sorting algorithm first compares the weights. If weights are equal, it compares the timestamps in descending order.

## Efficient Maintenance of Top 10
To maintain the Top 10 notifications efficiently as new data arrives, we can use the following strategies:

### 1. Min-Heap Strategy (Recommended for Streaming)
*   Maintain a **Min-Heap** of size 10.
*   The heap stores the current "top 10" notifications.
*   The comparison criteria for the Min-Heap is the same as our sorting logic (Weight, then Timestamp), but in reverse (so the "least important" of the top 10 is at the root).
*   **When a new notification arrives:**
    *   Compare it with the root of the heap.
    *   If the new notification is more important than the root, remove the root and insert the new notification.
    *   This ensures $O(\log 10)$ insertion time, which is effectively constant.

### 2. Slit-Window/Partial Sort
*   If we are processing batches, we can use a "QuickSelect" algorithm or a partial sort to find the top 10 in $O(N)$ average time rather than $O(N \log N)$ for a full sort.

### 3. Database Indexing
*   In a real-world scenario with a database, we would use a composite index on `(Type, Timestamp)` to allow the database engine to fetch the top 'n' results very efficiently without scanning the entire table.

## Implementation Details
The current implementation uses a JavaScript `sort()` function on the fetched array, which is efficient for moderate volumes. For production-scale streaming, the Min-Heap approach would be integrated into the ingestion pipeline.
