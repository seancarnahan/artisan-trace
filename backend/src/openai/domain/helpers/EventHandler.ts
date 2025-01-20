/* istanbul ignore file */
// TODO - STREAMING HANDLER (Somewhat functional, but need to have a good use case for this).

// import { StructuredLoggerService } from '@endpoint/nestjs-core-module';
// import EventEmitter from 'events';
// import OpenAI from 'openai';

// export class EventHandler extends EventEmitter {
//   protected client: OpenAI;
//   private threadId: string;
//   private toolCallback: (param: unknown) => Promise<unknown>;

//   constructor(
//     client: OpenAI,
//     toolCallback: (param: unknown) => Promise<unknown>,
//     threadId: string,
//     private readonly loggerService: StructuredLoggerService<{}>,
//   ) {
//     super();
//     this.client = client;
//     this.threadId = threadId;
//     this.toolCallback = toolCallback;
//   }

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   async onEvent(event: any) {
//     if (event.event === 'thread.run.requires_action') {
//       const runId = event.data.id;
//       const toolCall = event.data.required_action?.submit_tool_outputs.tool_calls[0];
//       const toolCallArguments = toolCall?.function.arguments;
//       const toolCallId = toolCall?.id;

//       const response = await this.toolCallback(toolCallArguments);

//       const stream = this.client.beta.threads.runs.submitToolOutputsStream(this.threadId, runId, {
//         tool_outputs: [
//           {
//             output: JSON.stringify(response),
//             tool_call_id: toolCallId,
//           },
//         ],
//       });

//       for await (const streamedEvent of stream) {
//         this.emit('event', streamedEvent);
//       }
//     }

//     this.processMessageDelta(event);
//   }

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   private processMessageDelta(event: any): void {
//     if (event.event === 'thread.message.delta') {
//       const content = event.data.delta!.content![0];

//       if (content.type === 'text' && 'text' in content) {
//         const val = content!.text!.value ?? '';

//         process.stdout.write(val);
//       } else {
//         this.loggerService.warn({
//           message: 'Unexpected content type',
//           contentType: content.type,
//         });
//       }
//     }
//   }
// }
