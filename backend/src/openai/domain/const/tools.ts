import { AssistantTool, CodeInterpreterTool } from 'openai/resources/beta/assistants';

export const UnstructuredDataTool: AssistantTool = { type: 'file_search' };

export const StructuredDataTool: CodeInterpreterTool = { type: 'code_interpreter' };
