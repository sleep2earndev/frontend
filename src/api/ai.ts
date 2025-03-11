import backendService from "./service";

interface ResponseAI {
  id: string;
  created: number;
  choices:{
    message: Message;
  }[]
}

export interface Message {
  id: string;
  role: "assistant" | 'user';
  content: string;
  timestamp?:number
}

export async function getAIChat(
  messages: { role: string; content: string }[]
): Promise<Message> {
  const response = await backendService<ResponseAI>(`/user/chat-coach`, {
    method: "POST",
    body: JSON.stringify({
      messages,
    }),
  });
  
  return {
    ...response?.choices?.[0]?.message,
    timestamp: response?.created,
    id: response?.id
  };
}
