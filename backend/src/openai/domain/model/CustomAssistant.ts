// istanbul ignore file

import { AssistantCreateParams, AssistantTool, FunctionTool } from 'openai/resources/beta/assistants';
import * as ThreadsAPI from 'openai/resources/beta/threads/threads';

export abstract class CustomAssistant {
  public abstract name: string;
  public abstract description: string;
  public abstract instructions: string;
  public abstract tools: AssistantTool[] | FunctionTool[];
  public abstract toolResources: AssistantCreateParams.ToolResources;
  public abstract responseFormat?: ThreadsAPI.AssistantResponseFormatOption;
  public abstract temperature?: number;
}
