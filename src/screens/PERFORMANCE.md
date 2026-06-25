# HMSPatientApp Performance Optimizations

This document outlines the key performance optimization techniques that have been implemented in the HMSPatientApp. Understanding and applying these principles is crucial for maintaining a smooth, responsive, and efficient user experience.

## Table of Contents

1.  [Memoization Hooks: `useCallback`, `useMemo`, and `React.memo`](#1-memoization-hooks-usecallback-usememo-and-reactmemo)
2.  Advanced `FlatList` Optimizations
3.  Efficient Data Fetching & State Management
4.  General Best Practices

---

## 1. Memoization Hooks: `useCallback`, `useMemo`, and `React.memo`

Memoization is the core strategy for preventing unnecessary re-renders in React. A component re-renders if its state changes or its parent re-renders. Memoization helps by caching functions and values, ensuring they only change when their dependencies do.

### `useCallback`

This hook memoizes callback functions. Without it, a new function is created on every render. When these functions are passed as props to child components, they can trigger unwanted re-renders in those children.

- **Why it's used:** To maintain the same function reference across renders, which is critical for props passed to memoized child components (like those in a `FlatList`).
- **Implementation:** We use `useCallback` extensively for navigation functions, event handlers, and `FlatList` render props.

  ```typescriptreact
  // c:\Users\308247\Desktop\HMS-REACTN\HMSPatientApp\src\screens\HomeScreen.tsx

  const navigateToBookDoctor = useCallback(
    (doctorEmployeeCode: string) => {
      navigation.navigate("AppointmentsTab", {
        screen: "BookAppointment",
        params: { preselectedDoctorId: doctorEmployeeCode },
      });
    },
    [navigation], // The function is only re-created if `navigation` changes.
  );
  ```

### `useMemo`

This hook memoizes the result of an expensive calculation. It re-runs the calculation only when one of its dependencies has changed, preventing costly computations on every render.

- **Why it's used:** To avoid re-calculating complex derived data from props or state on every render.
- **Implementation:** In `HomeScreen.tsx`, we use `useMemo` to derive data like the next appointment and filter the list of doctors based on the search query.

  ```typescriptreact
  // c:\Users\308247\Desktop\HMS-REACTN\HMSPatientApp\src\screens\HomeScreen.tsx

  const filteredDoctors = useMemo(() => {
    if (!searchQuery.trim()) return EMPTY_ARRAY;
    const query = searchQuery.toLowerCase();
    return doctors.filter(
      (d) =>
        d.name.toLowerCase().includes(query) ||
        d.specialization?.toLowerCase().includes(query) ||
        d.designation?.toLowerCase().includes(query),
    );
  }, [doctors, searchQuery]); // This expensive filtering only runs if `doctors` or `searchQuery` changes.
  ```

### `React.memo`

`React.memo` is a Higher-Order Component (HOC) that memoizes an entire component. It performs a shallow comparison of the component's props and prevents a re-render if the props have not changed. It's the component-level equivalent of `useMemo`. While not explicitly used in the screen files, components like `AppointmentCard` and `MedicalRecordCard` are prime candidates for being wrapped in `React.memo` to prevent them from re-rendering unnecessarily when their parent list scrolls or re-renders.

---

## 2. Advanced `FlatList` Optimizations

`FlatList` is powerful but can easily cause performance issues if not configured correctly. The following optimizations have been applied to ensure smooth scrolling and efficient memory usage.

### Key `FlatList` Props

- **`keyExtractor`**: Provides a unique, stable string key for each item. This is **the most critical prop** for `FlatList` performance, as it allows React to track items efficiently during re-orders, additions, or removals, preventing it from having to re-render the entire list.

  ```typescriptreact
  // c:\Users\308247\Desktop\HMS-REACTN\HMSPatientApp\src\screens\MedicalRecordsScreen.tsx
  const keyExtractor = useCallback(
    (item: MedicalRecord) => item._id || item.recordCode,
    [],
  );
  ```

- **Memoized Render Props**: Functions like `renderItem`, `ListHeaderComponent`, and `ListFooterComponent` are wrapped in `useCallback` to ensure they have a stable reference.

  **Crucial Fix:** A significant performance issue was resolved by changing `ListHeaderComponent={renderListHeader()}` to `ListHeaderComponent={renderListHeader}`. Calling the function directly (`()`) creates a new component on **every single render**, causing massive frame drops. Passing the function reference allows `FlatList` to use the memoized version.

- **Virtualization Props**: These props control how many items are rendered in memory, which is key to handling long lists.
  - **`initialNumToRender`**: Controls how many items are rendered on the initial screen load. A smaller number improves the initial render time.
  - **`maxToRenderPerBatch`**: Defines how many items are rendered in each batch as the user scrolls.
  - **`windowSize`**: Defines a "window" of rendered items. A `windowSize` of `11` means the visible items, plus 5 screens above and 5 screens below, are kept rendered. This reduces blank spaces during fast scrolling.
  - **`removeClippedSubviews={true}`**: (Android only) This prop unmounts views that are scrolled far off-screen, saving significant memory on Android.

### Infinite Scroll (Pagination)

The `MedicalRecordsScreen` was refactored to implement "infinite scroll." Instead of fetching all records at once, it fetches data in pages.

- **Why it's used:** Drastically reduces initial load time, network usage, and memory consumption for potentially long lists of data.
- **Implementation:**
  1.  The `recordService` was updated to handle `page` and `limit` parameters.
  2.  The screen maintains `page` and `hasMore` in its state.
  3.  The `onEndReached` prop of the `FlatList` is used to trigger a function that increments the page number and fetches the next page of data.
  4.  A loading indicator is shown in the `ListFooterComponent` while more data is being fetched.

  ```typescriptreact
  // c:\Users\308247\Desktop\HMS-REACTN\HMSPatientApp\src\screens\MedicalRecordsScreen.tsx
  <FlatList
    // ...
    onEndReached={handleLoadMore}
    onEndReachedThreshold={0.5}
    ListFooterComponent={renderListFooter}
    // ...
  />
  ```

---

## 3. Efficient Data Fetching & State Management

### Consolidating Fetching Logic

The `MedicalRecordsScreen` initially had complex logic spread across multiple `useEffect` hooks, which led to race conditions and "duplicate key" warnings.

- **The Fix:** The logic was consolidated into a single `fetchRecords(page: number)` function. This function now handles initial loads, refreshes, and loading more data. This makes the component more robust, easier to reason about, and eliminates race conditions.

### Preventing Updates on Unmounted Components

Asynchronous operations (like data fetching) can complete after a component has been unmounted, leading to React warnings and potential memory leaks.

- **The Fix:** We use a `useRef` (`isMounted`) to track the component's mounted state. Before any state update in an async callback, we check if `isMounted.current` is true.

  ```typescriptreact
  // c:\Users\308247\Desktop\HMS-REACTN\HMSPatientApp\src\screens\HomeScreen.tsx
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false; // Set to false on unmount
    };
  }, []);

  // In an async function:
  if (isMounted.current) {
    setAppointments(appointmentsData);
  }
  ```

---

## 4. General Best Practices

### Stable Object & Array References

Passing a new array or object literal (`[]` or `{}`) as a prop will always cause a re-render in child components, even if the data is empty.

- **The Fix:** We define a constant `EMPTY_ARRAY` at the top of the file. When a list is empty, we pass this stable reference to the `FlatList`'s `data` prop, preventing an unnecessary re-render.

  ```typescriptreact
  // c:\Users\308247\Desktop\HMS-REACTN\HMSPatientApp\src\screens\MedicalRecordsScreen.tsx
  const EMPTY_ARRAY: MedicalRecord[] = [];

  // ...

  <FlatList
    data={records.length > 0 ? records : EMPTY_ARRAY}
    // ...
  />
  ```
