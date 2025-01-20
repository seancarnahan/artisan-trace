export interface FunctionToolCall {
  id: string;
  type: string;
  function: {
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    arguments: any;
  };
}
