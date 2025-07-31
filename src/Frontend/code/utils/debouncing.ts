export function debounce<T extends (...args: any[]) => any>(
  fn: T, // function to be called after last call with delay
  delay: number // ms
): (...args: Parameters<T>) => void {
  let timerID: ReturnType<typeof setTimeout>;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timerID); // reset old timer 
    // aply new one
    timerID = setTimeout(() => {
      fn.apply(this, args); // binds this and its args to the function template
    }, delay);
  };
}