"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { clientPusher } from "../pusher";
import { Message } from "../typings";
import fetcher from "../utils/fetchMessages";
import MessageComponent from "./MessageComponent";

type Props = {
  initialMessages: Message[];
};

function MessageList({ initialMessages }: Props) {
  const { data: messages, error, mutate } = useSWR("/api/getMessages", fetcher);

  useEffect(() => {
    const channel = clientPusher.subscribe("messages");
    channel.bind("new-message", async (data: Message) => {
      // if you sent the message dont need to update
      if (messages?.find((message) => message.id === data.id)) return;

      if (!messages) {
        mutate(fetcher);
      } else {
        mutate(fetcher, {
          optimisticData: [data, ...messages!],
          rollbackOnError: true,
        });
      }
    });

    // clean up
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages, mutate, clientPusher]);

  return (
    <div className="space-y-5 px-5 pt-8 pb-32 max-w-2xl xl:max-w-4xl mx-auto">
      {(messages || initialMessages)?.map((message) => (
        <MessageComponent key={message.id} message={message} />
      ))}
    </div>
  );
}

export default MessageList;
